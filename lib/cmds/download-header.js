'use strict';

require('colors');
const fs = require('fs');
const node_path = require('path');
const { get_project_directory, api_get_header, write_simple_js } = require('../');

async function download_header() {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const result = await api_get_header();
    if (result) {
        const src_dir = node_path.join(project_dir, 'src');
        if (!fs.existsSync(src_dir)) {
            fs.mkdirSync(src_dir, {recursive: true});
        }
        const filepath = write_simple_js(src_dir, 'agreed-header', result);
        console.log(`downloaded agreed header is saved in ${filepath}`);
    } else {
        throw new Error('failed to get agreed header'.red);
    }
}

module.exports = download_header;
