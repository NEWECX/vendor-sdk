'use strict';

const standard_fields = require('../cfg/std-fields');
const { assets_filename_map } = require('../cfg/assets-config');
const get_value = require('./get-value');
const match_std_value = require('./match-std-value');
const push_errors = require('./push-errors');

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
 * 5) transform: function
 * vendor specific transform function, will call it with arguments value, row, diamond
 * 
 * 6) values_map: key value object
 * vendor specific mapping to convert provided value to one of standard values
 * 
 */
async function convert_diamond(row, fields_map, options, std_fields = standard_fields, asset_fields = Object.keys(assets_filename_map)) {

    //console.log(fields_map);
    const errors = [];
    const diamond = {pass: true};

    // use vendor specific fields_map
    for (const item of std_fields) {

        const { key, type, values } = item;
        const {field_map, field} = get_field_map(fields_map, key);

        let value = field_map && field_map.ignore ? '' : get_value(row[field], type, diamond[key]);

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
            value = match_std_value(key, value, field_map, errs);
            for (const {type, message} of errs) {
                push_errors(errors, field, type, message);
                if (type === 'error') {
                    diamond.pass = false;
                }
            }
        }
        diamond[key] = value;
    }

    // run standard transforms
    for (const item of std_fields) {
        const { key, type, transform, always_transform } = item;
        if (transform && (always_transform || (diamond[key] === '' || diamond[key] === null || diamond[key] === undefined))) {
            try {
                const {field} = get_field_map(fields_map, key);
                diamond[key] = get_value(transform(diamond, field), type);
            } catch(err) {
                const {field} = get_field_map(fields_map, key);
                push_errors(errors, field, 'error', `transform ${err.message}`);
            }
        }
        if (diamond[key] === null || diamond[key] === undefined) {
            diamond[key] = '';
        }
    }

    const key_value_extension = options ? options.key_value_extension : null;

    // validate and additional_maps
    for (const item of std_fields) {

        const { key, type, require, values, reducible } = item;
        const { field } = get_field_map(fields_map, key);
        let value = diamond[key];
        if (value !== '') {
            if (key === 'certificate_number' && /[non| |not|un|E+]/i.test(value)) {
                diamond.pass = false;
                push_errors(errors, field, 'error', `invalid certificate number, ${key} => ${value}`); 
                continue;
            }
            if (key_value_extension && values && !values.includes(value)) {
                try {
                    value = await key_value_extension(key, value);
                } catch (err) {
                    console.error('ERROR: call convert_diamond_extension', err);
                }
            }
            if (values && !values.includes(value)) {
                if (require === 'optional' || require === 'expected') {
                    if (require === 'expected') {
                        diamond[key] = '';
                    }
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
                    push_errors(errors, field, 'error', `value(${value}) is not number`);
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

    if (diamond.pass || (diamond.cost > 1 && diamond.cost_per_carat > 1)) {
        if (diamond.cost < 1) {
            diamond.pass = false;
            push_errors(errors, 'cost', 'error', `cost is ${diamond.cost}, invalid`);
        } else if (diamond.cost && diamond.cost_per_carat) {
            const calculated_cost = diamond.carat * diamond.cost_per_carat;
            const difference = Math.abs(calculated_cost - diamond.cost)
            if (difference >= 1.00) { // difference great than 1 dollar
                diamond.pass = false;
                push_errors(errors, 'cost', 'error', `cost (${diamond.cost.toFixed(2)}) not agrees with carat * cost_per_carat (${calculated_cost.toFixed(2)}), difference ${difference}`);
            } else if (difference > 0.00) { // select the lower one
                if (calculated_cost < diamond.cost) {
                    diamond.cost = Math.round(calculated_cost * 100) / 100;   
                } else {
                    diamond.cost_per_carat = Math.round(diamond.cost / diamond.carat * 100) / 100;
                }
            }
        }
    }

    // fix certificate_number starts with lab
    if (diamond.certificate_lab && diamond.certificate_number && diamond.certificate_number.startsWith(diamond.certificate_lab)) {
        diamond.certificate_number = diamond.certificate_number.substr(diamond.certificate_lab.length);
        if (diamond.certificate_number.length > 0) {
            const first_char = diamond.certificate_number.charAt(0);
            if ([' ', '-', '_', '#'].includes(first_char)) {
                diamond.certificate_number = diamond.certificate_number.substr(1);
            }
        }
    }
    
    // fix width and length, and standardize measurements
    if (diamond.width && diamond.length && 
        typeof diamond.width === 'number' && typeof diamond.length === 'number') {
        if (diamond.width > diamond.length) {
            const t = diamond.width;
            diamond.width =  diamond.length;
            diamond.length = t;
        }
        if (diamond.depth && typeof diamond.depth === 'number') {
            const measurements = diamond.length.toFixed(2) + ' - '  + diamond.width.toFixed(2)+ ' x ' + diamond.depth.toFixed(2);
            if (measurements !== diamond.measurements) {
                diamond.measurements = measurements;
            }
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