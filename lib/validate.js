'use strict';

require('colors');
const fs = require('fs');
const node_path = require('path');
const csv = require("csvtojson");
const { get_project_directory } =  require('./configuration');
const validate_fields_map = require('./util/validate-fields-map');
const validate_header =  require('./util/validate-header');
const convert_diamond = require('./util/convert-diamond');
const get_std_header = require('./util/get-std-header');
const write_to_csv = require('./util/write-to-csv');
const { assets_stats_types } = require('./cfg/assets-config');
const get_checksum = require('./util/get-checksum');
const clean_fields_maps = require('./util/clean-fields-maps');

module.exports = {
    parse_inventory_csv,
    mk_inventory_reports,
};

async function parse_inventory_csv(csv_filepath, fields_map, agreed_header, options) {

    if (!csv_filepath) {
        throw new Error('csv_filepath is missing');
    }
    if (!fields_map) {
        throw new Error('required fields_map is missing');
    }
    if (!agreed_header || !Array.isArray(agreed_header)) {
        throw new Error('agreed_header is not array');
    }
    
    fields_map = clean_fields_maps(fields_map);

    // validate fields_map
    //
    const errors = validate_fields_map(fields_map);
    if (errors && errors.length > 0) {
        return {errors};
    }

    const header_errors = [];
    let header_ok;

    const convertor = csv({trim: true});

    convertor.on('header', (header) => {

        // validate header
        //
        header_ok = validate_header(header, agreed_header, fields_map, header_errors);

    });
    
    //console.log(fields_map);

    const diamonds = [];
    const timestamp = Date.now();
    let ok_count = 0;
    
    convertor.subscribe(async (row, index) => {

        // convert, validate and collect data per row
        //
        const result = await convert_diamond(row, fields_map, options);

        //console.log(result);

        const diamond = {row_no: index + 1, timestamp, ...result}

        if (options && options.diamond_extension) {
            try {
                await options.diamond_extension(diamond, fields_map);
            } catch(err) {
                console.error('ERROR: call diamond_extension', err);
            }
        }
        
        if (diamond.pass) {
            ok_count++;
        }
        diamonds.push(diamond);

    });
    
    try {
        // start it
        await convertor.fromFile(csv_filepath);

    } catch(err) {

        console.log(err);
    }

    if (options && options.diamonds_extension) {
        try {
            if (!await options.diamonds_extension(diamonds, header_errors)) {
                header_ok = false;
            }
        } catch(err) {
            console.error('ERROR: call diamonds_extension', err);
        }
    }

    // prepare result
    //
    const result = {header_ok, ok_count, total: diamonds.length, timestamp};
    if (header_errors.length > 0) {
        result.header_errors = header_errors;
    }
    result.diamonds = diamonds;

    return result;
}

async function mk_inventory_reports(result, options) {

    if (!result) {
        throw new Error('result data is empty');
    }

    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const report_dir = node_path.join(project_dir, 'report');
    if (fs.existsSync(report_dir)) {
        fs.rmdirSync(report_dir, {recursive: true});
    }
    fs.mkdirSync(report_dir, {recursive: true});

    const diamonds_errors = [];
    let header_has_error = false;
    if (result.header_errors && result.header_errors.length > 0) {
        const row_no = 0;
        for (const error of result.header_errors) {
            const field = error.field;
            for (const type of ['error', 'warning', 'info']) {
                if (error[type]) {
                    if (type === 'error') {
                        header_has_error = true;
                    }
                    const message = error[type];
                    diamonds_errors.push({row_no, field, type, message});
                    break;
                }
            }
        }
    }
    // there are header errors
    if (header_has_error) { 
        errors_report(report_dir, diamonds_errors);
        return;
    }

    const {header_ok, total, ok_count, diamonds} = result;

    if (header_ok && ok_count > 0) {
        console.log(`\nheader_ok: ${header_ok}, total diamonds: ${total}, passed count: ${ok_count}`.green);
    } else {
        console.log(`\nheader_ok: ${header_ok}, total diamonds: ${total}, passed count: ${ok_count}`.red);
    }
    console.log();

    const assets_stats = {};
    for (const key in assets_stats_types) {
        const type = assets_stats_types[key];
        assets_stats['urls for ' + type] = 0;
    }

    const diamonds_passed = [];
    const diamonds_warnings = [];
    for (const diamond of diamonds) {

        const {row_no, pass, vendor_sku, certificate_lab, certificate_number, errors} = diamond;
        if (!diamond.checksum) {
            diamond.checksum = get_checksum(diamond);
        }

        if (errors) {
            for (const error of errors) {
                const field = error.field;
                for (const key of ['error', 'warning', 'info']) {
                    if (error[key]) {
                        const type = key;
                        const message = error[key];
                        if (key === 'error') {
                            diamonds_errors.push({row_no, vendor_sku, certificate_lab, certificate_number, field, type, message});
                        } else {
                            diamonds_warnings.push({row_no, vendor_sku, certificate_lab, certificate_number, field, type, message});
                        }
                        break;
                    }
                }
            }
        }

        if (pass) {
            for (const key in assets_stats_types) {
                if (!diamond[key]) {
                    continue;
                }
                const type = assets_stats_types[key];
                assets_stats['urls for ' + type] += 1;
            }
            diamond.date_time = new Date(diamond.timestamp).toISOString();
            diamonds_passed.push(diamond);
        }
    }

    if (options && options.summary_report) {
        await options.summary_report(report_dir, header_ok, total, ok_count, diamonds_errors, diamonds_warnings, assets_stats);
    } else {
        await summary_report(report_dir, header_ok, total, ok_count, diamonds_errors, diamonds_warnings, assets_stats);
    }
    if (options && options.errors_report) {
        await options.errors_report(report_dir, diamonds_errors);
    } else {
        await errors_report(report_dir, diamonds_errors);
    }
    if (options && options.warning_report) {
        await options.warning_report(report_dir, diamonds_warnings);
    } else {
        await warning_report(report_dir, diamonds_warnings);
    }
    if (options && options.passed_report) {
        await options.passed_report(report_dir, diamonds_passed);
    } else {
        await passed_report(report_dir, diamonds_passed);
    }
    if (options && options.std_inventory_report) {
        await options.std_inventory_report(report_dir, diamonds);
    } else {
        await std_inventory_report(report_dir, diamonds);
    }

    console.log();
}

async function summary_report(report_dir, header_ok, total, ok_count, diamonds_errors, diamonds_warnings, assets_stats) {
    const summary_fields = ['header ok', 'total diamonds', 'passed count', 'errors count', 'warnings count'];
    for (const key in assets_stats_types) {
        const type = assets_stats_types[key];
        if (!summary_fields.includes('urls for ' + type)) {
            summary_fields.push('urls for ' + type);
        }
    }
    const summary_filepath = node_path.join(report_dir, 'summary.csv');
    const summary = [{'header ok': header_ok, 'total diamonds': total, 'passed count': ok_count, 'errors count': diamonds_errors.length, 'warnings count': diamonds_warnings.length, ...assets_stats}];
    await write_to_csv(summary_filepath, summary, summary_fields);
    console.log(`summary report is saved to ${summary_filepath}`);
}

async function errors_report(report_dir, diamonds_errors) {
    if (diamonds_errors.length > 0) {
        const errors_fields = ['row_no', 'vendor_sku', 'certificate_lab', 'certificate_number', 'field', 'type', 'message'];
        const errors_filepath = node_path.join(report_dir, 'errors.csv');
        await write_to_csv(errors_filepath, diamonds_errors, errors_fields);
        console.log(`${'errors report'.red} is saved to ${errors_filepath}`);
    }
}

async function warning_report(report_dir, diamonds_warnings) {
    const warnings_fields = ['row_no', 'vendor_sku', 'certificate_lab', 'certificate_number', 'field', 'type', 'message'];
    const warnings_filepath = node_path.join(report_dir, 'warnings.csv');
    await write_to_csv(warnings_filepath, diamonds_warnings, warnings_fields);
    console.log(`${'warnings report'.yellow} is saved to ${warnings_filepath}`);
}

async function passed_report(report_dir, diamonds_passed) {
    const passed_fields =  ['row_no', 'vendor_sku', 'certificate_lab', 'certificate_number', 'carat', 'cost', 'date_time', 'checksum'];
    const passed_filepath = node_path.join(report_dir, 'passed.csv');
    await write_to_csv(passed_filepath, diamonds_passed, passed_fields);
    console.log(`${'passed diamonds report'.green} is saved to ${passed_filepath}`);
}

async function std_inventory_report(report_dir, diamonds) {
    const std_header = get_std_header();
    const diamonds_filepath = node_path.join(report_dir, 'std-inventory.csv');
    await write_to_csv(diamonds_filepath, diamonds, std_header);
    console.log(`${'standardized complete inventory'.blue} is saved to ${diamonds_filepath}`);
}