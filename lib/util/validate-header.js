'use strict';

const is_std_header = require('./is-std-header');
const push_errors = require('./push-errors');

function validate_header(header, agreed_header) {

    const errors = [];

    if (!header || !Array.isArray(header) || header.length === 0) {
        push_errors(errors, 'header', 'error', 'missing or not array or empty');
        return errors;    
    }

    if (!agreed_header || !Array.isArray(agreed_header)) {
        push_errors(errors, 'header', 'error', 'agreed missing or not array');
        return errors;    
    }

    if (is_std_header(header)) {

        return 'std';

    }

    if (agreed_header.length === 0) {
        push_errors(errors, 'header', 'error', 'agreed_header is empty');
        return errors;    
    }

    if (header.length !== agreed_header.length) {
        push_errors(errors, 'header', 'error', `number of header fields ${header.length} is not ${agreed_header.length} of agreed header`);
    }

    for (let i = 0; i < header.length; i++) {
        if (header[i] !== agreed_header[i]) {
            push_errors(errors, 'header', 'error', 'column: ' + (i+1) + ' header is ' + header[i] + ' not matching with agreed header: ' + agreed_header[i]);
            break;
        }
    }

    if (errors.length > 0) {
        push_errors(errors, 'header', 'error', 'For your reference, the agreed header:' + JSON.stringify(agreed_header));
        return errors;
    }
    
    return 'ok';
}

module.exports = validate_header