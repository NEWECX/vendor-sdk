'use strict';

const check_latest_version = require('./check-latest-version');
const download_fields_maps = require('./download-fields-maps');
const download_header = require('./download-header');
const generate_template = require('./generate-template');
const get_inventory_filepath = require('./get-inventory-filepath');
const get_std_inventory_filepath = require('./get-std-inventory-filepath');
const make_fields_maps = require('./make-fields-maps');
const make_header = require('./make-header');
const parse_inventory = require('./parse-inventory');
const retrieve_assets = require('./retrieve-assets');
const set_project_dir = require('./set-project-dir');
const set_data_dir = require('./set-data-dir');
const submit_assets = require('./submit-assets');
const submit_both = require('./submit-both');
const submit_inventory = require('./submit-inventory');
const submit_std_inventory = require('./submit-std-inventory');
const upload_fields_map = require('./upload-fields-maps');
const upload_header = require('./upload-header');
const validate_inventory = require('./validate-inventory');
const { get_program, run_program } = require('./main');

module.exports = {
    get_program, 
    run_program,
    check_latest_version,
    download_fields_maps,
    download_header,
    generate_template,
    get_inventory_filepath,
    get_std_inventory_filepath,
    make_fields_maps,
    make_header,
    parse_inventory,
    retrieve_assets,
    set_project_dir,
    set_data_dir,
    submit_assets,
    submit_both,
    submit_inventory,
    submit_std_inventory,
    upload_fields_map,
    upload_header,
    validate_inventory,
};