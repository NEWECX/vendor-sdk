'use strict';

require('colors');

const { std_fields: standard_fields, assets_filename_map, color_keys} = require('../cfg');

const get_value = require('../util/get-value');
const match_value = require('../util/match-value');
const push_errors = require('../util/push-errors');
const get_field_map = require('../util/get-field-map');
const is_empty = require('../util/is-empty');
const transform_colors = require('../util/transform-colors');
const validate_diamond = require('./validate-diamond');

/**
 * 
 * @param {*} row row data from csv file
 * @param {*} fields_map fields mapping info for the vendor
 * @param {*} additional_maps additional mapping for common used no standard cases
 * @param {*} std_fields std fields defined in ../cfg/std-fields, for testing purpose to make it as argument
 * @param {*} asset_fields url assets defined in ../cfg/assets-config, for testing purpose to make it as argument
 * @returns standard diamond object as defined in std fields with row_no in the csv file
 * 
 * fields_map entry options:
 * 
 * 1) key
 * the standard key from std-fields
 * 
 * 2) field
 * the matched field name for the key in provided csv
 * 
 * 3) ignore: true
 * ignore provided value and replace it with ''
 * 
 * 4) default_value: value
 * default value when provided value is empty or field doesn't exists
 * 
 * 5) values_map: key value object
 * vendor specific mapping to convert provided value to one of standard values
 *
 * 6) transform: function
 * vendor specific transform function, will call it with arguments value, row, diamond
 * 
 * 
 */
 module.exports = async (row, fields_map = [], options = {}, std_fields = standard_fields, asset_fields = Object.keys(assets_filename_map)) => {

    const errors = [];

    const diamond = get_original_values(row, errors, fields_map, std_fields);

    run_standard_transforms(diamond, errors, fields_map, std_fields);

    try {
        transform_colors(diamond, std_fields);
    } catch(err) {
        push_errors(errors, 'color', 'error', `transform_colors ${err.message}`);
    }

    if (options && options.key_value_extension) {
        await run_value_extension(diamond, options.key_value_extension, std_fields);
    }

    if (diamond.shape === 'RD' && !diamond.depth_percent) {
        const {length, width, depth} = diamond;
        if (length && width && depth) {
            diamond.depth_percent = Math.round(depth / ((length + width) / 2) * 100);
        }
    }
    
    validate_diamond(diamond, errors, fields_map, std_fields, asset_fields);

    diamond.original = row;

    if (errors.length > 0) {
        diamond.errors = errors;
    }

    return diamond;
};

async function run_value_extension(diamond, key_value_extension, std_fields = standard_fields) {

    for (const key in diamond) {
        const item = std_fields.find(x => x.key === key);
        if (!item) continue;
        const value = diamond[key];
        if (item.values && !item.values.includes(value)) {
            try {
                diamond[key] = await key_value_extension(key, value);
            } catch (err) {
                console.error('ERROR: call convert_diamond_extension', err.message.red);
                if (process.env.DEBUG) {
                    console.error(err);
                }
            }
        }
    }
}

function run_standard_transforms(diamond, errors, fields_map = {}, std_fields = standard_fields) {

    for (const item of std_fields) {
        const { key, type, transform, always_transform, reducible } = item;
        if (color_keys.includes(key)) continue;
        if (transform && (always_transform || !diamond[key])) {
            if (reducible && !reducible(diamond)) continue;
            try {
                diamond[key] = get_value(transform(diamond), type);
            } catch(err) {
                const {field} = get_field_map(fields_map, key);
                push_errors(errors, field, 'error', `transform ${err.message}`);
            }
        }
        if (is_empty(diamond[key])) {
            diamond[key] = '';
        }
    }
}

function get_original_values(row, errors, fields_map = {}, std_fields = standard_fields) {

    const diamond = {pass: true};

    for (const item of std_fields) {

        const { key, type, values } = item;
        const {field_map, field} = get_field_map(fields_map, key);

        let value = '';
        if (!field_map || !field_map.ignore) {
            value = get_value(row[field], type, diamond[key]);
        }

        if (field_map) {
            if (value === '' && field_map.hasOwnProperty('default_value')) {
                value = get_value(field_map.default_value, type);
            } else if (field_map.transform && typeof field_map.transform === 'function') {
                // run vendor specific transform
                try {        
                    value = get_value(field_map.transform(value, row, diamond), type);
                } catch (err) {
                    const message = `transform function for ${key} failed, ${err.message}`;
                    push_errors(errors, field, 'error', message);
                }    
            }
        }

        if (values || (field_map && field_map.values_map)) {
            const errs = [];
            value = match_value(key, value, field_map, errs);
            for (const {type, message} of errs) {
                push_errors(errors, field, type, message);
                if (type === 'error') {
                    diamond.pass = false;
                }
            }
        }

        diamond[key] = is_empty(value) ? '' : value;
    }

    return diamond;
}

