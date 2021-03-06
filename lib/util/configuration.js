'use strict';

const os = require('os');
const fs = require('fs');
const node_path = require('path')
const { to_javascript } = require('@ritani/to-simple-js');
require('dotenv').config();

module.exports = {
    set_account,
    has_api_config,
    get_api_base_url,
    get_api_key,
    get_project_directory,
    set_project_directory,
    set_data_directory,
    get_data_directory,
    set_configuration,
    load_configuration
};

let config = null;
let from = null;

/**
 *  structure of config:
 *  {
 *      api_base_url: 'https://api.newecx.com',
 *      api_key: ...
 *      data_dir: ...
 *      project_dir: ...
 * }
 * 
 * .env
 * 
 *   API_BASE_URL=https://api.newecx.com
 *   API_KEY=...
 *   DATA_DIR=...
 *   PROJECT_DIR=...
 * 
 */ 

// set it manually 
//
function set_account(input) {
    from = 'set_account';
    config = input;
}

function has_api_config() {
    if (!config) {
        load_configuration();
    }
    if (config && config.api_base_url && config.api_key) {
        return true;
    }
}

function get_api_base_url() {
    if (!config) {
        load_configuration();
    }
    if (config && config.api_base_url) {
        return config.api_base_url;
    }
    throw new Error('failed to get api_base_url')
}

function get_api_key() {
    if (!config) {
        load_configuration();
    }
    if (config && config.api_key) {
        return config.api_key;
    }
    throw new Error('failed to get api_key')
}

function get_project_directory() {
    if (!config) {
        load_configuration();
    }
    return config.project_dir;
}

function set_project_directory(project_dir, save = false) {
    if (!config) {
        load_configuration();
    }
    config.project_dir = project_dir
    if (!fs.existsSync(config.project_dir)) {
        fs.mkdirSync(config.project_dir, {recursive: true})
    }
    if (save && from === '.newecx') {
        write_config_file();
    }
}

function get_data_directory() {
    if (!config) {
        load_configuration();
    }
    return config.data_dir;
}

function set_data_directory(data_dir, save = false) {
    if (!config) {
        load_configuration();
    }
    config.data_dir = data_dir
    if (!fs.existsSync(config.data_dir)) {
        fs.mkdirSync(config.data_dir, {recursive: true})
    }
    if (save && from === '.newecx') {
        write_config_file();
    }
}

function set_configuration(cfg, save = false) {
    config = {...cfg};
    if (!config.api_base_url) {
        config.api_base_url = 'https://api.newecx.com';
    }
    if (!config.project_dir) {
        config.project_dir = process.cwd();
    }
    if (!config.data_dir) {
        config.data_dir = node_path.join(process.cwd(), 'data');
    }
    if (!fs.existsSync(config.data_dir)) {
        fs.mkdirSync(config.data_dir, {recursive: true});
    }
    if (save) {
        from = '.newecx';
        write_config_file();
    }
}

function write_config_file() {
    if (!config) {
        return;
    }
    const homedir = os.homedir();
    const config_filepath = node_path.join(homedir, '.newecx');
    fs.writeFileSync(config_filepath, 'module.exports = ' + to_javascript(config) + ';');
}

function load_configuration() {
    if ((process.env.FTP_USER && process.env.FTP_PASSWORD) || process.env.API_KEY) {
        from = '.env';
        config = { ftp_secure: true };
        config.ftp_user = process.env.FTP_USER;
        config.ftp_password = process.env.FTP_PASSWORD;
        config.api_key = process.env.API_KEY;
        if (process.env.FTP_HOST) {
            config.ftp_host = process.env.FTP_HOST;
        } else {
            config.ftp_host = 'ftp.ritani.com';
        } 
        if (process.env.API_BASE_URL) {
            config.api_base_url = process.env.API_BASE_URL;
        } else {
            config.api_base_url = 'https://api.newecx.com';
        }
        if (process.env.PROJECT_DIR) {
            config.project_dir = process.env.PROJECT_DIR
        } else {
            config.project_dir = process.cwd();
        }
        if (process.env.DATA_DIR) {
            config.data_dir = process.env.DATA_DIR
        } else {
            config.data_dir = node_path.join(process.cwd(), 'data');
        }
        if (!fs.existsSync(config.data_dir)) {
            fs.mkdirSync(config.data_dir, {recursive: true});
        }    
    } else {
        const homedir = os.homedir();
        const config_filepath = node_path.join(homedir, '.newecx');    
        if (fs.existsSync(config_filepath)) {
            from = '.newecx';
            config = require(config_filepath);
        } else {
            throw new Error('No config found!');
        }
    }
}