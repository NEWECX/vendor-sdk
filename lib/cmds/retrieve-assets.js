'use strict';

const fs = require('fs');
const node_path = require('path');
const { assets_stats_types, download_assets, get_data_directory, get_project_directory, read_from_csv, write_to_csv} = require('../');

async function retrieve_assets() {

    const project_dir = get_project_directory();
    if (!project_dir) {
        console.error('project directory not setup yet!');
        process.exit(1);
    }
    const data_dir = get_data_directory();
    if (!data_dir) {
        console.error('data directory not setup yet!');
        process.exit(1);
    }

    const report_dir = node_path.join(project_dir, 'report');
    const local_filepath = node_path.join(report_dir, 'diamonds-passed.csv');
    if (!fs.existsSync(local_filepath)) {
        console.error(`please run newecx --validate-inventory first, ${local_filepath} not found`);
        return;
    }

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

        const report_filepath = node_path.join(report_dir, 'assets-report.csv');
        write_to_csv(report_filepath, report, fields);

        console.log(`assets retrieve report is saved to ${report_dir}`);

    } else {

        console.error(`no diamonds found in ${local_filepath}`);
    }
}

module.exports = retrieve_assets;