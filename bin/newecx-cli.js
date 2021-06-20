#!/usr/bin/env node

'use strict';

const program = require('commander');
const pkg = require('../package');
const set_config = require('../lib/cmds/set-config');
const set_data_dir = require('../lib/cmds/set-data-dir');
const set_project_dir = require('../lib/cmds/set-project-dir');
const generate_template = require('../lib/cmds/generate-template');
const download_header = require('../lib/cmds/download-header');
const upload_header = require('../lib/cmds/upload-header');
const download_fields_maps = require('../lib/cmds/download-fields-maps');
const upload_fields_maps = require('../lib/cmds/upload-fields-maps');
const make_fields_maps = require('../lib/cmds/make-fields-maps');
const make_header = require('../lib/cmds/make-header');
const validate_inventory = require('../lib/cmds/validate-inventory');
const retrieve_assets = require('../lib/cmds/retrieve-assets');
const submit_inventory = require('../lib/cmds/submit-inventory');
const submit_assets = require('../lib/cmds/submit-assets');
const submit_both = require('../lib/cmds/submit-both');
const check_latest_version = require('../lib/cmds/check-latest-version');

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

program.parse(process.argv);

(async (program) => {
    if (process.argv.length < 3) {
        program.help()
    } else {
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
                await validate_inventory();
            } else if (options.retrieveAssets) {
                await retrieve_assets();
            } else if (options.submitInventory) {
                await submit_inventory();
            } else if (options.submitAssets) {
                await submit_assets();
            } else if (options.retrieveInventoryAssets) {
                await submit_both();
            } else {
                console.error('option not handled', options);
                return 1;
            }
            return 0;
        } catch(err) {
            console.error(err);
            return 1;
        }
    }
})(program);

check_latest_version();