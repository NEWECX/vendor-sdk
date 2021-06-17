'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_project_directory, api_update_fields_maps } = require('../');

async function upload_fields_maps() {

    const project_dir = get_project_directory();
    if (!project_dir) {
        console.error('project directory not setup yet!');
        process.exit(1);
    }
    
    const filepath = node_path.join(project_dir, 'src', 'fields-maps.js');
    if (!fs.existsSync(filepath)) {
        console.error(`fields-maps.js not found: ${filepath}`);
        process.exit(1);
    }
    
    const fields_maps = require(filepath);
    const result = await api_update_fields_maps(fields_maps);
    console.log(JSON.stringify(result, null, 2));
}

module.exports = upload_fields_maps;
