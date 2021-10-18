'use strict';

const get_std_inventory_filepath = require('./get-std-inventory-filepath');
const { has_api_config, has_ftp_config, api_upload_inventory, 
    ftp_login, ftp_logout, ftp_upload_inventory, ftp_close } = require('../');

async function submit_std_inventory() {
    const inventory_filepath = get_std_inventory_filepath();
    if (has_api_config()) {
        console.log('api upload std inventory ...');
        const result = await api_upload_inventory(inventory_filepath);
        console.log(result);
    } else if (has_ftp_config()) {
        console.log('ftp upload std inventory ...');
        await ftp_login(async () => {
            const result = await ftp_upload_inventory(inventory_filepath);
            console.log(result);
            await ftp_logout();
            ftp_close();
        });
    } else {
        throw new Error('please run newecx --set-config first');
    }
}

module.exports = submit_std_inventory;