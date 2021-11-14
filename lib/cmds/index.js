'use strict';

const check_latest_version = require('./check-latest-version');
const download_all = require('./download-all');
const download_fields_maps = require('./download-fields-maps');
const download_header = require('./download-header');
const download_inventory = require('./download-inventory');
const generate_template = require('./generate-template');
const get_inventory_filepath = require('./get-inventory-filepath');
const get_std_inventory_filepath = require('./get-std-inventory-filepath');
const make_fields_maps = require('./make-fields-maps');
const make_header = require('./make-header');
const parse_inventory = require('./parse-inventory');
const retrieve_assets = require('./retrieve-assets');
const set_config = require('./set-config');
const set_data_dir = require('./set-data-dir');
const set_project_dir = require('./set-project-dir');
const submit_assets = require('./submit-assets');
const submit_both = require('./submit-both');
const submit_inventory = require('./submit-inventory');
const submit_std_inventory = require('./submit-std-inventory');
const upload_fields_maps = require('./upload-fields-maps');
const upload_header = require('./upload-header');
const validate_inventory = require('./validate-inventory');
const set_options = require('./set-options');
const run_program = require('./run-program');

module.exports = {
    check_latest_version,
    download_all,
    download_fields_maps,
    download_header,
    download_inventory,
    generate_template,
    get_inventory_filepath,
    get_std_inventory_filepath,
    make_fields_maps,
    make_header,
    parse_inventory,
    retrieve_assets,
    set_config,
    set_data_dir,
    set_project_dir,
    submit_assets,
    submit_both,
    submit_inventory,
    submit_std_inventory,
    upload_fields_maps,
    upload_header,
    validate_inventory,
    set_options,
    run_program
};