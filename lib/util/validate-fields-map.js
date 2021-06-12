'use strict';

const get_std_field = require('./get-std-field');

/**
 * 
 * @param {*} fields_map 
 * @returns null if passed, errors if failed
 */
function validate_fields_map(fields_map) {

    const errors = [];

    if (!fields_map || Object.keys(fields_map).length === 0) {
        errors.push('fields_map is missing or empty');
        return errors;
    }

    if (!Array.isArray(fields_map)) {
        errors.push('fields_map is not an array');
        return errors;
    }

    if (fields_map.length === 0) {
        errors.push('fields_map is an empty array');
        return errors;
    }

    for (let index = 0;  index < fields_map.length; index++) {
        
        const field_map = fields_map[index];

        if (!field_map.key) {
            errors.push(`fields_map[${index}] missing key`);
            continue; 
        }

        const key = field_map.key;

        const std_field = get_std_field(key);

        if (!std_field) {
            errors.push(`fields_map[${index}] with ${key} is extra, not found in standard fields`);
            continue; 
        }

        if (std_field.values) {

            if (field_map.values_map) {

                const values_map = field_map.values_map;

                for (const value in values_map) {

                    const map_to = values_map[value];
                    if (!std_field.values.includes(map_to)) {
                        errors.push(`fields_map[${index}] with values_map ${key} value ${value} => ${map_to}, not validate`);
                    }
                }
            }

            if (field_map.default_value) {
                
                if (!std_field.values.includes(field_map.default_value)) {
                    errors.push(`fields_map[${index}] with default value ${field_map.default_value}, not validate`);
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