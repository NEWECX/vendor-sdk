'use strict';

require('colors');
const parse_inventory = require('./parse-inventory');
const { mk_inventory_reports} = require('../');

async function validate_inventory(options) {
    const result = await parse_inventory(options);
    if (result.header_errors && result.header_errors.length > 0 && result.header_errors.find(x => x.error)) {
        console.error('\nFound errors in header, all diamonds are rejected by server\n'.red);
    }
    mk_inventory_reports(result, options);
}

module.exports = validate_inventory;