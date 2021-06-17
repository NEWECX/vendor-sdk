'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_project_directory, api_get_header, write_simple_js } = require('../');

async function download_header() {

    const project_dir = get_project_directory();
    if (!project_dir) {
        console.error('project directory not setup yet!');
        process.exit(1);
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
        console.log('failed to get agreed header');
    }
}

module.exports = download_header;
