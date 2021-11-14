'use strict';

require('colors');
const fs = require('fs');
const node_path = require('path');
const { assets_stats_types, assets_types_values } = require('../cfg');
const { get_project_directory } =  require('./configuration');
const write_to_csv = require('./write-to-csv');
const get_check_sum = require('@ritani/get-check-sum');
const get_header_errors = require('./get-header-errors');
const get_std_header = require('./get-std-header');

module.exports = async (result, options) => {

    if (!result) {
        throw new Error('result data is empty');
    }
    
    let report_dir;

    if (options.report_dir) {
        report_dir = options.report_dir;
    } else {
        const project_dir = get_project_directory();
        if (!project_dir) {
            throw new Error('project directory not setup yet!');
        }
        report_dir = node_path.join(project_dir, 'report');
    }
    
    if (fs.existsSync(report_dir)) {
        fs.rmdirSync(report_dir, {recursive: true});
    }
    fs.mkdirSync(report_dir, {recursive: true});

    const diamonds_errors = [];

    const header_has_error = get_header_errors(result.header_errors, diamonds_errors);
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

    let assets_stats;
    if (!result.assets_stats) {
        assets_stats = {};
        for (const key in assets_stats_types) {
            const type = assets_stats_types[key];
            assets_stats['urls_for_' + type] = 0;
        }
    }

    const diamonds_passed = [];
    const diamonds_warnings = [];
    for (const diamond of diamonds) {

        const {row_no, pass, vendor_sku, certificate_lab, certificate_number, errors} = diamond;

        if (!diamond.original_checksum) {
            diamond.original_checksum = get_check_sum(diamond.original);
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

            if (assets_stats) {
                for (const key in assets_stats_types) {
                    if (!diamond[key]) {
                        continue;
                    }
                    const type = assets_stats_types[key];
                    assets_stats['urls_for_' + type] += 1;
                }
            }

            diamonds_passed.push(diamond);
        }
    }

    if (options && options.summary_report) {
        try {
            await options.summary_report(report_dir, header_ok, total, ok_count, diamonds_errors, diamonds_warnings, assets_stats);
        } catch(err) {
            console.error('call options.summary_report', err);
        }
    } else {
        await summary_report(report_dir, header_ok, total, ok_count, diamonds_errors, diamonds_warnings, assets_stats);
    }
    if (options && options.errors_report) {
        try {
            await options.errors_report(report_dir, diamonds_errors);
        } catch(err) {
            console.error('call options.errors_report', err);
        }
    } else {
        await errors_report(report_dir, diamonds_errors);
    }
    if (options && options.warning_report) {
        try {
            await options.warning_report(report_dir, diamonds_warnings);
        } catch(err) {
            console.error('options.warning_report', err);
        }
    } else {
        await warning_report(report_dir, diamonds_warnings);
    }
    if (options && options.passed_report) {
        try {
            await options.passed_report(report_dir, diamonds_passed);
        } catch(err) {
            console.error('options.passed_report', err);
        }
    } else {
        await passed_report(report_dir, diamonds_passed);
    }
    if (options && options.std_inventory_report) {
        try {
            await options.std_inventory_report(report_dir, diamonds);
        } catch(err) {
            console.error('options.std_inventory_report', err);
        }
    } else {
        await std_inventory_report(report_dir, diamonds);
    }

    console.log();
};

async function summary_report(report_dir, header_ok, total, ok_count, diamonds_errors, diamonds_warnings, assets_stats) {
    const summary_fields = ['header ok', 'total diamonds', 'passed count', 'errors count', 'warnings count'];
    assets_types_values.forEach(x => summary_fields.push('urls_for_' + x));
    const summary_filepath = node_path.join(report_dir, 'summary.csv');
    const summary = [{'header ok': header_ok, 'total diamonds': total, 'passed count': ok_count, 'errors count': diamonds_errors.length, 
        'warnings count': diamonds_warnings.length, ...assets_stats}];
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
    const passed_fields =  ['row_no', 'vendor_sku', 'certificate_lab', 'certificate_number', 'carat', 'cost', 'created_at', 'original_checksum'];
    const passed_filepath = node_path.join(report_dir, 'passed.csv');
    await write_to_csv(passed_filepath, diamonds_passed, passed_fields);
    console.log(`${'passed diamonds report'.green} is saved to ${passed_filepath}`);
}

async function std_inventory_report(report_dir, diamonds) {
    const std_header = get_std_header();
    const diamonds_filepath = node_path.join(report_dir, 'std-inventory.csv');
    await write_to_csv(diamonds_filepath, diamonds, std_header);
    console.log(`standardized complete inventory is saved to ${diamonds_filepath}`);
}