'use strict';

const std_fields = require('../cfg/std-fields');
const mark_value = require('./mark-value');
const call_function = require('./call-function');

function match_std_value(index, key, field, value, row, values_map = {}, errors) {

    const std_field = std_fields.find(x => x.key === key);

    if (!std_field) {
        errors.push(`row_no: ${index + 1} error, key(${key}) => ${field} not found in std_fields`);
        value = mark_value(value);
        return value;
    }

    if (std_field.values && std_field.values.includes(value)) {
        return value;
    }

    if (typeof values_map === 'function') {

        try {        

            value = call_function(values_map, key, field, value, row);

            if (std_field.values && !std_field.values.includes(value)) {

                errors.push(`row_no: ${index + 1} error, values_map function returns (${value}), not validate`);
                value = mark_value(value);
            }
        } catch (err) {

            errors.push(`row_no: ${index + 1} error, ${field} call values_map(${value}, row) failed, ${err.message}`);
            value = mark_value(value);
        }

        return value

    }

    if (!std_field.values) {
        return value;
    }

    if (std_field.values_map) {
        values_map = {...std_field.values_map, ...values_map}   
    }

    let mapped_value = values_map[value];

    if (mapped_value === undefined || mapped_value === null || mapped_value === '') {

        // try lower cases
        const lower_case_value = value.toLowerCase();
        mapped_value = values_map[lower_case_value];  

        if (mapped_value === undefined || mapped_value === null || mapped_value === '') {

            errors.push(`row_no: ${index + 1} error, value(${value}) not mapped for ${field}`);
            value = mark_value(value);
            
        } else {

            value = mapped_value;
        }

    } else {

        value = mapped_value;
    }

    if (typeof value === 'string' && !value.startsWith('*') && !std_field.values.includes(value)) {
        errors.push(`row_no: ${index + 1} error, values_mapped (${value}) not validate`);
        value = mark_value(value);
    }

    return value;
}

module.exports = match_std_value;