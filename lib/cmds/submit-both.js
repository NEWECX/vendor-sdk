'use strict';

const { has_api_config, ftp_upload_all_files, api_upload_all_files, has_ftp_config, 
    ftp_login, ftp_logout, ftp_close } = require('../');

async function submit_both() {
    if (has_api_config()) {
        console.log('api upload all ...');
        const result = await api_upload_all_files();
        console.log(result);
    } else if (has_ftp_config()) {
        console.log('ftp upload all ...');
        await ftp_login(async () => {
            const result = await ftp_upload_all_files();
            console.log(result);
            await ftp_logout();
            ftp_close();
        });
    } else {
        throw new Error('please run newecx --set-config first');
    }
}

module.exports = submit_both;