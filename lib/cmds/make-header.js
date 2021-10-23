'use strict';

const fs = require('fs');
const node_path = require('path');
const get_inventory_filepath = require('./get-inventory-filepath');
const { get_project_directory, read_from_csv, write_simple_js } = require('../');

async function make_header(options) {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const inventory_filepath = get_inventory_filepath();
    const result = await read_from_csv(inventory_filepath, false);
    const header = Object.keys(result[0]);
    for (let i = 0; i < header.length; i++) {
        const field = header[i];
        if (field.startsWith('field')) {
            const value = field.substr(5);
            if (!isNaN(value) && Number(value) === i + 1) {
                header[i] = '';
            }
        }
    }
    const src_dir = node_path.join(project_dir, 'src');
    if (!fs.existsSync(src_dir)) {
        fs.mkdirSync(src_dir, {recursive: true});
    }
    if (options && options.headers_extension) {
        try {
            await options.headers_extension(header);
        } catch(err) {
            console.error('ERROR: call headers_extension', err);
        }
    }
    const filepath = write_simple_js(src_dir, 'agreed-header', header, true);
    console.log(`agreed-header is saved in ${filepath}`);
    return 0;
}

module.exports = make_header;
