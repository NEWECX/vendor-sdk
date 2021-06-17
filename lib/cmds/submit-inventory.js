'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_data_directory, get_latest_csv_file, has_api_config, has_ftp_config, 
    api_upload_inventory, ftp_login, ftp_logout, ftp_upload_inventory, ftp_close } = require('../');

async function submit_inventory() {

    const data_dir = get_data_directory();
    if (!data_dir) {
        console.error('data directory not setup yet!');
        process.exit(1);
    }

    let inventory_filepath = node_path.join(data_dir, 'inventory.csv');
    if (!fs.existsSync(inventory_filepath)) {
        console.log(`file ${inventory_filepath} not exists`);
        const result = get_latest_csv_file(data_dir);
        if (result && result[1]) {
            inventory_filepath = result[1];
        } else {
            console.error('failed to found inventory feed csv file');
            process.exit(1);
        }
    }

    if (has_api_config()) {

        console.log('api upload inventory ...');
        const result = await api_upload_inventory(inventory_filepath);
        console.log(result);

    } else if (has_ftp_config()) {

        console.log('ftp upload inventory ...');
        await ftp_login(async () => {
            const result = await ftp_upload_inventory(inventory_filepath);
            console.log(result);
            await ftp_logout();
            ftp_close();
        });

    } else {
        console.log('run newecx --set-config first');
    }

}

module.exports = submit_inventory;