'use strict';

const { std_fields: standard_fields, assets_filename_map, color_keys} = require('../cfg');

const get_value = require('../util/get-value');
const match_value = require('../util/match-value');
const push_errors = require('../util/push-errors');
const transform_colors = require('../util/transform-colors');
const check_certificate = require('../util/check-certificate');
const is_empty = require('../util/is-empty');

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
 module.exports = async (row, fields_map, options, std_fields = standard_fields, asset_fields = Object.keys(assets_filename_map)) => {

    const errors = [];
    const diamond = {pass: true};

    // pass 1: get original values 
    //
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
                    errors.push({type: 'error', message});
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

    // pass 2: run standard transforms
    //
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

    // pass 3: transform and validate colors
    //
    try {
        transform_colors(diamond, std_fields);
    } catch(err) {
        push_errors(errors, 'color', 'error', `transform_colors ${err.message}`);
    }

    // pass 4 transform, validate and additional_maps
    //
    const key_value_extension = options ? options.key_value_extension : null;

    for (const item of std_fields) {
        const { key, type, require, values } = item;
        const { field } = get_field_map(fields_map, key);
        let value = diamond[key];
        if (key_value_extension && values && !values.includes(value)) {
            try {
                value = await key_value_extension(key, value);
            } catch (err) {
                console.error('ERROR: call convert_diamond_extension', err);
            }
        }
        if (value !== '') {
            if (key === 'certificate_number' && !check_and_fix_certificate_number(errors, diamond, field)) {
                diamond[key] = '';
                continue;
            }
            if (key === 'cost' && value < 5) {
                diamond[key] = '';
                diamond.pass = false;
                push_errors(errors, field, 'error', `cost is ${value}, invalid`);
                continue;
            }
            if (key === 'cost_per_carat') {
                if (value < 5) {
                    diamond.pass = false;
                    push_errors(errors, field, 'error', `cost_per_carat is ${value}, invalid`);
                    continue;
                }
                if (diamond.pass && !check_cost_with_cost_per_carat(diamond, errors)) {
                    continue
                }
            }
            if (values && !values.includes(value)) {
                diamond[key] = '';
                if (error_with_message(errors, diamond, field, key, value, require, `not in ${values.join(', ')}`)) {
                    continue;
                }
            }
            if (type === 'number') {
                if (typeof value !== 'number') {
                    diamond[key] = '';
                    if (error_with_message(errors, diamond, field, key, value, require, 'not a number')) {
                        continue;
                    }
                }
            }
            if (asset_fields.includes(key)) {
                if (!value.startsWith('http://') && !value.startsWith('https://')) {
                    diamond[key] = '';
                    if (error_with_message(errors, diamond, field, key, value, require, 'invalid url')) {
                        continue;
                    }
                } else {
                    try {
                        const { protocol } = new URL(value)
                        if (!['http:', 'https:'].includes(protocol)) {
                            diamond[key] = '';
                            if (error_with_message(errors, diamond, field, key, value, require, 'protocol not http and https')) {
                                continue;
                            }
                        }
                    } catch(err) {
                        diamond[key] = '';
                        if (error_with_message(errors, diamond, field, key, value, require, 'invalid url')) {
                            continue;
                        }

                    }
                }
            }
        }
        if (value === '') {
            if (key === 'cut') {
                if (diamond.shape === 'RD') {
                    diamond.pass = false;
                    push_errors(errors, field, 'error', `cut is required for round diamond`);
                }
                continue;
            }
            if (!['required', 'expected'].includes(require)) {
                continue;
            }
            error_with_message(errors, diamond, field, key, value, require, 'empty value')
        }
    }

    diamond.original = row;

    if (errors.length > 0) {
        diamond.errors = errors;
    }

    return diamond;
};

function check_and_fix_certificate_number(errors, diamond, field) {
    try {
        const {certificate_lab, certificate_number} = check_certificate(diamond.certificate_lab, diamond.certificate_number);
        diamond.certificate_lab = certificate_lab;
        diamond.certificate_number = certificate_number;
        return true;
    } catch(err) {
        diamond.pass = false;
        push_errors(errors, field, 'error', `invalid certificate, ${err.message}`); 
        return false;
    }
}

function check_cost_with_cost_per_carat(diamond, errors) {
    const calculated_cost = diamond.carat * diamond.cost_per_carat;
    const difference = Math.abs(calculated_cost - diamond.cost)
    if (difference >= 10.00) { // difference great than 10 dollar
        diamond.pass = false;
        push_errors(errors, 'cost', 'error', `cost (${diamond.cost.toFixed(2)}) not agrees with carat * cost_per_carat (${calculated_cost.toFixed(2)}), difference ${difference}`);
        return false;
    } else if (difference > 1.00) { // select the lower one
        if (calculated_cost < diamond.cost) {
            diamond.cost = Math.round(calculated_cost * 100) / 100;   
        } else {
            diamond.cost_per_carat = Math.round(diamond.cost / diamond.carat * 100) / 100;
        }
        push_errors(errors, 'cost', 'warning', `difference between cost (${diamond.cost.toFixed(2)}) and carat * cost_per_carat (${calculated_cost.toFixed(2)}) is ${difference}, select the lower one`);
    }
    return true;
}

function error_with_message(errors, diamond, field, key, value, require, message) {
    const text = `${require} key, ${key} => ${value}, ${message}`;
    if (require === 'required') {
        diamond.pass = false;
        push_errors(errors, field, 'error', text);
        return true;
    }
    push_errors(errors, field, 'warning', text);
    return false;
}

function get_field_map(fields_map, key) {
    const field_map = fields_map.find(x => x.key === key);
    const field = field_map && field_map.field ? field_map.field : key;
    return {field_map, field};
}
