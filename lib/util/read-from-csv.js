'use strict';

const fs = require('fs');
const csv = require('csvtojson')

async function read_from_csv(local_filepath) {
    if (!fs.existsSync(local_filepath)) {
        throw new Error(`file not found, ${local_filepath}`);
    }
    return csv().fromFile(local_filepath);
}

module.exports = read_from_csv;