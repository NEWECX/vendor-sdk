'use strict';

const parse_inventory = require('./parse-inventory');
const { mk_inventory_reports} = require('../');

async function validate_inventory() {
    const result = await parse_inventory();
    if (result.header_errors && result.header_errors.length > 0) {
        console.error('\n');
        console.error('found errors in header, all diamonds will rejected by server:');
        for (const error of result.header_errors) {
            for (const type of ['info', 'warning', 'error']) {
                if (error[type]) {
                    console.error(error[type] + '\n');
                    break;
                }
            }
        }
    }
    mk_inventory_reports(result);
}

module.exports = validate_inventory;