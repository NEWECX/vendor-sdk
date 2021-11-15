'use strict';

require('colors');
const parse_inventory = require('./parse-inventory');
const { mk_reports } = require('../util');

module.exports = async (options) => {
    try {
        const result = await parse_inventory(options);
        if (result.header_errors && result.header_errors.length > 0 && result.header_errors.find(x => x.error)) {
            console.log('');
            console.error('\nFound errors in header, all diamonds are rejected\n'.red);
        }
        mk_reports(result, options);
    } catch(err) {
        console.log('');
        console.error(err.message.red);
    }
};