'use strict';

const fs = require('fs');
const node_path = require('path');
const file_type = require('file-type');
const http_client = require('@ritani/http-client');
const { assets_filename_map, assets_stats_types } = require('./cfg/assets-config');
const { get_data_directory, get_project_directory } = require('./configuration');
const write_to_csv = require('./util/write-to-csv');
const local_is_asset_existed = require('./util/is-asset-existed');

module.exports = {
    download_assets,
    retrieval_report,
};

/**
 * download all assets for each diamond
 * @param {*} diamonds 
 * @param {*} is_asset_existed 
 * @returns 
 */
async function download_assets(diamonds, is_asset_existed = local_is_asset_existed) {

    const data_dir = get_data_directory();
    if (!data_dir) {
        throw new Error('data directory not setup yet!');
    }

    const promises = [];
    const diamonds_stats = [];
    const ok_status = {total: 0, successful: 0};
    for (const diamond of diamonds) {

        if (!diamond.certificate_lab || !diamond.certificate_number) {
            console.log('diamond missing certificate_lab and/or certificate_number', diamond);
            continue;
        }

        const sku = diamond.vendor_sku;
        const lab = diamond.certificate_lab;
        const cert = diamond.certificate_number;
        const diamond_path = node_path.join(data_dir, 'assets', lab + '-' + cert);
        if (!fs.existsSync(diamond_path)) {
            fs.mkdirSync(diamond_path, {recursive: true});
        }

        const assets_stats = {};
        diamonds_stats.push({sku, lab, cert, assets_stats});

        for (const field in assets_filename_map) {

            const filenames = assets_filename_map[field];
            const type = assets_stats_types[field];
            if (!assets_stats[type]) {
                assets_stats[type] = {provided: 0, retrieved: 0};
            }

            const stats = assets_stats[type];
            if (await is_asset_existed(filenames, lab, cert, data_dir)) {
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

            promises.push(download_it_from_url(url, filenames, diamond_path, stats, ok_status));
            if (promises.length === 16) {
                await Promise.all(promises);
                if (ok_status.total > 100 && ok_status.successful === 0) {
                    console.log();
                    throw new Error(`0 successful count of total ${ok_status.total} requests!\nPlease manually check the url links in the inventory csv file to ensure they are indeed accessible!`);
                }
                promises.length = 0;
            }
        }
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }
    console.log();

    return diamonds_stats;
}

async function download_it_from_url(url, filenames, diamond_path, stats, ok_status) {
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
    ok_status.total++;
    let local_filepath = node_path.join(diamond_path, local_filename);
    const options = {method: 'get', url, local_filepath, zip: true};
    const response = await http_client(options);
    let ok = false;
    if (response.status === 200) {
        const result = await file_type.fromFile(local_filepath);
        if (result && result.ext && result.ext !== ext) {
            const new_filename = local_filename  + '.' + result.ext;
            const new_local_filepath = node_path.join(diamond_path, new_filename);
            fs.renameSync(local_filepath, new_local_filepath);
            local_filepath = new_local_filepath;
            ok = true;
        } else {
            ok = true;
        }
    }
    if (fs.existsSync(local_filepath)) {
        if (ok) {
            const stat = fs.statSync(local_filepath);
            if (stat.size > 4096) {
                const filename = node_path.basename(local_filepath);
                if (filenames.includes(filename)) {
                    stats.retrieved++;
                    ok_status.successful++;
                    process.stdout.write('+');
                    return true;
                }
            }
        }
        fs.unlinkSync(local_filepath);
    }
    process.stdout.write('x');
    return false;
}

function retrieval_report(diamonds_stats) {

    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }   
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
        if (key === 'orig_3d_360_url') {
            continue;
        }
        const value = assets_stats_types[key];
        for (const prop of ['provided', 'retrieved']) {
            const field = value + ' ' + prop;
            if (!fields.includes(field)) {
                fields.push(field);
            }
        }
    }

    const report_dir = node_path.join(project_dir, 'report');
    if (!fs.existsSync(report_dir)) {
        fs.mkdirSync(report_dir, {recursive: true});
    }
    const report_filepath = node_path.join(report_dir, 'assets-retrieval.csv');
    write_to_csv(report_filepath, report, fields);

    console.log(`assets retrieval report is saved to ${report_filepath}`);
}
