'use strict';

const assets_config = require('./cfg/assets-config');
const std_fields = require('./cfg/std-fields');
const non_std_mappings = require('./cfg/non-std-mappings');
const configuration = require('./configuration');
const signature_properties = require('./util/signature-properties');
const api_client = require('./api-client');
const validate = require('./validate');
const get_npm_pkg = require('../lib/util/get-npm-pkg');
const check_certificate = require('./util/check-certificate');
const transform_colors = require('./util/transform-colors');
const clean_fields_maps = require('./util/clean-fields-maps');
const write_to_csv = require('./util/write-to-csv');
const read_from_csv = require('./util/read-from-csv');
const mk_template = require('./mk-template');
const get_fields_map = require('./util/get-fields-map');
const mk_fields_map = require('./util/mk-fields-map');
const downloads = require('./downloads');
const get_std_header = require('./util/get-std-header');
const get_checksum = require('./util/get-checksum');
const write_simple_js = require('./util/write-simple-js');
const get_latest_csv_file = require('./util/get-latest-csv-file');

module.exports = {

    std_fields,
    non_std_mappings,

    ...assets_config,
    ...configuration,
    
    get_npm_pkg,
    transform_colors,
    check_certificate,
    clean_fields_maps,

    get_checksum,
    
    signature_properties,

    ...api_client,
    ...validate,
    ...downloads,
    
    mk_template,
    get_fields_map,
    mk_fields_map,
    get_std_header,
    write_to_csv,
    read_from_csv,
    write_simple_js,
    get_latest_csv_file,

    get_cmds
};

let cmds_module;

function get_cmds() {
    if (!cmds_module) {
        cmds_module = require('../lib/cmds');
    }
    return cmds_module;
}