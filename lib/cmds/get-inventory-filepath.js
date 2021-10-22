'use strict';

require('colors');
const fs = require('fs');
const node_path = require('path');
const { get_data_directory, get_latest_csv_file } = require('../')

function get_inventory_filepath() {
    const data_dir = get_data_directory();
    if (!data_dir) {
        throw new Error('data directory not setup yet!');
    }
    let inventory_filepath = node_path.join(data_dir, 'inventory.csv');
    if (!fs.existsSync(inventory_filepath)) {
        console.log(`\ndefault file ${inventory_filepath} not exists, search for latest csv file`);
        const result = get_latest_csv_file(data_dir);
        if (result && result[1]) {
            inventory_filepath = result[1];
        } else {
            throw new Error('failed to found inventory feed csv file'.red);
        }
    }
    return inventory_filepath;
}

module.exports = get_inventory_filepath;