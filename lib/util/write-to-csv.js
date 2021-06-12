'use strict';

const fs = require('fs');
const { Parser } = require('json2csv');

function write_to_csv(local_filepath, items, fields) {
    try {
        const parser = new Parser({fields});
        const csv = parser.parse(items);
        fs.writeFileSync(local_filepath, csv);
    } catch (err) {
        console.error(err);
    }
}

module.exports = write_to_csv;