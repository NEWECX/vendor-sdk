'use strict';

function call_function(values_map, key, field, value, row) {
    return values_map(key, field, value, row);
}

module.exports = call_function;