'use strict';

const { get_data_directory, has_api_config, ftp_upload_all_files, api_upload_all_files, has_ftp_config, 
    ftp_login, ftp_logout, ftp_close } = require('../');

async function submit_both() {

    const data_dir = get_data_directory();
    if (!data_dir) {
        console.error('data directory not setup yet!');
        process.exit(1);
    }

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
        console.log('run newecx --set-config first');
    }

}

module.exports = submit_both;