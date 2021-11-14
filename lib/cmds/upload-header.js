'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_project_directory } = require('../util');
const { api_update_header } = require('../core');

module.exports = async (force = false) => {

    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const filepath = node_path.join(project_dir, 'src', 'agreed-header.js');
    if (!fs.existsSync(filepath)) {
        throw new Error(`agreed-header.js not found: ${filepath}`);
    }
    const agreed_header = require(filepath);
    const result = await api_update_header(agreed_header, force);
    console.log(JSON.stringify(result, null, 2));
};
