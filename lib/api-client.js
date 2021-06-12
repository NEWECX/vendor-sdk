'use strict';

const fs = require('fs');
const node_path = require('path');
const http_client = require('@samwen/http-client');
const configuration = require('./configuration');
const { certificate_lab_values } = require('./cfg/1-certificates');
const { filename_values } = require('./cfg/2-assets-config');
const get_latest_csv_file = require('./util/get-latest-csv-file');

module.exports = {
    api_upload_inventory,
    api_upload_asset,
    api_upload_assets,
    api_upload_all_files,
    api_get_inventory_info,
    api_get_header,
    api_get_fields_map,
    api_update_header,
    api_update_fields_map,
    api_get_asset_info,
    api_get_report,
};

/**
 * 
 * @param {*} local_filepath path to inventory csv file or empty to use default
 * @param {*} api_key account api_key or empty to use default
 * @returns api call response data
 */
async function api_upload_inventory(local_filepath, api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('api_upload_inventory, empty api_key');
    }
    let file;
    if (!local_filepath && configuration.get_data_dir()) {
        const data_dir = configuration.get_data_dir();
        if (fs.existsSync(data_dir)) {
            [ file, local_filepath ] = get_latest_csv_file(data_dir);
        }
    }
    if (!local_filepath) {
        throw new Error('api_upload_inventory, empty local_filepath');
    }
    if (!fs.existsSync(local_filepath)) {
        throw new Error('api_upload_inventory, local_filepath not found');
    }

    const target = 'inventory';
    const action = 'upload';
    const api_base_url = configuration.get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'post', url, local_filepath, headers: {'content-type': 'text/csv'}};
    const result = await http_client(options);
    if (result && result.data) {
        if (file) {
            return {...result.data, file};
        } else {
            return result.data;
        }
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} local_filepath path to asset file
 * @param {*} certificate_lab for the purpose to associate asset to diamond, if the local_filepath doesn't contain LAB-CERT#
 * @param {*} certificate_number for the purpose to associate asset to diamond, if the local_filepath doesn't contain LAB-CERT#
 * @param {*} api_key account api_key
 * @returns api call response data
 */
 async function api_upload_asset(local_filepath, certificate_lab, certificate_number, api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('api_upload_asset, empty api_key');
    }
    if (!local_filepath) {
        throw new Error('api_upload_asset, empty local_filepath');
    }
    if (!fs.existsSync(local_filepath)) {
        throw new Error('api_upload_asset, local_filepath not found');
    }

    const basename = node_path.basename(local_filepath);
    const dirname = node_path.basename(node_path.dirname(local_filepath))
    const filename = `${dirname}/${basename}`;
    const target = 'assets';
    const action = 'upload';
    const api_base_url = configuration.get_api_base_url();
    const query = {api_key, filename};
    if (certificate_lab) {
        if (!certificate_lab_values.includes(certificate_lab)) {
            throw new Error('api_upload_asset, certificate_lab ${certificate_lab} not supported');
        }
        query.lab = certificate_lab;
    }
    if (certificate_number) {
        query.cert = certificate_number;
    }
    const params = new URLSearchParams(query);
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'post', url, local_filepath, headers: {'content-type': 'text/csv'}};
    const result = await http_client(options);
    if (result && result.data) {
        return result.data;
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} assets_path path assets folder or empty to use default
 * @param {*} certificate_lab if defined, to upload specific diamond defined by certificate_lab and certificate_number
 * @param {*} certificate_number if defined, certificate_lab also need to define
 * @param {*} api_key account api_key
 * @returns api call response data
 */
 async function api_upload_assets(assets_path, certificate_lab, certificate_number, api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('api_upload_asset, empty api_key');
    }
    if (!assets_path && configuration.get_data_dir()) {
        const data_dir = configuration.get_data_dir();
        assets_path = node_path.join(data_dir, 'assets');
    }
    if (!assets_path) {
        throw new Error('api_upload_asset, empty assets_path');
    }
    if (!fs.existsSync(assets_path)) {
        throw new Error('api_upload_asset, assets_path not found, ' + assets_path);
    }
    if (!fs.lstatSync(assets_path).isDirectory()) {
        throw new Error('api_upload_asset, assets_path is not directory, ' + assets_path);
    }

    const results = [];
    const diamond_folders = fs.readdirSync(assets_path);

    for (const diamond_folder of diamond_folders) {

        if (diamond_folder.startsWith('.') || !diamond_folder.includes('-') || diamond_folder.split('-').length !==2) {
            continue;
        }

        const diamond_path = node_path.join(assets_path, diamond_folder);
        if (!fs.lstatSync(diamond_path).isDirectory()) {
            continue;
        }

        const [lab, cert] = diamond_folder.split('-');
        if (!lab || !cert || !certificate_lab_values.includes(lab)) {
            continue;
        }

        if (certificate_lab && certificate_number) {
            if (lab !== certificate_lab || cert !== certificate_number) {
                continue;
            }
        }

        console.log(`uploading ${diamond_folder}...`);

        const files = fs.readdirSync(diamond_path);

        for (const file of files) {

            if (!filename_values.includes(file)) {
                continue;
            }

            const local_filepath = node_path.join(diamond_path, file);
            const result = await api_upload_asset(local_filepath, lab, cert, api_key);
            results.push({certificate_lab: lab, certificate_number: cert, file, ...result});
        }
    }
    return results;
}

/**
 * 
 * @param {*} data_dir 
 * @param {*} api_key 
 * @returns 
 */
 async function api_upload_all_files(data_dir, api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('api_upload_all_files, empty api_key');
    }
    if (!data_dir && configuration.get_data_dir()) {
        data_dir = configuration.get_data_dir();
    }
    if (!data_dir) {
        throw new Error('api_upload_all_files, empty data_dir');
    }
    if (!fs.existsSync(data_dir)) {
        throw new Error('api_upload_all_files, data_dir not found');
    }
    const [file, local_filepath] = get_latest_csv_file(data_dir);
    if (!local_filepath) {
        throw new Error('api_upload_all_files, empty csv local_filepath');
    }
    if (!fs.existsSync(local_filepath)) {
        throw new Error('api_upload_all_files, csv local_filepath not found');
    }

    const inventory = await api_upload_inventory(local_filepath, api_key);
    const assets_path = node_path.join(data_dir, 'assets');
    const assets = await api_upload_assets(assets_path, api_key);
    return {
        inventory: {file, ...inventory},
        assets 
    }
}

/**
 * 
 * @param {*} api_key account api_key
 * @returns api call response data
 */
async function api_get_inventory_info(api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('get_inventory_info, empty api_key');
    }

    const target = 'inventory';
    const action = 'upload';
    const api_base_url = configuration.get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'get', url};
    const result = await http_client(options);
    if (result && result.data) {
        return result.data;
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} api_key account api_key
 * @returns report
 */
async function api_get_report(api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('get_report, empty api_key');
    }

    const target = 'inventory';
    const action = 'report';
    const api_base_url = configuration.get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'get', url};
    const result = await http_client(options);
    if (result && result.data) {
        return result.data;
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} api_key account api_key
 * @returns api call response data
 */
 async function api_get_header(api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('empty api_key(5)');
    }

    const target = 'inventory';
    const action = 'header';
    const api_base_url = configuration.get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'get', url};
    const result = await http_client(options);
    if (result && result.data) {
        return result.data;
    } else {
        return null;
    }
}


/**
 * 
 * @param {*} header array of header fields of inventory.csv
 * @param {*} api_key account api_key
 * @returns api call response data
 */
async function api_update_header(header, api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('update_header, empty api_key');
    }
    if (!header || !Array.isArray(header) || header.length === 0) {
        throw new Error('update_header, header is an empty array');
    }

    const target = 'inventory';
    const action = 'header';
    const api_base_url = configuration.get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'post', url, data: header, headers: {'content-type': 'application/json'}};
    const result = await http_client(options);
    if (result && result.data) {
        return result.data;
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} fields_map fields_map to transform inventory.csv to required format
 * @param {*} api_key account api_key
 * @returns api call response data
 */
async function api_update_fields_map(fields_map, api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('update_fields_map, empty api_key');
    }
    if (!fields_map || Array.isArray(fields_map)) {
        throw new Error('update_fields_map, fields_map must not empty and can not be an array');
    }
    if (Object.keys(fields_map).length === 0) {
        throw new Error('update_fields_map, fields_map must not empty');
    }

    const target = 'inventory';
    const action = 'fields_map';
    const api_base_url = configuration.get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'post', url, data: fields_map, headers: {'content-type': 'application/json'}};
    const result = await http_client(options);
    if (result && result.data) {
        return result.data;
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} api_key account api_key
 * @returns api call response data
 */
 async function api_get_fields_map(api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('get_fields_map, empty api_key');
    }
    const target = 'inventory';
    const action = 'fields_map';
    const api_base_url = configuration.get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'get', url};
    const result = await http_client(options);
    if (result && result.data) {
        return result.data;
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} local_filepath absolute file path points to the asset file 
 * @param {*} certificate_lab for the purpose to associate asset to diamond, if the local_filepath doesn't contain LAB-CERT#
 * @param {*} certificate_number for the purpose to associate asset to diamond, if the local_filepath doesn't contain LAB-CERT#
 * @param {*} api_key account api_key
 * @returns api call response data
 */
async function api_get_asset_info(local_filepath, certificate_lab, certificate_number, api_key = configuration.get_api_key()) {

    if (!api_key) {
        throw new Error('get_asset_info, empty api_key');
    }
    if (!local_filepath) {
        throw new Error('get_asset_info, empty local_filepath');
    }
    // if (!fs.existsSync(local_filepath)) {
    //     throw new Error('get_asset_info, local_filepath not found: ' + local_filepath);
    // }

    const basename = node_path.basename(local_filepath);
    const dirname = node_path.basename(node_path.dirname(local_filepath))
    const filename = `${dirname}/${basename}`;
    const target = 'assets';
    const action = 'upload';
    const query = {api_key, filename};
    if (certificate_lab) {
        if (!certificate_lab_values.includes(certificate_lab)) {
            throw new Error('get_asset_info, certificate_lab ${certificate_lab} not supported');
        }
        query.lab = certificate_lab;
    }
    if (certificate_number) {
        query.cert = certificate_number;
    }
    const params = new URLSearchParams(query);
    const api_base_url = configuration.get_api_base_url();
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;
    
    const options = {method: 'get', url};
    const result = await http_client(options);
    if (result && result.data) {
        return result.data;
    } else {
        return null;
    }
}
