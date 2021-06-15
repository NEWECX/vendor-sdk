'use strict';

const the_std_fields = require('../cfg/4-std-fields')
const match_std_value = require('./match-std-value');
const match_name_value = require('./match-name-value');
const to_js = require('./to-js');

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
        if (std_field.values_map_needed) {
            field_map.values_map = std_field.values_map_needed;
            field_map.allowed_values = std_field.values.join(', ');
        }
        field_map.description = std_field.description;
        field_map.require = std_field.require;
        field_map.type = std_field.type;
        fields_map.push(field_map);
    }

    const code_lines = to_js(fields_map).split('\n');
    let values_map_started = false;
    for (let i = 0; i < code_lines.length; i++) {
        let line = code_lines[i];
        if (line.includes('values_map:')) {
            code_lines[i] = ' /* replace the ? with one of the allowed value and uncomment the block';
            i++;
            code_lines.splice(i, 0, line);
            values_map_started = true;
        }
        if (values_map_started) {
            if (line.includes('},')) {
                code_lines[i] = line;
                i++;
                code_lines.splice(i, 0, ' */');
                values_map_started = false;
            }
        } else {
            line = line.replace('    description:', ' // description:');
            line = line.replace('    require:', ' // require:');
            line = line.replace('    type:', ' // type:');
            line = line.replace('    allowed_values:', ' // allowed_values:');
            line = line.replace('    field: \'?', ' // replace the ? with matched field name and uncomment the line\n // field: \'?');
            line = line.replace('    field: \'*', ' // replace the *? with matched field name and uncomment the line\n // field: \'*');
            code_lines[i] = line;
        }
    }
    let result = '\'use strict\';\n\n';

    result += '/* fields not used \n';
    result += fields_not_used.join(', ') + '\n';
    result += '*/\n\n';
    result += 'const fields_map = ' + code_lines.join('\n') + ';\n\n';
    result += 'module.exports = fields_map;\n'

    return result;
}




module.exports = mk_fields_map;