'use strict';

const std_fields = require('../cfg/std-fields');
const call_function = require('./call-function');
const get_value = require('./get-value');

function match_std_value(key, field, value, row, values_map, errors) {

    const std_field = std_fields.find(x => x.key === key);
    if (!std_field) {
        const message = `key(${key}) not found in std_fields`;
        if (errors) {
            throw new Error({type: 'error', message});
        } else {
            throw new Error(message);
        }
    }
    if (typeof values_map === 'function') {
        try {        
            value = call_function(values_map, key, field, value, row);
            value = get_value(value, std_field.type);
        } catch (err) {
            const message = `values_map function with ${value} failed, ${err.message}`;
            if (errors) {
                errors.push({type: 'error', message});
            } else {
                throw new Error(message)
            }
        }
        return value
    }
    if (std_field.values && std_field.values.includes(value)) {
        return value;
    }
    if (!std_field.values && !std_field.values_map) {
        return value;
    }
    if (!values_map) values_map = {};
    if (std_field.values_map) {
        values_map = {...std_field.values_map, ...values_map}   
    }
    let mapped_value = values_map[value];
    if (mapped_value === undefined || mapped_value === null || mapped_value === '') {
        // try lower cases
        const lower_case_value = value.toLowerCase();
        mapped_value = values_map[lower_case_value];  
        if (mapped_value !== undefined && mapped_value !== null && mapped_value !== '') {
            value = mapped_value;
        }
    } else {
        value = mapped_value;
    }

    return value;
}

module.exports = match_std_value;