'use strict';

const fs = require('fs');
const node_path = require('path');

const { assets_filename_map, assets_stats_types } = require('../cfg');

const local_is_asset_existed = require('../util/is-asset-existed');
const { get_data_directory } = require('../util/configuration');
const download_from_url = require('../util/download-from-url');

/**
 * download all assets for each diamond
 * @param {*} diamonds
 * @param {*} show_detail
 * @param {*} is_asset_existed 
 * @returns 
 */
 module.exports = async (diamonds, show_detail = false, is_asset_existed = local_is_asset_existed) => {

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
            if (await is_asset_existed(data_dir, filenames, lab, cert)) {
                stats.provided++;
                stats.retrieved++;
                continue;
            }
            if (!diamond[field]) {
                continue;
            }
            stats.provided++;
            const url = diamond[field];
            if (!url) {
                continue;
            }
            if (!url.startsWith('http')) {
                console.log('  ERR invalid url'.red, field, url.yellow);
                continue;
            }

            promises.push(download_from_url(url, filenames, diamond_path, stats, ok_status, {field, show_detail}));
            if (promises.length === 16) {
                await Promise.all(promises);
                promises.length = 0;
            }
        }
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }
    console.log();

    return diamonds_stats;
};
