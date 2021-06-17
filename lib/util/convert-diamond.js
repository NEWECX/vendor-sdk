'use strict';

const standard_fields = require('../cfg/std-fields');
const { assets_filename_map } = require('../cfg/assets-config');
const get_value = require('./get-value');
const mark_value = require('./mark-value');
const match_std_value = require('./match-std-value');

function convert_diamond(timestamp, index, row, fields_map, std_fields = standard_fields, asset_fields = Object.keys(assets_filename_map)) {

    const errors = [];
    const diamond = {row_no: index + 1, pass: true, timestamp};

    for (const item of std_fields) {

        const { key, type, values } = item;

        const field_map = fields_map.find(x => x.key === key);
        const field = field_map && field_map.field ? field_map.field : key;

        let value = get_value(row[field], type);

        if (value === '') {

            if (field_map && field_map.hasOwnProperty('default_value')) {
                value = field_map.default_value;
            }
            
        } else {

            // has values requirement
            //
            if (values || field_map?.values_map) {
                
                value = match_std_value(index, key, field, value, row, field_map?.values_map, errors);

                if (typeof value === 'string' && value.startsWith('*')) {
                    diamond.pass = false;
                }
            }
        }

        if (value) {

            const is_asset_field = asset_fields.includes[key];

            if (type === 'number') {
                
                if (isNaN(value)) {

                    diamond.pass = false;
                    errors.push(`row_no: ${index + 1} error, ${field} value is not number`);
                    value = mark_value(value);

                }

            } else if (!is_asset_field && values) {

                if (!values.includes(value)) {

                    diamond.pass = false;
                    errors.push(`row_no: ${index + 1} error, ${key} => ${field} => ${value} not in ${values.join(', ')}`);
                    value = mark_value(value);
                }

            } else if (is_asset_field) {

                const { protocol } = new URL(value)

                if (!['http:', 'https:'].includes(protocol)) {

                    errors.push(`row_no: ${index + 1} error, ${key} => ${field} => ${value} protocol not http and https`);
                    value = mark_value(value);

                }

            }
        }

        diamond[key] = value;
    }

    for (const item of std_fields) {

        const { key, require, type, transform } = item;

        const field_map = fields_map.find(x => x.key === key);
        const field = field_map && field_map.field ? field_map.field : key;

        if (transform && diamond[key] === '') {

            diamond[key] = get_value(transform(diamond), type);
        }

        if (diamond[key] === '' || (typeof diamond[key] === 'string' && diamond[key].startsWith('*'))) {

            if (require === 'required') {

                diamond.pass = false;
                errors.push(`row_no: ${index + 1} error, missing required value for ${field}`);

                if (!diamond[key].startsWith('*')) {
                    diamond[key] = mark_value(diamond[key]);
                }
    
            } else if (require === 'expected') {
    
                errors.push(`row_no: ${index + 1} warning, value ${key}(${field}) is empty, but expected`);
                
            }
    
        }
    }

    diamond.original = row;

    if (errors.length > 0) {
        diamond.errors = errors;
    }

    return diamond;
}

module.exports = convert_diamond;