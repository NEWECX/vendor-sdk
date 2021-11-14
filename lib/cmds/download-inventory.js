'use strict';

require('colors');
const fs = require('fs');
const node_path = require('path');
const { get_project_directory } = require('../util');
const { api_get_inventory } = require('../core');

module.exports = async () => {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const data_dir = node_path.join(project_dir, 'data');
    if (!fs.existsSync(data_dir)) {
        fs.mkdirSync(data_dir, {recursive: true});
    }
    const inventory_filepath = node_path.join(project_dir, 'data', 'inventory.csv');
    if (fs.existsSync(inventory_filepath)) {
        const new_filename = 'inventory-' + new Date().toISOString().replace(/-|T|:|\.|Z/g, '') + '.csv';
        const new_filepath = node_path.join(project_dir, 'data', new_filename);
        fs.renameSync(inventory_filepath, new_filepath);
    }
    const downloaded_inventory_filepath = node_path.join(project_dir, 'data', 'downloaded-inventory.csv');
    if (fs.existsSync(downloaded_inventory_filepath)) {
        const new_filename = 'downloaded-inventory-' + new Date().toISOString().replace(/-|T|:|\.|Z/g, '') + '.csv';
        const new_filepath = node_path.join(project_dir, 'data', new_filename);
        fs.renameSync(downloaded_inventory_filepath, new_filepath);
    }
    const filepath = node_path.join(data_dir, 'downloaded-inventory.csv');
    const result = await api_get_inventory(filepath);
    if (result) { 
        console.log(`downloaded inventory is saved in ${filepath}`);
    } else {
        throw new Error('failed to get inventory'.red);
    }
};
