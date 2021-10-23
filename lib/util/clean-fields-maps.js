'use strict';

const { sanitize_check } = require('@ritani/to-simple-js');
const useful_fields = require('../cfg/useful-fields');

function clean_fields_maps(fields_maps, checking = true) {
    const new_fields_maps = [];
    for (const item of fields_maps) {
        const new_fields_map = {};
        for (const field in item) {
            if (useful_fields.includes(field)) {
                if (field === 'field') {
                    if (item.field === item.key) {
                        continue;
                    }
                    if (['?', '*?'].includes(item[field])) {
                        continue;
                    }
                }
                if (field === 'values_map') {
                    for (const key in item[field]) {
                        if (item[field][key] === '?') {
                            delete item[field][key];
                        }
                    }
                }
                new_fields_map[field] = item[field];
            }
        }
        if (checking && !new_fields_map.key) {
            throw new Error('missing key field');
        }
        if (new_fields_map.values_map && Object.keys(new_fields_map.values_map).length === 0) {
            delete new_fields_map.values_map;
        }
        if (Object.keys(new_fields_map).length === 1) {
            continue;
        }
        if (checking && new_fields_map.transform && typeof new_fields_map.transform === 'function') {
            const value = new_fields_map.transform.toString();
            sanitize_check(value);
            if (!value.startsWith('(value, row, diamond) =>')) {
                throw new Error('incorrect transform function pattern');
            }
        }
        new_fields_maps.push(new_fields_map);
    }
    return new_fields_maps;
}

module.exports = clean_fields_maps;