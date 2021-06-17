'use strict';

const fs = require('fs');
const node_path = require('path');
const file_type = require('file-type');
const http_client = require('@ritani/http-client');
const configuration = require('./configuration');
const { assets_filename_map, assets_stats_types } = require('./cfg/assets-config');
const { set_data_directory } = require('./configuration');
const write_to_csv = require('./util/write-to-csv');
const read_from_csv = require('./util/read-from-csv');

module.exports = {
    download_assets,
    download_all_assets,
};

/**
 * download all assets of a diamond
 * 
 * @param {*} diamond 
 * @returns assets_stats
 */
async function download_assets(diamonds) {

    const promises = [];
    const diamonds_stats = [];

    for (const diamond of diamonds) {

        if (!diamond.certificate_lab || !diamond.certificate_number) {
            console.log('diamond missing certificate_lab and/or certificate_number', diamond);
            continue;
        }

        const data_dir = configuration.get_data_directory();
        const lab = diamond.certificate_lab;
        const cert = diamond.certificate_number;
        const diamond_path = node_path.join(data_dir, 'assets', lab + '-' + cert);
        if (!fs.existsSync(diamond_path)) {
            fs.mkdirSync(diamond_path, {recursive: true});
        }

        const assets_stats = {};
        diamonds_stats.push({sku: diamond.vendor_sku, lab: diamond.certificate_lab, cert: diamond.certificate_number, assets_stats});

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

            promises.push(download_it_from_url(url, filenames, diamond_path, stats));
            if (promises.length === 16) {
                await Promise.all(promises);
                promises.length = 0;
            }
        }
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }

    return diamonds_stats;
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

async function download_it_from_url(url, filenames, diamond_path, stats) {
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
                stats.retrieved++;
                return true;
            }
        } else {
            return true;
        }
    }
    return false;
}

async function download_all_assets(data_dir) {

    const local_filepath = node_path.join(data_dir, 'diamonds-passed.csv');
    if (!fs.existsSync(local_filepath)) {
        throw new Error(`${local_filepath} not found`);
    }

    set_data_directory(data_dir);

    const diamonds = await read_from_csv(local_filepath);

    if (diamonds && diamonds.length > 0) {

        const diamonds_stats = await download_assets(diamonds);

        //console.log(JSON.stringify(diamonds_stats, null, 2));

        const report = [];
        const total = {no: 'total'};
        let no = 1;
        for (const diamond of diamonds_stats) {
            const { sku, lab, cert, assets_stats } = diamond;
            const row = {no, sku, 'lab-cert#': lab + '-' + cert };
            for (const key in assets_stats) {
                for (const prop of ['provided', 'retrieved']) {
                    const value = assets_stats[key][prop];
                    const field = key + ' ' + prop;
                    row[field] = value;
                    if (!total.hasOwnProperty(field)) {
                        total[field] = 0; 
                    }
                    total[field] += value;
                }
            }
            report.push(row);
            no++;
        }
        report.push(total);

        const fields = ['no', 'sku', 'lab-cert#'];
        for (const key in assets_stats_types) {
            const value = assets_stats_types[key];
            for (const prop of ['provided', 'retrieved']) {
                const field = value + ' ' + prop;
                if (!fields.includes(field)) {
                    fields.push(field);
                }
            }
        }

        const report_filepath = node_path.join(__dirname, 'assets-report.csv');
        write_to_csv(report_filepath, report, fields);

        console.log(`check ${report_filepath} for assets retrieve report\n`);

    } else {
        console.error(`not diamonds found in ${local_filepath}`);
    }
}
