'use strict';

const { std_fields} = require('../cfg');

const is_empty = require('./is-empty');

module.exports = (key, value, field_map, errors) => {

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
    const lc_value = String(value).toLocaleLowerCase();
    const mapped_value = values_map[lc_value];
    if (!is_empty(mapped_value)) {
        value = mapped_value;
    }
    return value;
};