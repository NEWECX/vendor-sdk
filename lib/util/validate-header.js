'use strict';

const is_std_header = require('./is-std-header');
const push_errors = require('./push-errors');
const get_std_field = require('./get-std-field');

function validate_header(header, agreed_header, fields_maps, errors = []) {

    if (!header || !Array.isArray(header) || header.length === 0) {
        push_errors(errors, 'header', 'error', 'missing or not array or empty');
        return false;    
    }

    if (!agreed_header || !Array.isArray(agreed_header)) {
        push_errors(errors, 'header', 'error', 'agreed missing or not array');
        return false;    
    }

    if (is_std_header(header)) {
        return 'std';
    }

    if (agreed_header.length === 0) {
        push_errors(errors, 'header', 'error', 'agreed_header is empty');
        return false;    
    }

    if (header.length !== agreed_header.length) {
        push_errors(errors, 'header', 'warning', `number of header fields ${header.length} is not ${agreed_header.length} of agreed header`);
    }

    let errors_count = 0;

    const passed = [];
    for (let i = 0; i < header.length; i++) {
        let error_type = 'warning';
        const field = header[i];
        const field_map = fields_maps ? fields_maps.find(x => x.field === field) : null;
        if (field_map) {
            const std_field = get_std_field(field_map.key)
            if (std_field && std_field.require === 'required') {
                error_type = 'error';
                errors_count++;
            }
        }
        if (!passed.includes(header[i])) {
            passed.push(header[i]);
        } else {
            push_errors(errors, 'header', error_type, `column: ${i+1} header is ${field}, duplicated header field name`);
        }
        if (header[i] !== agreed_header[i]) {
            push_errors(errors, 'header', error_type, `column: ${i+1} header is ${field}, not matching with agreed header: ${agreed_header[i]}`);
        }
    }
    if (fields_maps) {
        for (const field_map of fields_maps) {
            const std_field = get_std_field(field_map.key)
            if (field_map.field && std_field && (!std_field.reducible && std_field.require === 'required')) {
                if (!passed.includes(field_map.field)) {
                    push_errors(errors, 'header', 'error', `missing required field: ${field_map.field}`);
                    errors_count++;
                }
            }
        }
    }
    if (errors.length > 0) {
        const headers = agreed_header.join(', ');
        push_errors(errors, 'header', 'info', `For your reference, the agreed header: ${headers}`);
    }
    
    if (errors_count > 0) {
        return false;
    } else {
        return true;
    }
}

module.exports = validate_header