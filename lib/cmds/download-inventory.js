'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_project_directory, api_get_inventory } = require('../');

async function download_inventory() {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const data_dir = node_path.join(project_dir, 'data');
    if (!fs.existsSync(data_dir)) {
        fs.mkdirSync(data_dir, {recursive: true});
    }
    const filepath = node_path.join(data_dir, 'inventory.csv');
    const result = await api_get_inventory(filepath);
    if (result) { 
        console.log(`downloaded inventory is saved in ${filepath}`);
    } else {
        throw new Error('failed to get inventory');
    }
}

module.exports = download_inventory;
