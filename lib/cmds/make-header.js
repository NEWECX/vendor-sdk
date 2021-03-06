'use strict';

require('colors');

const fs = require('fs');
const node_path = require('path');

const { get_project_directory, read_from_csv, write_simple_js } = require('../util');
const get_inventory_filepath = require('./get-inventory-filepath');

module.exports = async (options) => {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const inventory_filepath = get_inventory_filepath(false);
    const result = await read_from_csv(inventory_filepath, false);
    if (!result || result.length === 0) {
        console.log('inventory feed is empty'.red);
        return;
    }
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
    if (options && options.header_extension) {
        try {
            await options.header_extension(header);
        } catch(err) {
            console.error('ERROR: call header_extension', err.message.red);
            if (process.env.DEBUG) {
                console.error(err);
            }
        }
    }
    const filepath = write_simple_js(src_dir, 'agreed-header', header, true);
    console.log(`agreed-header is saved in ${filepath}`);
};
