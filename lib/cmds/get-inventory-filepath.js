'use strict';

require('colors');
const fs = require('fs');
const node_path = require('path');
const { get_data_directory, get_latest_csv_file } = require('../')

function get_inventory_filepath(no_empty_csv = true) {
    const data_dir = get_data_directory();
    if (!data_dir) {
        throw new Error('data directory not setup yet!');
    }
    let inventory_filepath = node_path.join(data_dir, 'inventory.csv');
    if (!fs.existsSync(inventory_filepath)) {
        const result = get_latest_csv_file(data_dir, no_empty_csv);
        if (result && result[1]) {
            console.log(`default file inventory.csv not exists, use ${result[1]}`);
            inventory_filepath = result[1];
        } else {
            throw new Error('failed to found inventory feed csv file'.red);
        }
    } else {
        console.log(`use default file ${inventory_filepath}`);

    }
    return inventory_filepath;
}

module.exports = get_inventory_filepath;