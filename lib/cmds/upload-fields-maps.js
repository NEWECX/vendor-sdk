'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_project_directory } = require('../util');
const { api_update_fields_maps } = require('../core');

module.exports = async (force = false) => {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const filepath = node_path.join(project_dir, 'src', 'fields-maps.js');
    if (!fs.existsSync(filepath)) {
        throw new Error(`fields-maps.js not found: ${filepath}`);
    }
    const fields_maps = require(filepath);
    const result = await api_update_fields_maps(fields_maps, force);
    console.log(JSON.stringify(result, null, 2));
};
