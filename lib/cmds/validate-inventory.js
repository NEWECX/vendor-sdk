'use strict';

const parse_inventory = require('./parse-inventory');
const { mk_inventory_reports} = require('../');

async function validate_inventory() {
    const result = await parse_inventory();
    mk_inventory_reports(result);
}

module.exports = validate_inventory;