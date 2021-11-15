#!/usr/bin/env node

'use strict';

require('colors');

const program = require('commander');

const { find_pkg } = require('../util');

module.exports = (options, dir = __dirname) => {

    const pkg = find_pkg(dir);
    
    if (!options) {
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

    if (options && options.options_extension) {
        try {
            options.options_extension(program);
        } catch(err) {
            console.error('call options.get_program', err.message.red);
            if (process.env.DEBUG) {
                console.error(err);
            }
        }
    }

    program.parse(process.argv);

    return program;
}