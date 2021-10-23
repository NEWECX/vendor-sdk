'use strict';

const fs = require('fs');
const node_path = require('path');
const get_inventory_filepath = require('./get-inventory-filepath');
const { get_project_directory, read_from_csv, mk_fields_map, write_simple_js } = require('../');

async function make_fields_maps(options) {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const inventory_filepath = get_inventory_filepath();
    const header_stats = {};
    await read_from_csv(inventory_filepath, header_stats);
    const src_dir = node_path.join(project_dir, 'src');
    if (!fs.existsSync(src_dir)) {
        fs.mkdirSync(src_dir, {recursive: true});
    }
    let previous = null;
    const fields_maps_filepath = node_path.join(src_dir, 'fields-maps.js');
    if (fs.existsSync(fields_maps_filepath)) {
        previous = require(fields_maps_filepath);
    }
    const result = mk_fields_map(header_stats, previous);
    if (options && options.fields_maps_extension) {
        try {
            await options.fields_maps_extension(header_stats, result);
        } catch(err) {
            console.error('ERROR: call fields_maps_extension', err);
        }
    }
    const filepath = write_simple_js(src_dir, 'fields-maps', result, true);
    console.log(`fields-maps is saved in ${filepath}`);
}

module.exports = make_fields_maps;
