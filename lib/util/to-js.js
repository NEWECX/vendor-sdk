'use strict';

const json_beautifier = require('csvjson-json_beautifier');
const sanitize_check = require('./sanitize-check');

function to_js(object) {
    let has_function = false;
    if (Array.isArray(object)) {
        for (const item of object) {
            has_function = convert_function(item);
        }
    } else {
        has_function = convert_function(object);
    }
    const result = json_beautifier(object, {
        dropQuotesOnKeys: true, dropQuotesOnNumbers: true, 
        inlineShortArrays: 1, quoteType: 'single', space: 2, minify: false
    });
    if (!has_function) {
        return result;
    } else {
        return result.replace(/'<<</g, '').replace(/>>>'/g, '');
    }
}

function convert_function(object) {
    let has_function = false;
    for (const key in object) {
        const value = object[key];
        if (typeof value === 'string' && value.startsWith('(key, field, value, row) =>')) {
            has_function = true;
            sanitize_check(value);
            object[key] = '<<<' + value + '>>>';
        } else if (typeof value === 'function') {
            has_function = true;
            const fvalue = value.toString();
            sanitize_check(fvalue);
            object[key] = '<<<' + fvalue + '>>>';
        }
    }
    return has_function;
}

module.exports = to_js;