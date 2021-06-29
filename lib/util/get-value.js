'use strict';

function get_value(value, type, default_value) {

    if (value === '') {
        if (default_value) {
            value = default_value;
        } else {
            return '';
        }
    } else if (typeof value === 'string') {
        const new_chars = [];
        const l = value.length;
        for (let i = 0; i < l; i++) {
            // skip no printable ascii and unicode
            const code = value.charCodeAt(i);
            if (code < 20 || code > 126 || code > 255) {
                continue; 
            }
            new_chars.push(value.charAt(i));
        }
        while (new_chars.length > 0 && ['"', ' '].includes(new_chars[0])) {
            new_chars.shift();
        }
        while (new_chars.length > 0 && ['"', ' '].includes(new_chars[new_chars.length -1])) {
            new_chars.pop();
        }
        if (new_chars.length === 0) {
            if (default_value) {
                value = default_value;
            } else {
                return '';
            }
        }
        value = new_chars.join('');
    } else if (value === undefined || value === null) {
        if (default_value) {
            value = default_value;
        } else {
            return '';
        }
    }
    if (value === '' || value === undefined || value === null) {
        return '';
    }
    if ((type === 'number' || !type) && !isNaN(value)) {
        value = Number(value);
    }    
    return value;
}

module.exports = get_value;