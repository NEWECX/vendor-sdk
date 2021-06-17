'use strict';

const fs = require('fs');
const node_path = require('path');
const csv = require("csvtojson");
const validate_fields_map = require('./util/validate-fields-map');
const validate_header =  require('./util/validate-header');
const convert_diamond = require('./util/convert-diamond');
const std_fields = require('./cfg/std-fields');
const write_to_csv = require('./util/write-to-csv');

module.exports = {
    parse_inventory_csv,
    mk_inventory_reports,
};

async function parse_inventory_csv(csv_filepath, fields_map, agreed_header) {

    if (!csv_filepath) {
        throw new Error('csv_filepath is missing');
    }
    if (!fields_map) {
        throw new Error('required fields_map is missing');
    }
    if (!agreed_header || !Array.isArray(agreed_header)) {
        throw new Error('agreed_header is not array');
    }

    // validate fields_map
    //
    const errors = validate_fields_map(fields_map);
    if (errors && errors.length > 0) {
        return {errors};
    }

    let header_errors, is_std_header = false;

    const convertor = csv({trim: true});

    convertor.on('header', (header) => {

        // validate header
        //
        const result = validate_header(header, agreed_header);

        if (result !== 'ok') {

            if (result === 'std') {
                is_std_header = true;
            } else {
                header_errors = result;
            }

        }
    });
    
    const diamonds = [];
    const timestamp = Date.now();
    let ok_count = 0;
    
    convertor.subscribe((row, index) => {

        // convert, validate and collect data per row
        // 
        const diamond = is_std_header ?
            convert_diamond(timestamp, index, row, std_fields) :
            convert_diamond(timestamp, index, row, fields_map); 
    
        if (diamond.pass) {
            ok_count++;
        }
    
        diamonds.push(diamond);

    });
    
    // start it
    await convertor.fromFile(csv_filepath);

    // prepare result
    //
    const result = {ok_count, total: diamonds.length, created_at: new Date(timestamp)};
    if (header_errors && header_errors.length > 0) {
        result.header_errors = header_errors;
    }
    if (diamonds.length > 0) {
        result.diamonds = diamonds;
    }

    return result;
}

async function mk_inventory_reports(reports_dirname, result) {

    if (!result) {
        throw new Error('result data is empty');
    }
    if (!reports_dirname) {
        throw new Error('reports_dirnam data is empty');
    }

    if (!fs.existsSync(reports_dirname)) {
        fs.mkdirSync(reports_dirname, {recursive: true});
    }

    const {total, ok_count, diamonds} = result;
    console.log(`total diamonds: ${total}`, `passed count: ${ok_count}`);
    console.log();

    const diamonds_passed = [];
    const diamonds_errors = [];
    for (const diamond of diamonds) {

        const {row_no, pass, vendor_sku, certificate_lab, certificate_number, errors} = diamond;

        if (errors) {
            for (const error of errors) {
                diamonds_errors.push({row_no, vendor_sku, certificate_lab, certificate_number, error});
            }
        }
        if (pass) {
            diamonds_passed.push(diamond);
        }
    }

    const summary_fields = ['total diamonds', 'passed count'];
    const summary_filepath = node_path.join(reports_dirname, 'summary.csv');
    write_to_csv(summary_filepath, [{'total diamonds': total, 'passed count': ok_count}], summary_fields);

    const passed_fields = ['row_no', ...std_fields.map(x => x.key)];
    const passed_filepath = node_path.join(reports_dirname, 'diamonds-passed.csv');
    write_to_csv(passed_filepath, diamonds_passed, passed_fields);

    const errors_fields = ['row_no', 'vendor_sku', 'certificate_lab', 'certificate_number', 'error'];
    const errors_filepath = node_path.join(reports_dirname, 'diamonds-errors.csv');
    write_to_csv(errors_filepath, diamonds_errors, errors_fields);

    console.log(`check ${summary_filepath} for summary`);
    console.log(`check ${passed_filepath} for passed diamonds`);
    console.log(`check ${errors_filepath} for errors`);
    console.log();
}