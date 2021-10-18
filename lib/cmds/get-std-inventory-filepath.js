'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_project_directory } = require('../')

function get_std_inventory_filepath() {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const std_inventory_filepath = node_path.join(project_dir, 'report', 'std-inventory.csv');
    if (!fs.existsSync(std_inventory_filepath)) {
        throw new Error(std_inventory_filepath + ' not found!');
    }
    return std_inventory_filepath;
}

module.exports = get_std_inventory_filepath;