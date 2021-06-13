'use strict';

const json_beautifier = require('csvjson-json_beautifier');

function to_js(object) {
    return json_beautifier(object, {
        dropQuotesOnKeys: true, dropQuotesOnNumbers: true, 
        inlineShortArrays: 1, quoteType: 'single', space: 2, minify: false
    });
}

module.exports = to_js;