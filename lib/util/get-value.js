'use strict';

const is_empty = require('./is-empty');

const extra_chars = ['`', '\'', '"', ' '];

module.exports = (value, type, default_value) => {

    if (is_empty(value)) {
        if (!is_empty(default_value)) {
            value = default_value;
        } else {
            return '';
        }
    } else if (typeof value === 'string') {
        const new_chars = [];
        const l = value.length;
        for (let i = 0; i < l; i++) {
            // skip no printable ascii and code > 255 unicode
            const code = value.charCodeAt(i);
            if (code < 20 || code > 126) {
                continue; 
            }
            new_chars.push(value.charAt(i));
        }
        while (new_chars.length > 0 && extra_chars.includes(new_chars[0])) {
            new_chars.shift();
        }
        while (new_chars.length > 0 && extra_chars.includes(new_chars[new_chars.length -1])) {
            new_chars.pop();
        }
        value = new_chars.join('').replace(/\s+/g, ' ');
        if (type === 'number') {
            value = value.replace(/,/g, '');
        }
        if (value.length === 0) {
            if (!is_empty(default_value)) {
                value = default_value;
            } else {
                return '';
            }
        }
    }
    if ((type === 'number' || !type) && !isNaN(value)) {
        value = Number(value);
    }    
    return value;
};