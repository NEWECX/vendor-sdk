'use strict';

require('colors');

const { values_maps, certificate_full_names } = require('@ritani/diamond-glossary');

const { std_fields: the_std_fields } = require('../cfg')

const match_value = require('../util/match-value');
const match_name_value = require('../util/match-name-value');
const clean_fields_maps = require('../util/clean-fields-maps');
const non_std_mappings = require('../util/non-std-mappings');

module.exports = async (header_stats, previous, options) => {

    if (previous) previous = clean_fields_maps(previous, false);

    const std_fields = JSON.parse(JSON.stringify(the_std_fields));
    const fields = header_stats.fields;

    if (previous) {
        for (const item of previous) {
            const std_field = std_fields.find(x => x.key === item.key);
            if (std_field && item.field) {
                delete fields[item.field]
                std_field.field = item.field;
            }
        }
    }

    const fields_not_used = [];

    for (const field in fields) {

        const stats = fields[field];
        if (!stats) {
            console.error(`header_stats.fields[${field}] is empty`);
            continue;
        }

        let std_field = std_fields.find(x => x.key === field);

        if (std_field) {
            std_field.field = field;
        } else  {
            const value = stats.distinct_values && stats.distinct_values.length > 0 ? stats.distinct_values[0].value : null
            for (const item of std_fields) {
                if (item.field || !item.match) {
                    continue;
                }
                if (match_name_value(field, item, value)) {
                    std_field = item;
                    std_field.field = field;
                    break;
                }
            }
        }

        if (!std_field) {
            fields_not_used.push(field)
            continue;
        }

        const values_map_needed = {};
        const key = std_field.key;

        if (std_field.values || std_field.transform || std_field.values_map) {
            if (stats.distinct_values && stats.distinct_values.length > 0) {
                const samples = header_stats.samples;
                for (const item of stats.distinct_values) {
                    const row = samples[item.check_sum];
                    if (!row) {
                        continue;
                    }
                    const value = match_value(key, item.value);
                    if (std_field.values && !std_field.values.includes(value)) {
                        values_map_needed[item.value] = '?';
                    }
                }         
            }
        }
       
        if (Object.keys(values_map_needed).length > 0) {
            std_field.values_map_needed = values_map_needed;
        }
    }

    const fields_map = [];
    for (const std_field of std_fields) {
        const field_map = {key: std_field.key};
        const prev_field_map = previous ? previous.find(x => x.key === std_field.key) : null;
        if (prev_field_map) {
            for (const key in prev_field_map) {
                if (['key', 'values_map'].includes(key)) {
                    continue;
                }
                const value = prev_field_map[key];
                if (key === 'field' && ['?', '*?'].includes(value)) {
                    continue;
                }
                field_map[key] = value;
            }
        }
        if (!std_field.field) {
            if (std_field.require === 'required') {
                field_map.field = '*?';
            } else if (std_field.require === 'expected') {
                field_map.field = '?';
            }
        } else {
            field_map.field = std_field.field;
        }
        field_map.description = std_field.description;
        field_map.require = std_field.require;
        field_map.type = std_field.type;
        if (prev_field_map && prev_field_map.values_map) {
            if (!field_map.values_map) field_map.values_map = {};
            for (const key in prev_field_map.values_map) {
                const value = prev_field_map.values_map[key];
                if (value === '?') {
                    continue;
                }
                field_map.values_map[key] = value;
            }
        }
        if (std_field.values_map_needed) {
            if (!field_map.values_map) field_map.values_map = {};
            for (const key in std_field.values_map_needed) {
                if (field_map.values_map.hasOwnProperty(key)) {
                    continue;
                }
                const value = non_std_mappings(std_field.key, key);
                field_map.values_map[key] = value !== key ? value : std_field.values_map_needed[key];
            }
        }
        if (field_map.values_map) {
            for (const key in field_map.values_map) {
                if (field_map.values_map[key] !== '?') {
                    continue;
                }
                const value = non_std_mappings(std_field.key, key);
                if (value !== key) {
                    field_map.values_map[key] = value;
                }
            }
        }
        if (values_maps[std_field.key]) {
            field_map.allowed_values = std_field.values.join(', ');
            if (std_field.key === 'certificate_lab') {
                field_map.dictionary = certificate_full_names;
            } else {
                field_map.dictionary = values_maps[std_field.key].map;
            }
        }
        fields_map.push(field_map);
    }

    if (options && options.fields_maps_extension) {
        try {
            await options.fields_maps_extension(header_stats, fields_map, fields_not_used);
        } catch(err) {
            console.error('ERROR: call fields_maps_extension', err.message.red);
            if (process.env.DEBUG) {
                console.error(err);
            }
        }
    }

    return {fields_map, fields_not_used};

};