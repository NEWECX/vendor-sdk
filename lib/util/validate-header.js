'use strict';

const is_std_header = require('./is-std-header');

function validate_header(header, agreed_header) {

    const errors = [];

    if (!header || !Array.isArray(header) || header.length === 0) {
        errors.push('header is missing or not array or empty');
        return errors;    
    }

    if (!agreed_header || !Array.isArray(agreed_header)) {
        errors.push('agreed_header is missing or not array');
        return errors;    
    }

    if (is_std_header(header)) {

        return 'std';

    }

    if (agreed_header.length === 0) {
        errors.push('agreed_header is empty');
        return errors;    
    }

    if (header.length !== agreed_header.length) {
        errors.push(`number of header fields ${header.length} is not ${agreed_header.length} of agreed header`);
    }

    for (let i = 0; i < header.length; i++) {
        if (header[i] !== agreed_header[i]) {
            errors.push('column: ' + (i+1) + ' header is ' + header[i] + ' not matching with agreed header: ' + agreed_header[i]);
            break;
        }
    }

    if (errors.length > 0) {
        const msg = 'For your reference, the agreed header are:' + JSON.stringify(agreed_header);
        errors.push(msg);
        return errors;
    }
    
    return 'ok';
}

module.exports = validate_header