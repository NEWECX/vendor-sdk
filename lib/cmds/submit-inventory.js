'use strict';

const get_inventory_filepath = require('./get-inventory-filepath');
const { has_api_config, has_ftp_config, api_upload_inventory, 
    ftp_login, ftp_logout, ftp_upload_inventory, ftp_close } = require('../');

async function submit_inventory() {
    const inventory_filepath = get_inventory_filepath();
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
        throw new Error('please run newecx --set-config first');
    }
}

module.exports = submit_inventory;