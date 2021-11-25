'use strict';

const assets_config = require('./assets-config');
const color_keys = require('./color-keys');
const std_fields = require('./std-fields');
const sample_diamonds = require('./sample-diamonds');
const useful_fields = require('./useful-fields');

module.exports = {

    ...assets_config,
    
    color_keys,
    std_fields,
    sample_diamonds,
    useful_fields
}