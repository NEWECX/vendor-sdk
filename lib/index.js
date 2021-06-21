'use strict';

const assets_config = require('./cfg/assets-config');
const std_fields = require('./cfg/std-fields');

const {set_configuration, has_api_config, has_ftp_config,
    set_data_directory, get_data_directory, get_extra_property,
    set_project_directory, get_project_directory} 
    = require('./configuration');

const api_client = require('./api-client');
const ftp_client = require('./ftp-client');
const validate = require('./validate');
const write_to_csv = require('./util/write-to-csv');
const read_from_csv = require('./util/read-from-csv');
const mk_template = require('./mk-template');
const mk_fields_map = require('./util/mk-fields-map');
const downloads = require('./downloads');
const get_checksum = require('./util/get-checksum');
const write_simple_js = require('./util/write-simple-js');
const get_latest_csv_file = require('./util/get-latest-csv-file');

module.exports = {

    ...assets_config,
    std_fields,

    set_configuration,
    has_api_config,
    has_ftp_config,
    set_project_directory,
    get_project_directory,
    get_data_directory,
    set_data_directory,
    get_extra_property,

    get_checksum,

    ...api_client,
    ...ftp_client,
    ...validate,
    ...downloads,
    
    mk_template,
    mk_fields_map,
    write_to_csv,
    read_from_csv,
    write_simple_js,
    get_latest_csv_file,
};