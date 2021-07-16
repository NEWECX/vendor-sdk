'use strict';

const std_fields = require('../cfg/std-fields');
const gia_shapes = require('../cfg/gia-shapes');

function match_std_value(key, value, field_map, errors) {

    const std_field = std_fields.find(x => x.key === key);
    if (!std_field) {
        const message = `key(${key}) not found in std_fields`;
        if (errors) {
            throw new Error({type: 'error', message});
        } else {
            throw new Error(message);
        }
    }
    if (std_field.values && std_field.values.includes(value)) {
        return value;
    }
    if (!std_field.values && (!field_map || !field_map.values_map)) {
        return value;
    }
    const values_map = std_field.values_map ? { ...std_field.values_map } : {};
    if (field_map && field_map.values_map) {
        Object.assign(values_map, field_map.values_map);
        if (key === 'shape') {
            Object.assign(values_map, gia_shapes);
        }
    }
    let mapped_value = values_map[value];
    if (mapped_value === undefined || mapped_value === null || mapped_value === '') {
        if (typeof value === 'string') { // try lower cases
            const lower_case_value = value.toLowerCase();
            mapped_value = values_map[lower_case_value];  
            if (mapped_value !== undefined && mapped_value !== null && mapped_value !== '') {
                value = mapped_value;
            }
        }
    } else {
        value = mapped_value;
    }

    return value;
}

module.exports = match_std_value;