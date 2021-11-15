'use strict';

const fs = require('fs');
const node_path = require('path');

const { assets_stats_types } = require('../cfg');

const write_to_csv = require('./write-to-csv');
const { get_project_directory } = require('./configuration');

module.exports = (diamonds_stats) => {

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
};
