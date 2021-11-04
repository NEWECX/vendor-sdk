'use strict';

const std_fields = require('../cfg/std-fields');
const gia_shapes = require('../cfg/gia-shapes');
const is_empty = require('./is-empty');

function match_value(key, value, field_map, errors) {

    const std_field = std_fields.find(x => x.key === key);
    if (!std_field) {
        const message = `key(${key}) not found in std_fields`;
        errors.push({type: 'error', message});
    }
    if (std_field.values && std_field.values.includes(value)) {
        return value;
    }
    if (!std_field.values) {
        return value;
    }
    const values_map = std_field.values_map ? { ...std_field.values_map } : {};
    if (field_map && field_map.values_map) {
        for (const key in field_map.values_map) {
            const lc_key = key.toLocaleLowerCase();
            values_map[lc_key] = field_map.values_map[key];
        }
    }
    if (key === 'shape') {
        Object.assign(values_map, gia_shapes);
    }
    const lc_value = String(value).toLocaleLowerCase();
    const mapped_value = values_map[lc_value];
    if (!is_empty(mapped_value)) {
        value = mapped_value;
    }
    return value;
}

module.exports = match_value;