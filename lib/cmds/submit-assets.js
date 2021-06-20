'use strict';

const { has_api_config, has_ftp_config, api_upload_assets, ftp_login, 
    ftp_logout, ftp_upload_assets, ftp_close } = require('../');

async function submit_assets() {
    if (has_api_config()) {
        console.log('api upload assets ...');
        const result = await api_upload_assets();
        console.log(result);
    } else if (has_ftp_config()) {
        console.log('ftp upload assets ...');
        await ftp_login(async () => {
            const result = await ftp_upload_assets();
            console.log(result);
            await ftp_logout();
            ftp_close();
        });
    } else {
        throw new Error('please run newecx --set-config first');
    }
}

module.exports = submit_assets;