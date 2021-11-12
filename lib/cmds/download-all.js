'use strict';

const download_header = require('./download-header');
const download_fields_maps = require('./download-fields-maps');
const download_inventory = require('./download-inventory');

async function download_all() {
    await download_header();
    await download_fields_maps();
    try {
        await download_inventory();
        return true;
    } catch (err) {
        console.error(err.message);
        return false;
    }
}

module.exports = download_all;
