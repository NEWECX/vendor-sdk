'use strict';

const fs = require('fs');
const node_path = require('path');
const file_type = require('file-type');
const http_client = require('@samwen/http-client');
const configuration = require('./configuration');
const { assets_filename_map, assets_stats_types } = require('./cfg/2-assets-config');

/**
 * download all assets of a diamond
 * 
 * @param {*} diamond 
 * @returns assets_stats
 */
async function download_assets(diamond) {

    if (!diamond.certificate_lab || !diamond.certificate_number) {
        console.log('diamond missing certificate_lab and/or certificate_number', diamond);
        return null;
    }
    const data_dir = configuration.get_data_dir();
    const lab = diamond.certificate_lab;
    const cert = diamond.certificate_number;
    const diamond_path = node_path.join(data_dir, 'assets', lab + '-' + cert);
    if (!fs.existsSync(diamond_path)) {
        fs.mkdirSync(diamond_path, {recursive: true});
    }
    const assets_stats = {};
    for (const field in assets_filename_map) {
        const filenames = assets_filename_map[field];
        const type = assets_stats_types[field];
        if (!assets_stats[type]) {
            assets_stats[type] = {provided: 0, retrieved: 0};
        }
        const stats = assets_stats[type];
        if (local_has_it(filenames, diamond_path)) {
            stats.provided++;
            stats.retrieved++;
            continue;
        }
        if (!diamond[field]) {
            continue;
        }
        stats.provided++;
        const url = diamond[field];
        if (!url.startsWith('http')) {
            console.log('invalid url', url);
            continue;
        }
        if (await download_it_from_url(url, filenames, diamond_path)) {
            stats.retrieved++;
        }
    }
    return assets_stats;
}

function local_has_it(filenames, diamond_path) {
    let local_has_it = false;
    for (const filename of filenames) {
        const local_filepath = node_path.join(diamond_path, filename);
        if (fs.existsSync(local_filepath)) {
            local_has_it = true;
            break;
        }
    }
    return local_has_it;
}

async function download_it_from_url(url, filenames, diamond_path) {
    let ext = null, local_filename = null;
    for (const filename of filenames) {
        const parts = filename.split('.');
        local_filename = parts[0];
        const file_ext = parts[1];
        if (url.indexOf('.' + file_ext) !== -1) {
            ext = file_ext;
            local_filename += '.' + ext;
            break;
        }
    }
    const local_filepath = node_path.join(diamond_path, local_filename);
    const options = {method: 'get', url, local_filepath};
    const response = await http_client(options);
    if (response.status === 200) {
        const local_filepath = node_path.join(diamond_path, local_filename);
        const result = await file_type.fromFile(local_filepath);
        if (result.ext !== ext) {
            const new_filename = local_filename  + '.' + result.ext;
            const new_local_filepath = node_path.join(diamond_path, new_filename);
            fs.renameSync(local_filepath, new_local_filepath);
            if (filenames.includes(new_filename)) {
                return true;
            }
        } else {
            return true;
        }
    }
    return false;
}

module.exports = download_assets;