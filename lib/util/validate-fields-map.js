'use strict';

const get_std_field = require('./get-std-field');
const push_errors = require('./push-errors');
/**
 * 
 * @param {*} fields_map 
 * @returns null if passed, errors if failed
 */
function validate_fields_map(fields_map) {

    const errors = [];

    if (!fields_map) {
        push_errors(errors, 'fields_map', 'error', 'missing');
        return errors;
    }

    if (!Array.isArray(fields_map)) {
        push_errors(errors, 'fields_map', 'error', 'not an array');
        return errors;
    }

    if (fields_map.length === 0) {
        return null;
    }

    for (let index = 0;  index < fields_map.length; index++) {
        
        const field_map = fields_map[index];

        if (!field_map.key) {
            push_errors(errors, 'fields_map', 'error', `[${index}] missing key`);
            continue; 
        }

        const key = field_map.key;

        const std_field = get_std_field(key);

        if (!std_field) {
            push_errors(errors, 'fields_map', 'error', `[${index}] with ${key} is extra, not found in standard fields`);
            continue; 
        }

        if (std_field.values) {

            if (field_map.values_map) {

                const values_map = field_map.values_map;

                for (const value in values_map) {

                    const map_to = values_map[value];

                    if (map_to === '' && std_field.require !== 'required') {
                        continue;
                    }

                    if (!std_field.values.includes(map_to)) {
                        push_errors(errors, 'fields_map', 'error', `[${index}] with values_map ${key} value ${value} => ${map_to}, not in ${std_field.values.join(', ')}`);
                    }
                }
            }

            if (field_map.default_value) {
                
                if (!std_field.values.includes(field_map.default_value)) {
                    push_errors(errors, 'fields_map', 'error', `[${index}] with default value ${field_map.default_value}, not in ${std_field.values.join(', ')}`);
                }
            }
        }
    }

    if (errors.length > 0) {
        return errors;
    }

    return null;
}

module.exports = validate_fields_map;