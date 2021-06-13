'use strict';

const key_values = require('./cfg/0-key-values');
const certificates = require('./cfg/1-certificates');
const assets_config = require('./cfg/2-assets-config');
const values_maps = require('./cfg/3-values-maps');
const std_fields = require('./cfg/4-std-fields');

const api_client = require('./api-client');
const { login, logout, close } = require('@samwen/ftp-client');
const ftp_client = require('./ftp-client');
const parse_inventory_csv = require('./parse-inventory-csv');
const write_to_csv = require('./util/write-to-csv');
const mk_template = require('./mk-template');

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

    ftp_login: login,
    ftp_logout: logout, 
    ftp_close: close,
    parse_inventory_csv,
    mk_template,
    write_to_csv,
    set_account,
    set_data_dir,
    to_js,
};