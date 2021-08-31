#!/usr/bin/env node

'use strict';

const program = require('commander');
const set_config = require('./set-config');
const set_data_dir = require('./set-data-dir');
const set_project_dir = require('./set-project-dir');
const generate_template = require('./generate-template');
const download_header = require('./download-header');
const upload_header = require('./upload-header');
const download_fields_maps = require('./download-fields-maps');
const upload_fields_maps = require('./upload-fields-maps');
const make_fields_maps = require('./make-fields-maps');
const make_header = require('./make-header');
const validate_inventory = require('./validate-inventory');
const retrieve_assets = require('./retrieve-assets');
const submit_inventory = require('./submit-inventory');
const submit_assets = require('./submit-assets');
const submit_both = require('./submit-both');
const find_pkg = require('./find-pkg');

module.exports = {

    get_program,
    run_program,

};

function get_program(dir = __dirname) {

    const pkg = find_pkg(dir);
    
    program
        .version(pkg.version, '-v, --version', 'output the current version')
        .option('-set --set-config', 'to set project and data directories, ftp and api credentials')
        .option('-sd --set-data-dir <data_directory>', 'to set data directory')
        .option('-sp --set-project-dir <project_directory>', 'to set project directory')
        .option('-gt --generate-template', 'to generate template, instruction and sample data')
        .option('-dh --download-header', 'to download agreed header from server')
        .option('-df --download-fields-maps', 'to download fields-maps from server')
        .option('-uh --upload-header', 'to upload agreed header to server')
        .option('-uf --upload-fields-maps', 'to upload fields-maps to server')
        .option('-mh --make-header', 'to make agreed-header.js from inventory data')
        .option('-mf --make-fields-maps', 'to make fields-maps.js from inventory data')
        .option('-vi --validate-inventory', 'to validate inventory csv')
        .option('-ra --retrieve-assets', 'to retrieve assets of passed diamonds')
        .option('-si --submit-inventory', 'to submit inventory feed to server')
        .option('-sa --submit-assets', 'to submit retrieved assets to server')
        .option('-sb --submit-both-inventory-assets', 'to submit both inventory and assets to server')

    if (process.argv.length < 3) {
        program.help();
    } else {
        program.parse(process.argv);
        return program;
    }
}

async function run_program(program, ex_options) {

    let result = 0;

    try {
        const options = program.opts();
        if (options.setConfig) {
            await set_config();
        } else if (options.setDataDir) {
            set_data_dir(options.setDataDir);
        } else if (options.setProjectDir) {
            set_project_dir(options.setProjectDir);
        } else if (options.generateTemplate) {
            await generate_template();
        } else if (options.downloadHeader) {
            await download_header();
        } else if (options.downloadFieldsMaps) {
            await download_fields_maps();
        } else if (options.uploadHeader) {
            await upload_header();
        } else if (options.uploadFieldsMaps) {
            await upload_fields_maps();
        } else if (options.makeHeader) {
            await make_header();
        }  else if (options.makeFieldsMaps) {
            await make_fields_maps();
        } else if (options.validateInventory) {
            await validate_inventory(ex_options);
        } else if (options.retrieveAssets) {
            await retrieve_assets();
        } else if (options.submitInventory) {
            await submit_inventory();
        } else if (options.submitAssets) {
            await submit_assets();
        } else if (options.submitBothInventoryAssets) {
            await submit_both();
        } else {
            console.error('option not handled', options);
            result = 1;
        }

    } catch(err) {
        console.error(err);
        result = 1;
    }

    if (result) {
        program.help();
    }

    return result;
}


