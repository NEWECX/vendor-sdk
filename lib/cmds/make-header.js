'use strict';

const fs = require('fs');
const node_path = require('path');
const get_inventory_filepath = require('./get-inventory-filepath');
const { get_project_directory, read_from_csv, write_simple_js } = require('../');

async function make_header() {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const inventory_filepath = get_inventory_filepath();
    const result = await read_from_csv(inventory_filepath, false);
    const header = Object.keys(result[0]);
    const src_dir = node_path.join(project_dir, 'src');
    if (!fs.existsSync(src_dir)) {
        fs.mkdirSync(src_dir, {recursive: true});
    }
    const filepath = write_simple_js(src_dir, 'agreed-header', header, true);
    console.log(`agreed-header is saved in ${filepath}`);
    return 0;
}

module.exports = make_header;
