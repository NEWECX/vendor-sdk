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
    const result = await read_from_csv(inventory_filepath, header_stats);
    if (!result || result.length === 0) {
        console.log('inventory feed is empty'.red);
        return;
    }
    const src_dir = node_path.join(project_dir, 'src');
    if (!fs.existsSync(src_dir)) {
        fs.mkdirSync(src_dir, {recursive: true});
    }
    let previous = null;
    const fields_maps_filepath = node_path.join(src_dir, 'fields-maps.js');
    if (fs.existsSync(fields_maps_filepath)) {
        previous = require(fields_maps_filepath);
    }
    const fields_maps = await mk_fields_map(header_stats, previous, options);
    const filepath = write_simple_js(src_dir, 'fields-maps', fields_maps, true);
    console.log(`fields-maps is saved in ${filepath}`);
}

module.exports = make_fields_maps;
