#!/usr/bin/env node

'use strict';

require('colors');
const program = require('commander');
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
const find_pkg = require('./find-pkg');

module.exports = {

    get_program,
    run_program,

};

function get_program(dir = __dirname, has_options) {

    const pkg = find_pkg(dir);
    
    if (!has_options) {
        program.option('-set --set-config', 'to set project and data directories, ftp and api credentials')
            .option('-sd --set-data-dir <data_directory>', 'to set data directory')
            .option('-sp --set-project-dir <project_directory>', 'to set project directory');
    }
    program.version(pkg.version, '-v, --version', 'output the current version')
        .option('-gt --generate-template', 'to generate template, instruction and sample data')
        .option('-di --download-inventory', 'to download latest inventory feed data from server')
        .option('-dh --download-header', 'to download agreed header from server')
        .option('-df --download-fields-maps', 'to download fields-maps from server')
        .option('-da --download-all', 'to download inventory, header and fields-maps from server')
        .option('-uh --upload-header', 'to upload agreed header to server')
        .option('-uf --upload-fields-maps', 'to upload fields-maps to server')
        .option('-fuh --force-upload-header', 'to force upload agreed header to server')
        .option('-fuf --force-upload-fields-maps', 'to force upload fields-maps to server')
        .option('-mh --make-header', 'to make agreed-header.js from inventory data')
        .option('-mf --make-fields-maps', 'to make fields-maps.js from inventory data')
        .option('-vi --validate-inventory', 'to validate inventory csv')
        .option('-ra --retrieve-assets', 'to retrieve assets of passed diamonds')
        .option('-si --submit-inventory', 'to submit original inventory feed to server')
        .option('-ssi --submit-std-inventory', 'to submit the generated standardized inventory csv to server')
        .option('-sa --submit-assets', 'to submit retrieved assets to server')
        .option('-sb --submit-both-inventory-assets', 'to submit both inventory and assets to server')

    program.parse(process.argv);

    return program;
}

async function run_program(program, options) {

    let result = 0, continue_run = true;

    const opts = program.opts();

    if (options && options.setup_extension) {
        try {
            [continue_run, result] = await options.setup_extension(opts);
        } catch(err) {
            console.error('ERROR: call setup_extension', err);
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
                console.error('option not supported'.red, options);
                result = 1;
            }
        } catch(err) {
            console.error(`ERROR: ${err.message}`.red);
            result = 1;
        }
    }

    if (result) {
        program.help();
    }

    return result;
}


