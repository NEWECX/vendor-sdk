'use strict';

const std_fields = require('../cfg/4-std-fields');
const { assets_filename_map } = require('../cfg/2-assets-config');

function convert_diamond(timestamp, index, row, fields_map) {

    const errors = [];
    const diamond = {row_no: index + 1, pass: true, timestamp};

    for (const item of std_fields) {

        const { key, require, type, values } = item;

        const field_map = fields_map.find(x => x.key === key);
        const field = field_map && field_map.field ? field_map.field : key;

        let value = get_value(row[field], type);

        if (value === '') {

            if (field_map && field_map.hasOwnProperty('default_value')) {
                value = field_map.default_value;
            }
            
        } else {

            // has values_map
            //
            if (field_map && field_map.values_map) { 

                // no values in std_fields or not included
                //
                if (!values || !values.includes(value)) {
                    // need to map
                    //
                    let mapped_value = field_map.values_map[value];

                    if (mapped_value === undefined || mapped_value === null) {

                        // try lower cases
                        const lower_case_value = value.toLowerCase();
                        mapped_value = field_map.values_map[lower_case_value];  

                        if (mapped_value === undefined || mapped_value === null) {

                            errors.push(`row_no: ${index + 1} error, value(${value}) not mapped for ${key} => ${field}`);
                            diamond.pass = false;
                            value = mark_value(value);
                            
                        } else {

                            value = mapped_value;
                        }

                    } else {

                        value = mapped_value;
                    }
                }
            }
        }

        if (value === '') {

            if (require === 'required') {

                diamond.pass = false;
                errors.push(`row_no: ${index + 1} error, missing value(${value}) for required ${key} => ${field}`);
                diamond[key] = '*';

            } else if (require === 'expected') {

                errors.push(`row_no: ${index + 1} warning, value ${key}(${field}) is empty, but expected`);
                diamond[key] = '';
                
            } else {

                diamond[key] = '';
            }

        } else {

            if (type === 'number') {
                
                if (isNaN(value)) {

                    diamond.pass = false;
                    errors.push(`row_no: ${index + 1} error, ${field} value is not number`);
                    diamond[key] = mark_value(value);

                } else if (typeof value !== 'number') {

                    diamond[key] = Number(value);

                } else {

                    diamond[key] = value;
                }

            } else if (!assets_filename_map[key] && values) {

                if (!values.includes(value)) {

                    diamond.pass = false;
                    errors.push(`row_no: ${index + 1} error, ${key} => ${field} => ${value} not in ${values.join(', ')}`);
                    diamond[key] = mark_value(value);

                } else {

                    diamond[key] = value;
                }

            } else if (assets_filename_map[key]) {

                const { protocol } = new URL(value)

                if (!['http:', 'https:'].includes(protocol)) {

                    if (require === 'required') {

                        diamond.pass = false;

                    }

                    errors.push(`row_no: ${index + 1} error, ${key} => ${field} => ${value} protocol not http and https`);
                    diamond[key] = mark_value(value);

                } else {

                    diamond[key] = value;

                }

            } else {

                diamond[key] = value;
            }
        }
    }

    diamond.original = row;

    if (errors.length > 0) {
        diamond.errors = errors;
    }

    return diamond;
}

function mark_value(value) {

    if (!value) {

        return '*';

    } else if (typeof value === 'string') {

        if (value.charAt(0) !== '*') {
            return '* ' + value;
        }

    } else {
        return '* ' + value;
    }
}

function get_value(value, type) {

    if (typeof value === 'string') {

        const start_quote = value.charAt(0) === '"';
        const end_quote = value.charAt(value.length - 1) === '"';

        if ( start_quote || end_quote) {

            const parts = value.split('');
            if (start_quote) {
                parts.shift();
            }
            if (end_quote) {
                parts.pop();
            }
            value = parts.join('');

        }

    } else if (value === undefined || value === null) {
        
        value = '';

    }

    if (type === 'number' && value !== '' && !isNaN(value) ) {

        value = Number(value);

    }

    return value;
}

module.exports = convert_diamond;