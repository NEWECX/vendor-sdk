'use strict';

const get_check_sum = require('@ritani/get-check-sum');
const std_fields = require('../cfg/std-fields');

function get_checksum(diamond) {
    const json = {};
    for (const std_field of std_fields) {
        const key = std_field.key;
        json[key] = diamond[key];
    }
    return get_check_sum(json);
}

module.exports = get_checksum;