'use strict';

const { to_simple_js } = require('@ritani/to-simple-js');
const { values_maps, certificate_full_names } = require('@ritani/diamond-glossary');
const the_std_fields = require('../cfg/std-fields')
const match_std_value = require('./match-std-value');
const match_name_value = require('./match-name-value');


function mk_fields_map(header_stats) {

    const std_fields = JSON.parse(JSON.stringify(the_std_fields));
    const fields_not_used = [];
    const fields = header_stats.fields;

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
                if (match_name_value(field, item.match, value)) {
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
                const errors = [];
                let index = 0;
                for (const item of stats.distinct_values) {
                    const row = samples[item.check_sum];
                    if (!row) {
                        continue;
                    }
                    let value = item.value;
                    value = match_std_value(index, key, field, value, row, {}, errors);
                    if (typeof value === 'string' && value.startsWith('*')) {
                        values_map_needed[item.value] = '?';
                    }
                    index++;
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
        if (std_field.values_map_needed) {
            field_map.values_map = std_field.values_map_needed;
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

    const comments = [
        {
               starting: '    dictionary:',
            replacement: '\n /* for your reference:\n',
                    end: '    }'
        },
        {
               starting: '    values_map:',
            replacement: '\n /* replace the ? with one of the allowed value and uncomment the block\n',
                    end: '    }'
        },
        {
               starting: '    description:',
            replacement: '\n // description:'
        },
        {
               starting: '    require:',
            replacement: ' // require:'
        },
        {
                starting: '    type:',
             replacement: ' // type:'
        },
        {
                starting: '    allowed_values:',
             replacement: '\n // allowed_values::'
        },
        {
                starting: '    field: \'?',
             replacement: ' // replace the ? with matched field name and uncomment the line\n // field: \'?'
        },
        {
                starting: '    field: \'*',
             replacement: ' // replace the *? with matched field name and uncomment the line\n // field: \'*'
        },
    ];

    let disclaim = '// This is a reference and draft version of fields maps based on the data you provided.\n';
    disclaim += '// It is vendor\'s responsibility to make it correct and accurate.\n\n';
    disclaim += '// PLEASE MAKE SURE cost and cost_per_carat are mapped CORRECTLY.\n';
    disclaim += '// You can use one of two fields, leave another unmapped or empty.\n\n';

    if (fields_not_used.length > 0) {
        comments.unshift({starting: 2, replacement: `${disclaim}// fields not used: \n// ${fields_not_used.join(', ')}\n`});
    } else {
        comments.unshift({starting: 2, replacement: disclaim});
    }

    const result = to_simple_js('fields_map', fields_map, comments);

    return result;
}




module.exports = mk_fields_map;