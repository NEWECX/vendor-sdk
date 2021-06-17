'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_project_directory, api_get_fields_maps, write_simple_js } = require('../');

async function download_fields_maps() {
    const project_dir = get_project_directory();
    if (!project_dir) {
        console.error('project directory not setup yet!');
        process.exit(1);
    }
    const result = await api_get_fields_maps();
    if (result) {
        const src_dir = node_path.join(project_dir, 'src');
        if (!fs.existsSync(src_dir)) {
            fs.mkdirSync(src_dir, {recursive: true});
        }
        const filepath = write_simple_js(src_dir, 'fields-maps', result);
        console.log(`downloaded fields-maps is saved in ${filepath}`);
    } else {
        console.log('failed to get agreed header');
    }
}

module.exports = download_fields_maps;
