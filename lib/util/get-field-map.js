'use strict';

module.exports = (fields_map, key) => {
    const field_map = fields_map.find(x => x.key === key);
    const field = field_map && field_map.field ? field_map.field : key;
    return {field_map, field};
};