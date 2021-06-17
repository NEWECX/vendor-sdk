'use strict';

const assets_config = require('./cfg/assets-config');
const std_fields = require('./cfg/std-fields');

const {set_configuration, set_account, has_api_config, has_ftp_config,
    set_data_directory, get_data_directory, set_project_directory, get_project_directory} 
    = require('./configuration');

const api_client = require('./api-client');
const { login, logout, close } = require('@ritani/ftp-client');
const ftp_client = require('./ftp-client');
const validate = require('./validate');
const write_to_csv = require('./util/write-to-csv');
const read_from_csv = require('./util/read-from-csv');
const mk_template = require('./mk-template');
const mk_fields_map = require('./util/mk-fields-map');
const downloads = require('./downloads');
const write_simple_js = require('./util/write-simple-js');
const get_latest_csv_file = require('./util/get-latest-csv-file');

module.exports = {

    ...assets_config,
    ...api_client,
    ...ftp_client,

    std_fields,

    ...validate,
    ...downloads,

    get_latest_csv_file,
    
    ftp_login: login,
    ftp_logout: logout, 
    ftp_close: close,
    mk_template,
    mk_fields_map,
    write_to_csv,
    read_from_csv,
    set_configuration,
    has_api_config,
    has_ftp_config,
    set_account,
    set_project_directory,
    get_project_directory,
    get_data_directory,
    set_data_directory,
    write_simple_js,
};