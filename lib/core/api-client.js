'use strict';

const os = require('os');
const fs = require('fs');
const node_path = require('path');
const requireFromString = require('require-from-string');

const http_client = require('@ritani/http-client');
const { certificate_lab_values } = require('@ritani/diamond-glossary');
const { to_json_object, to_simple_js } = require('@ritani/to-simple-js');
const get_check_sum = require('@ritani/get-check-sum');

const { filename_values } = require('../cfg');

const clean_fields_maps = require('../util/clean-fields-maps');
const {get_api_base_url, get_api_key, get_data_directory} = require('../util/configuration');
const get_latest_csv_file = require('../util/get-latest-csv-file');
const check_certificate = require('../util/check-certificate');

module.exports = {
    api_upload_inventory,
    api_upload_asset,
    api_upload_assets,
    api_upload_all_files,
    api_get_inventory_info,
    api_get_inventory,
    api_get_header,
    api_get_fields_maps,
    api_update_header,
    api_update_fields_maps,
    api_get_asset_info,
    api_get_report,
};

/**
 * 
 * @param {*} local_filepath path to inventory csv file or empty to use default
 * @param {*} api_key account api_key or empty to use default
 * @returns api call response data
 */
async function api_upload_inventory(local_filepath, api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('api_upload_inventory, empty api_key');
    }

    if (!local_filepath && get_data_directory()) {
        const data_dir = get_data_directory();
        if (fs.existsSync(data_dir)) {
            const result = get_latest_csv_file(data_dir);
            local_filepath = result[1];
        }
    }
    if (!local_filepath) {
        throw new Error('api_upload_inventory, empty local_filepath');
    }
    if (!fs.existsSync(local_filepath)) {
        throw new Error('api_upload_inventory, local_filepath not found: ' + local_filepath);
    }

    const api_base_url = get_api_base_url();
    const params = new URLSearchParams({api_key});
    const signed_url_response = await http_client({
        method: 'get',
        url: `${api_base_url}/api/v1/dmp/inventory-put/pre-signed-url?${params.toString()}`,
    });
    if (!signed_url_response || !signed_url_response.data || !signed_url_response.data.url) {
        throw new Error('api_upload_inventory, failed to get pre-signed-url for inventory-put');
    }
    const result = await http_client({
        method: 'put',
        url: signed_url_response.data.url,
        local_filepath,
        headers: {'Content-Type': 'application/octet-stream'},
        zip: true
    });
    if (result && result.status === 200) {
        return {status: 'OK', local_filepath};
    } else {
        return {status: 'failed'};
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
 async function api_upload_asset(local_filepath, certificate_lab, certificate_number, api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('api_upload_asset, empty api_key');
    }
    if (!local_filepath) {
        throw new Error('api_upload_asset, empty local_filepath');
    }
    if (!fs.existsSync(local_filepath)) {
        throw new Error('api_upload_asset, local_filepath not found');
    }

    const filename = node_path.basename(local_filepath);
    if (!filename_values.includes(filename)) {
        throw new Error('filename not one of ' + filename_values.join(', '));
    }
    if (!certificate_lab && !certificate_number) {
        const diamond_dirname = node_path.basename(node_path.dirname(local_filepath));
        [ certificate_lab, certificate_number ] = diamond_dirname.split('-');
    }
    const check_result = check_certificate(certificate_lab, certificate_number);
    const lab = check_result.certificate_lab;
    const cert = check_result.certificate_number;
    const api_base_url = get_api_base_url();
    const query = {api_key, filename, lab, cert};
    const params = new URLSearchParams(query);
    const signed_url_response = await http_client({
        method: 'get',
        url: `${api_base_url}/api/v1/dmp/assets-put/pre-signed-url?${params.toString()}`,
    });
    if (!signed_url_response || !signed_url_response.data || !signed_url_response.data.url) {
        throw new Error(' api_upload_asset, failed to get pre-signed-url for assets-put');
    }
    const result = await http_client({
        method: 'put',
        url: signed_url_response.data.url,
        local_filepath,
        headers: {'Content-Type': 'application/octet-stream'},
        zip: true
    });
    if (result && result.status === 200) {
        return {status: 'OK', local_filepath};
    } else {
        return {status: 'failed'};
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
 async function api_upload_assets(assets_path, certificate_lab, certificate_number, api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('api_upload_asset, empty api_key');
    }
    if (!assets_path && get_data_directory()) {
        const data_dir = get_data_directory();
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

    const promises = [];

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

            promises.push(upload_file(diamond_path, file, lab, cert, api_key, results));
            if (promises.length === 16) {
                await Promise.all(promises);
                promises.length = 0;
            }
        }
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }

    return results;
}

async function upload_file(diamond_path, file, lab, cert, api_key, results) {
    const local_filepath = node_path.join(diamond_path, file);
    const result = await api_upload_asset(local_filepath, lab, cert, api_key);
    results.push({certificate_lab: lab, certificate_number: cert, file, ...result});
}

/**
 * 
 * @param {*} data_dir 
 * @param {*} api_key 
 * @returns 
 */
 async function api_upload_all_files(data_dir, api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('api_upload_all_files, empty api_key');
    }
    if (!data_dir && get_data_directory()) {
        data_dir = get_data_directory();
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
async function api_get_inventory_info(ok_only = false, api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('get_inventory_info, empty api_key');
    }

    const target = 'inventory';
    const action = 'upload';
    const api_base_url = get_api_base_url();
    const query = {api_key};
    if (ok_only) {
        query.ok_only = 1;
    }
    const params = new URLSearchParams(query);
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
 * @param {*} reports_folder where to save reports.zip
 * @param {*} api_key account api_key
 * @returns report
 */
async function api_get_report(reports_folder = os.tmpdir(), api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('get_report, empty api_key');
    }

    const target = 'inventory';
    const action = 'report';
    const api_base_url = get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;
    const local_filepath = node_path.join(reports_folder, 'reports.zip')
    const options = {method: 'get', url, local_filepath};
    const result = await http_client(options);
    if (result && result.status === 200) {
        return {status: 'OK', local_filepath};
    } else {
        if (fs.existsSync(local_filepath)) {
            fs.rmSync(local_filepath);
        }
        return {status: 'failed'};
    }
}

/**
 * 
 * @param {*} api_key account api_key
 * @returns api call response data
 */
 async function api_get_header(api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('empty api_key(5)');
    }

    const target = 'inventory';
    const action = 'header';
    const api_base_url = get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'get', url, zip: true};
    const result = await http_client(options);
    if (result && result.data) {
        if (Array.isArray(result.data)) {
            return result.data;
        } else {
            console.log(result.data);
            return null;
        }
    } else {
        return null;
    }
}


/**
 * 
 * @param {*} header array of header fields of inventory.csv
 * @param {*} force force upload even if the account is out of sandbox
 * @param {*} api_key account api_key
 * @returns api call response data
 */
async function api_update_header(header, force = false, api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('update_header, empty api_key');
    }
    if (!header || !Array.isArray(header) || header.length === 0) {
        throw new Error('update_header, header is an empty array');
    }

    const target = 'inventory';
    const action = 'header';
    const api_base_url = get_api_base_url();
    const query = { api_key };
    if (force) {
        query.force = true;
    }
    const params = new URLSearchParams(query);
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'post', url, data: header, headers: {'content-type': 'application/json'}, zip: true};
    const result = await http_client(options);
    if (result && result.data) {
        return result.data;
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} fields_maps fields_maps 
 * @param {*} force force upload even if the account is out of sandbox
 * @param {*} api_key account api_key
 * @returns api call response data
 */
async function api_update_fields_maps(fields_maps, force = false, api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('update_fields_map, empty api_key');
    }
    if (!fields_maps || !Array.isArray(fields_maps)) {
        throw new Error('update_fields_maps, fields_maps must not empty and must be an array');
    }
    if (fields_maps.length === 0) {
        throw new Error('update_fields_maps, fields_maps must not empty');
    }

    const simple_fields_maps = clean_fields_maps(fields_maps);
    if (simple_fields_maps.find(x => x.transform)) {
        fields_maps = to_json_object(simple_fields_maps);
    } else {
        fields_maps = simple_fields_maps;
    }
    const target = 'inventory';
    const action = 'fields_map';
    const api_base_url = get_api_base_url();
    const query = { api_key };
    if (force) {
        query.force = true;
    }
    const params = new URLSearchParams(query);
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'post', url, data: fields_maps, headers: {'content-type': 'application/json'}, zip: true};
    const result = await http_client(options);
    //console.log(result);
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
 async function api_get_fields_maps(api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('get_fields_map, empty api_key');
    }
    const target = 'inventory';
    const action = 'fields_map';
    const api_base_url = get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'get', url, zip: true};
    const result = await http_client(options);
    if (result && result.data) {
        if (Array.isArray(result.data)) {
            if (result.data.find(x => x.transform)) {
                const js_text = to_simple_js('fields-maps', result.data);
                const module_name = 'fields-maps-' + get_check_sum(api_key);
                return requireFromString(js_text, module_name);
            } else {
                return result.data;
            }
        } else {
            console.log(result.data);
            return null;
        }
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
async function api_get_asset_info(local_filepath, certificate_lab, certificate_number, api_key = get_api_key()) {

    if (!api_key) {
        throw new Error('get_asset_info, empty api_key');
    }
    if (!local_filepath) {
        throw new Error('get_asset_info, empty local_filepath');
    }
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
    const api_base_url = get_api_base_url();
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;
    
    const options = {method: 'get', url, zip: true};
    const result = await http_client(options);
    if (result && result.data) {
        return result.data;
    } else {
        return null;
    }
}

/**
 * get latest inventory feed csv from server
 *  
 * @param {*} local_filepath absolute file path points to the inventory.csv where data is saved to
 * @param {*} api_key account api_key
 * @returns true if succeeded, null if failed
 */
async function api_get_inventory(local_filepath, api_key = get_api_key()) {
    if (!api_key) {
        throw new Error('get_inventory, empty api_key');
    }
    if (!local_filepath) {
        throw new Error('get_inventory, empty local_filepath');
    }
    const dirname = node_path.dirname(local_filepath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, {recursive: true})
    }

    const target = 'inventory';
    const action = 'feed';
    const api_base_url = get_api_base_url();
    const params = new URLSearchParams({api_key});
    const url = `${api_base_url}/api/v1/dmp/${target}/${action}?${params.toString()}`;

    const options = {method: 'get', url, local_filepath};
    const result = await http_client(options);
    if (result && result.status === 200) {
        return {status: 'OK', local_filepath};
    } else {
        if (fs.existsSync(local_filepath)) {
            fs.rmSync(local_filepath);
        }
        return {status: 'failed'};
    }
}