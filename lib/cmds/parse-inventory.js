'use strict';

const fs = require('fs');
const node_path = require('path');
const get_inventory_filepath = require('./get-inventory-filepath');
const { get_project_directory, parse_inventory_csv } = require('../');

async function parse_inventory(options) {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }    
    const inventory_filepath = get_inventory_filepath(false);
    const src_dir = node_path.join(project_dir, 'src');
    const agreed_header_filepath = node_path.join(src_dir, 'agreed-header.js');
    if (!fs.existsSync(agreed_header_filepath)) {
        throw new Error(`agreed_header not found - ${agreed_header_filepath}`);
    }
    const fields_maps_filepath = node_path.join(src_dir, 'fields-maps.js');
    if (!fs.existsSync(fields_maps_filepath)) {
        throw new Error(`fields_maps not found - ${fields_maps_filepath}`);
    }
    const agreed_header = require(agreed_header_filepath);
    const fields_maps = require(fields_maps_filepath);
    const result = await parse_inventory_csv(inventory_filepath, fields_maps, agreed_header, options);
    if (result.errors && result.errors.length > 0) {
        const fields = [];
        for (const error of result.errors) {
            if (!fields.includes(error.field)) {
                fields.push(error.field);
            }
            console.log(error);
        }
        throw new Error(`Error: ${fields.join(', ')} invalid`);
    }
    if (!result || !result.diamonds || result.diamonds.length === 0) {
        throw new Error(`failed to parse or no diamonds found in ${inventory_filepath}`);
    }
    return result;
}

module.exports = parse_inventory;