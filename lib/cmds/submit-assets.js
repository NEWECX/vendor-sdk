'use strict';

const { api_upload_assets } = require('../core');

module.exports = async () => {
    console.log('api upload assets ...');
    const result = await api_upload_assets();
    console.log(result);
}
