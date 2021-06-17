'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_data_directory, get_project_directory, read_from_csv, mk_fields_map, get_latest_csv_file, write_simple_js } = require('../');

async function make_fields_maps() {
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
    const header_stats = {};
    await read_from_csv(inventory_filepath, header_stats);
    const result = mk_fields_map(header_stats);
    const src_dir = node_path.join(project_dir, 'src');
    if (!fs.existsSync(src_dir)) {
        fs.mkdirSync(src_dir, {recursive: true});
    }
    const filepath = write_simple_js(src_dir, 'fields-maps', result);
    console.log(`fields-maps is saved in ${filepath}`);
}

module.exports = make_fields_maps;
