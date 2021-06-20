'use strict';

const standard_fields = require('../cfg/std-fields');
const { assets_filename_map } = require('../cfg/assets-config');
const get_value = require('./get-value');
const match_std_value = require('./match-std-value');
const push_errors = require('./push-errors');
const extra_mapping =  require('../cfg/extra-mapping');

function convert_diamond(row, fields_map, use_extra_mapping = false, std_fields = standard_fields, asset_fields = Object.keys(assets_filename_map)) {

    const errors = [];
    const diamond = {pass: true};

    // get value by default, values_map mapping or function call
    for (const item of std_fields) {
        const { key, type, values } = item;
        const {field_map, field} = get_field_map(fields_map, key);
        let value = get_value(row[field], type, diamond[key]);
        if (value === '' && field_map && field_map.hasOwnProperty('default_value')) {
            value = field_map.default_value;
        }
        // has values requirement or values_map
        const values_map = field_map && field_map.values_map ? field_map.values_map : null;
        if (values || values_map) {
            const errs = [];
            value = match_std_value(key, field, value, row, values_map, errs);
            for (const {type, message} of errs) {
                push_errors(errors, field, type, message);
                if (type === 'error') {
                    diamond.pass = false;
                }
            }
        }
        diamond[key] = value;
    }

    // run transforms
    for (const item of std_fields) {
        const { key, type, transform, always_transform } = item;
        if (transform && (always_transform || (diamond[key] === '' || diamond[key] === null || diamond[key] === undefined))) {
            try {
                const value = transform(diamond);
                diamond[key] = get_value(value, type);
            } catch(err) {
                const {field} = get_field_map(fields_map, key);
                push_errors(errors, field, 'error', `transform ${err.message}`);
            }
        }
        if (diamond[key] === null || diamond[key] === undefined) {
            diamond[key] = '';
        }
    }

    // use extra mapping
    if (use_extra_mapping) {
        for (const item of std_fields) {
            const { key, values } = item;
            let value = diamond[key];
            if (value && values && !values.includes(value) && extra_mapping[key]) {
                value = extra_mapping[key](value);
                if (value !== diamond[key] && value !== undefined && value !== null && value !== '') {
                    diamond[key] = value;
                }
            }
        }
    } else if (diamond.culet_size !== undefined && diamond.culet_size !== null) {
        diamond.culet_size = extra_mapping.culet_size(diamond.culet_size.toLowerCase());
    }

    // validate
    for (const item of std_fields) {

        const { key, type, require, values, reducible } = item;
        const { field } = get_field_map(fields_map, key);
        const value = diamond[key];

        if (value !== '') {
            if (values && !values.includes(value)) {
                if (require === 'optional' || require === 'expected') {
                    diamond[key] = '';
                    push_errors(errors, field, 'warning', `value not mapped, ${key} => ${value}, not in ${values.join(', ')}`); 
                } else {
                    diamond.pass = false;
                    push_errors(errors, field, 'error', `value not mapped, ${key} => ${value}, not in ${values.join(', ')}`); 
                }
            }
            const is_asset_field = asset_fields.includes[key];
            if (type === 'number') {
                if (typeof value !== 'number') {
                    diamond.pass = false;
                    push_errors(errors, field, 'error', 'value is not number');
                }
            } else if (is_asset_field) {
                const { protocol } = new URL(value)
                if (!['http:', 'https:'].includes(protocol)) {
                    push_errors(errors, field, 'error', `${key} => ${value} protocol not http and https`);
                }
            }
            continue;
        }

        if (!['required', 'expected'].includes(require)) {
            continue;
        }
        if (reducible && reducible(diamond)) {
            continue;
        }
        if (require === 'required') {
            diamond.pass = false;
            push_errors(errors, field, 'error', `missing required value, key ${key}`);
        } else {
            push_errors(errors, field, 'warning', `value for ${key} is empty, but expected`);   
        }
    }

    diamond.original = row;

    if (errors.length > 0) {
        diamond.errors = errors;
    }

    return diamond;
}

function get_field_map(fields_map, key) {
    const field_map = fields_map.find(x => x.key === key);
    const field = field_map && field_map.field ? field_map.field : key;
    return {field_map, field};
}

module.exports = convert_diamond;