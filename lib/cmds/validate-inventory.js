'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_data_directory, get_project_directory, parse_inventory_csv, get_latest_csv_file, write_to_csv, std_fields } = require('../');

async function validate_inventory() {

    const project_dir = get_project_directory();
    if (!project_dir) {
        console.error('project directory not setup yet!');
        process.exit(1);
    }    
    const data_dir = get_data_directory();
    if (!data_dir) {
        console.error('data directory not setup yet!');
        process.exit(1);
    }

    let inventory_filepath = node_path.join(data_dir, 'inventory.csv');
    if (!fs.existsSync(inventory_filepath)) {
        console.log(`file ${inventory_filepath} not exists`);
        const result = get_latest_csv_file(data_dir);
        if (result && result[1]) {
            inventory_filepath = result[1];
        } else {
            console.error('failed to found inventory feed csv file');
            process.exit(1);
        }
    }
    
    const src_dir = node_path.join(project_dir, 'src');

    const agreed_header_filepath = node_path.join(src_dir, 'agreed-header.js');
    if (!fs.existsSync(agreed_header_filepath)) {
        console.error(`agreed_header not found - ${agreed_header_filepath}`);
        process.exit(1);
    }
    const fields_maps_filepath = node_path.join(src_dir, 'fields-maps.js');
    if (!fs.existsSync(fields_maps_filepath)) {
        console.error(`fields_maps not found - ${fields_maps_filepath}`);
        process.exit(1);
    }

    const agreed_header = require(agreed_header_filepath);
    const fields_maps = require(fields_maps_filepath);

    const result = await parse_inventory_csv(inventory_filepath, fields_maps, agreed_header);

    if (result) {

        const report_dir = node_path.join(project_dir, 'report');
        if (!fs.existsSync(report_dir)) {
            fs.mkdirSync(report_dir, {recursive: true});
        }

        const {total, ok_count, diamonds} = result;
        console.log(`total diamonds: ${total}`);
        console.log(`passed count: ${ok_count}`);

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

        const passed_fields = ['row_no', ...std_fields.map(x => x.key)];
        const passed_filepath = node_path.join(report_dir, 'diamonds-passed.csv');
        write_to_csv(passed_filepath, diamonds_passed, passed_fields);

        const errors_fields = ['row_no', 'vendor_sku', 'certificate_lab', 'certificate_number', 'error'];
        const errors_filepath = node_path.join(report_dir, 'diamonds-errors.csv');
        write_to_csv(errors_filepath, diamonds_errors, errors_fields);

        console.log(`passed diamonds is saved to ${passed_filepath}`);
        console.log(`errors per diamonds is saved to ${errors_filepath}`);

    } else {

        console.error('failed to parse csv file', inventory_filepath);

    }
}

module.exports = validate_inventory;