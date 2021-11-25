'use strict';

const { std_fields: standard_fields, assets_filename_map} = require('../cfg');
const push_errors = require('../util/push-errors');
const get_field_map = require('../util/get-field-map');
const check_certificate = require('../util/check-certificate');
const is_empty = require('../util/is-empty');

module.exports = (diamond, errors, fields_map = {}, std_fields = standard_fields, asset_fields = Object.keys(assets_filename_map)) => {

    if (!diamond.hasOwnProperty('pass')) diamond.pass = true;

    for (const item of std_fields) {

        const { key, type, require, values } = item;
        const value = diamond[key];
        const { field } = get_field_map(fields_map, key);

        if (!is_empty(value)) {
            if (value === 'Not Applicable') {
                diamond[key] = '';
                if (['required', 'expected'].includes(require)) {
                    push_errors(errors, field, 'warning', `claim to Not Applicable`);
                }
                continue;
            }
            if (key === 'certificate_number') {
                if (!check_and_fix_certificate_number(errors, diamond, field)) continue;
            }
            if (key === 'cost' && value < 5) {
                diamond[key] = '';
                diamond.pass = false;
                push_errors(errors, field, 'error', `cost is ${value}, invalid`);
                continue;
            }
            if (key === 'cost_per_carat' && value < 5) {
                diamond[key] = '';
                diamond.pass = false;
                push_errors(errors, field, 'error', `cost_per_carat is ${value}, invalid`);
                continue;
            }
            if (key === 'cost_per_carat' && diamond.pass) {
                if (!check_cost_with_cost_per_carat(diamond, errors)) continue
            }
            if (asset_fields.includes(key) && !value.startsWith('http://') && !value.startsWith('https://')) {
                diamond[key] = '';
                error_with_message(errors, diamond, field, key, value, require, 'invalid url');
                continue;
            }
            if (values && !values.includes(value)) {
                diamond[key] = '';
                error_with_message(errors, diamond, field, key, value, require, `not in ${values.join(', ')}`);
                continue;
            }
            if (type === 'number' && typeof value !== 'number') {
                diamond[key] = '';
                error_with_message(errors, diamond, field, key, value, require, 'not a number');
                continue;
            }
        } else {
            if (process.env.DEBUG && value !== '') {
                console.error(`unexpected, empty value for ${key} is not empty string ${value}`);
            }
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

    return diamond.pass;
};

function check_and_fix_certificate_number(errors, diamond, field) {
    try {
        const {certificate_lab, certificate_number} = check_certificate(diamond.certificate_lab, diamond.certificate_number);
        diamond.certificate_lab = certificate_lab;
        diamond.certificate_number = certificate_number;
        return true;
    } catch(err) {
        diamond.certificate_number = '';
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
        diamond.cost = '';
        diamond.cost_per_carat = '';
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

