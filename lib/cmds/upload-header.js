'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_project_directory, api_update_header } = require('../');

async function upload_header() {

    const project_dir = get_project_directory();
    if (!project_dir) {
        console.error('project directory not setup yet!');
        process.exit(1);
    }
    
    const filepath = node_path.join(project_dir, 'src', 'agreed-header.js');
    if (!fs.existsSync(filepath)) {
        console.error(`agreed-header.js not found: ${filepath}`);
        process.exit(1);
    }
    
    const agreed_header = require(filepath);
    const result = await api_update_header(agreed_header);
    console.log(JSON.stringify(result, null, 2));
}

module.exports = upload_header;
