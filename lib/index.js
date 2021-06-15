'use strict';

const key_values = require('./cfg/0-key-values');
const certificates = require('./cfg/1-certificates');
const assets_config = require('./cfg/2-assets-config');
const values_maps = require('./cfg/3-values-maps');
const std_fields = require('./cfg/4-std-fields');

const api_client = require('./api-client');
const { login, logout, close } = require('@samwen/ftp-client');
const ftp_client = require('./ftp-client');
const validate = require('./validate');
const write_to_csv = require('./util/write-to-csv');
const read_from_csv = require('./util/read-from-csv');
const mk_template = require('./mk-template');
const mk_fields_map = require('./util/mk-fields-map');
const downloads = require('./downloads');
const {set_account, set_data_dir} = require('./configuration');
const to_js = require('./util/to-js');

module.exports = {

    ...key_values,
    ...certificates,
    ...assets_config,
    ...api_client,
    ...ftp_client,

    values_maps,
    std_fields,

    ...validate,
    ...downloads,

    ftp_login: login,
    ftp_logout: logout, 
    ftp_close: close,
    mk_template,
    mk_fields_map,
    write_to_csv,
    read_from_csv,
    set_account,
    set_data_dir,
    to_js,
};