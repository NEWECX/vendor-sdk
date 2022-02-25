'use strict';

const is_std_header = require('../util/is-std-header');
const push_errors = require('../util/push-errors');
const get_std_field = require('../util/get-std-field');
const match_name_value = require('../util/match-name-value');
const get_std_header = require('../util/get-std-header');

module.exports = (header, agreed_header, fields_map, errors = []) => {

    if (!header || !Array.isArray(header) || header.length === 0) {
        push_errors(errors, 'header', 'error', 'missing or not array or empty');
        return false;    
    }

    if (!agreed_header || !Array.isArray(agreed_header)) {
        push_errors(errors, 'header', 'error', 'agreed missing or not array');
        return false;    
    }


    if (is_std_header(header, errors, fields_map)) {
        return 'std';
    }

    if (agreed_header.length === 0) {
        push_errors(errors, 'header', 'error', 'agreed_header is empty');
        return false;    
    }

    if (header.length !== agreed_header.length) {
        push_errors(errors, 'header', 'warning', `number of header fields is ${header.length}, not the same as number of agreed header ${agreed_header.length}`);
    }

    let errors_count = 0;

    const passed_fields = [], passed_keys = [];

    let header_index = 0, agreed_header_index = 0

    while (header_index < header.length && agreed_header_index < agreed_header.length) {

        const field = header[header_index++];
        const agreed_field = agreed_header[agreed_header_index++];

        const [agreed_field_map, agreed_std_field] = find_field_map_and_std_field(agreed_field, fields_map);

        if (!passed_fields.includes(field)) {
            passed_fields.push(field);
        } else {
            const error_type = get_error_type(agreed_std_field)
            push_errors(errors, 'header', error_type, `column: ${header_index} header is ${field}, duplicated header field name`);
            if (error_type === 'error') {
                errors_count++;
            }
            continue;
        }

        if (field === agreed_field) {
            if (agreed_std_field) {
                passed_keys.push(agreed_std_field.key);
            }
            continue;
        }
        
        push_errors(errors, 'header', 'warning', `column: ${header_index} header is ${field}, not matching with agreed header: ${agreed_field}`);

        // fixing letter cases not match
        //
        if (field && agreed_field && field.trim().toLowerCase() === agreed_field.trim().toLowerCase()) {
            if (agreed_field_map) {
                agreed_field_map.field = field;
            } else {
                fields_map.push({key: agreed_std_field.key, field});
            }
            passed_keys.push(agreed_std_field.key);
            continue;
        }

        // fixing agreed_header field matches next header field
        //
        if (agreed_std_field && agreed_std_field.require === 'required') {
            if (header_index < header.length && header[header_index].trim().toLowerCase() === agreed_field.trim().toLowerCase()) {
                agreed_header_index--;
                continue;
            }
        }

        // fixing header field matches next agreed_header field
        //
        const [, std_field] = find_field_map_and_std_field(field, fields_map);
        if (std_field && std_field.require === 'required' && field) {
            if (agreed_header_index < agreed_header.length && agreed_header[header_index].trim().toLowerCase() === field.trim().toLowerCase()) {
                header_index--;
                const index = passed_fields.indexOf(field);
                if (index !== -1) {
                    passed_fields.splice(index, 1);
                }
                continue;
            }    
        }

        const error_type = get_error_type(agreed_std_field);
        push_errors(errors, 'header', error_type, `column: ${header_index} header is ${field}, not matching with agreed header: ${agreed_field}`);
        if (error_type === 'error') {
            errors_count++;
        } else if (match_name_value(field, agreed_std_field)) {
            if (agreed_field_map) {
                agreed_field_map.field = field;
            } else {
                fields_map.push({key: agreed_std_field.key, field});
            }
            passed_keys.push(agreed_std_field.key);
        }        
    }

    while (header_index < header.length) {
        const field = header[header_index];
        const [, std_field] = find_field_map_and_std_field(field, fields_map);
        const error_type = get_error_type(std_field)
        if (passed_fields.includes(field)) {
            push_errors(errors, 'header', error_type, `column: ${header_index + 1} header is ${field}, duplicated header field name`);
            if (error_type === 'error') {
                errors_count++;
            }
        } else {
            push_errors(errors, 'header', error_type, `column: ${header_index + 1} header is ${field}, it is an extra field`);
        }
        header_index++;
    }

    const std_header = get_std_header();
    for (const std_field of std_header) {
        if (!std_field.reducible && std_field.require === 'required' && !passed_keys.includes(std_field.key)) {
            push_errors(errors, 'header', 'error', `missing required field: ${std_field.key}`);
            errors_count++;
        }
    }

    // if (errors.length > 0) {
    //     const headers = agreed_header.join(', ');
    //     push_errors(errors, 'header', 'info', `For your reference, the agreed header: ${headers}`);
    // }

    if (errors_count > 0) {
        return false;
    } else {
        return true;
    }
}

function get_error_type(std_field) {
    if (std_field && std_field.require === 'required') {
        return 'error';
    } else {
        return 'warning';
    }
}

function find_field_map_and_std_field(field, fields_map) {
    if (!field) {
        return [null, null];
    }
    const lc_field = field.trim().toLowerCase();
    const field_map = fields_map ? fields_map.find(x => (x.field && x.field.trim().toLowerCase() === lc_field) || (!x.field && x.key === lc_field)) : null;
    let std_field = null;
    if (field_map) {
        std_field = get_std_field(field_map.key)
    }
    if (!std_field) {
        std_field = get_std_field(lc_field);
    }
    return [field_map, std_field];
}
