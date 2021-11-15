'use strict';

const fs = require('fs');
const node_path = require('path')

const { get_project_directory } = require('./configuration');
const write_to_csv = require('./write-to-csv');

module.exports = (fullpath, filename = 'empty.csv') => {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }    
    const src_dir = node_path.join(project_dir, 'src');
    const agreed_header_filepath = node_path.join(src_dir, 'agreed-header.js');
    if (!fs.existsSync(agreed_header_filepath)) {
        throw new Error(`agreed_header not found - ${agreed_header_filepath}`);
    }
    const agreed_header = require(agreed_header_filepath);
    if (!fs.existsSync(fullpath)) {
        fs.mkdirSync(fullpath, {recursive: true});
    }
    const inventory_filepath = node_path.join(fullpath, filename);
    const diamond = {};
    for (const key of agreed_header) {
        diamond[key] = '';
    }
    write_to_csv(inventory_filepath, [ diamond ], agreed_header);
}
