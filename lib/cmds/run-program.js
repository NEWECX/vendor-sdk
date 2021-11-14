'use strict';

require('colors');
const set_config = require('./set-config');
const set_data_dir = require('./set-data-dir');
const set_project_dir = require('./set-project-dir');
const generate_template = require('./generate-template');
const download_inventory = require('./download-inventory');
const download_header = require('./download-header');
const download_all = require('./download-all');
const upload_header = require('./upload-header');
const download_fields_maps = require('./download-fields-maps');
const upload_fields_maps = require('./upload-fields-maps');
const make_fields_maps = require('./make-fields-maps');
const make_header = require('./make-header');
const validate_inventory = require('./validate-inventory');
const retrieve_assets = require('./retrieve-assets');
const submit_inventory = require('./submit-inventory');
const submit_std_inventory = require('./submit-std-inventory');
const submit_assets = require('./submit-assets');
const submit_both = require('./submit-both');

module.exports = async (program, options) => {

    let result = 0, continue_run = true;

    const opts = program.opts();

    if (options && options.run_extension) {
        try {
            [continue_run, result] = await options.run_extension(opts, options);
        } catch(err) {
            console.error('ERROR: call run_extension', err);
        }
    }

    if (continue_run && process.argv.length < 3) {
        continue_run = false;
        result = 1;
    }

    if (continue_run) {
        try {
            if (!options && opts.setConfig) {
                await set_config();
            } else if (!options && opts.setDataDir) {
                set_data_dir(opts.setDataDir);
            } else if (!options && opts.setProjectDir) {
                set_project_dir(opts.setProjectDir);
            } else if (opts.generateTemplate) {
                await generate_template();
            } else if (opts.downloadInventory) {
                await download_inventory();
            } else if (opts.downloadHeader) {
                await download_header();
            } else if (opts.downloadFieldsMaps) {
                await download_fields_maps();
            } else if (opts.downloadAll) {
                await download_all();
            } else if (opts.uploadHeader) {
                await upload_header();
            } else if (opts.uploadFieldsMaps) {
                await upload_fields_maps();
            } else if (opts.forceUploadHeader) {
                await upload_header(true);
            } else if (opts.forceUploadFieldsMaps) {
                await upload_fields_maps(true);
            } else if (opts.makeHeader) {
                await make_header(options);
            }  else if (opts.makeFieldsMaps) {
                await make_fields_maps(options);
            } else if (opts.validateInventory) {
                await validate_inventory(options);
            } else if (opts.retrieveAssets) {
                await retrieve_assets(options);
            } else if (opts.submitInventory) {
                await submit_inventory();
            } else if (opts.submitStdInventory) {
                await submit_std_inventory();
            } else if (opts.submitAssets) {
                await submit_assets();
            } else if (opts.submitBothInventoryAssets) {
                await submit_both();
            } else {
                console.error('option not supported'.red);
                result = 1;
            }
        } catch(err) {
            console.error(`ERROR: ${err.message}`.red);
            //console.error(err);
            result = 1;
        }
    }

    if (result) {
        console.log('');
        program.help();
    }

    return result;
}


