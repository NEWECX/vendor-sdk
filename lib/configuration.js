'use strict';

require('dotenv').config();

module.exports = {
    set_account,
    get_ftp_config,
    get_api_base_url,
    get_api_key,
    set_data_dir,
    get_data_dir,
    get_from_env
};

let config = null;

/**
 *  structure of config:
 *  {
 *      ftp_secure: true,
 *      ftp_host: 'diamondftp.ritani.com',
 *      ftp_user: ...,
 *      api_base_url: 'https://api.newecx.com',
 *      api_key: ...
 *      data_dir: null,
 * }
*/ 

// set it manually 
//
function set_account(input) {
    config = input;
}

function get_ftp_config() {
    if (!config) {
        get_from_env();
    }
    if (config && config.ftp_host && config.ftp_user && config.ftp_password) {
        const ftp_config = {host: config.ftp_host, user: config.ftp_user, password: config.ftp_password};
        if (config.hasOwnProperty('ftp_secure')) {
            ftp_config.secure = config.ftp_secure;
        } else {
            ftp_config.secure = true;
        }
        return ftp_config;
    }
    throw new Error('failed to get ftp_config');
}

function get_api_base_url() {
    if (!config) {
        get_from_env();
    }
    if (config && config.api_base_url) {
        return config.api_base_url;
    }
    throw new Error('failed to get api_base_url')
}

function get_api_key() {
    if (!config) {
        get_from_env();
    }
    if (config && config.api_key) {
        return config.api_key;
    }
    throw new Error('failed to get api_key')
}

function get_data_dir() {
    if (!config) {
        get_from_env();
    }
    return config.data_dir;
}

function set_data_dir(data_dir) {
    if (!config) {
        get_from_env();
    }
    config.data_dir = data_dir
}

function get_from_env() {
    config = { ftp_secure: true };
    if (process.env.FTP_HOST) {
        config.ftp_host = process.env.FTP_HOST;
    }    
    if (process.env.FTP_USER) {
        config.ftp_user = process.env.FTP_USER;
    }
    if (process.env.FTP_PASSWORD) {
        config.ftp_password = process.env.FTP_PASSWORD;
    }
    if (process.env.API_BASE_URL) {
        config.api_base_url = process.env.API_BASE_URL;
    }
    if (process.env.API_KEY) {
        config.api_key = process.env.API_KEY;
    }
    if (process.env.DATA_DIR) {
        config.data_dir = process.env.DATA_DIR
    }
}