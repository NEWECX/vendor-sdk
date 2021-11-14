'use strict';

const { api_upload_all_files } = require('../core');

module.exports = async() => {
    console.log('api upload all ...');
    const result = await api_upload_all_files();
    console.log(result);
}