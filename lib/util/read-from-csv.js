'use strict';

const fs = require('fs');
const csv = require('csvtojson')
const get_check_sum = require('@ritani/get-check-sum');

const get_value = require('./get-value');

const sample_rows = 67;

module.exports = async (local_filepath, header_stats) => {

    if (!fs.existsSync(local_filepath)) {
        throw new Error(`file not found, ${local_filepath}`);
    }

    if (header_stats) {
        if (!header_stats.samples) {
            header_stats.samples = {}
        }
        if (!header_stats.fields) {
            header_stats.fields = {};
        }
    }

    const convertor = csv({trim: true});

    convertor.on('header', (header) => {
        if (header_stats) {
            for (const field of header) {
                header_stats.fields[field] = {distinct_values: [], empty_count: 0, value_count: 0}
            }
        }
    });

    convertor.subscribe((row, index) => {
        if (header_stats === false && index > 0) {      // sample 1 row only
            return;
        }
        for (const field in row) {
            row[field] = get_value(row[field]);
        }
        if (!header_stats) {
            return;
        }
        for (const field in row) {
            const samples = header_stats.samples;
            const field_stats = header_stats.fields[field];
            if (!field_stats) {
                if (index < row.length - 1) {
                    console.error(`row ${index+1}: see invalid csv format, with extra field (${field.replace('field', 'column ')})`);
                }
                continue;
            }
            const value = row[field];
            if (value === '') {
                field_stats.empty_count++;
            } else if (field_stats.distinct_values.length < sample_rows) {
                const item = field_stats.distinct_values.find(x => x.value === value);
                if (!item) {
                    const check_sum = get_check_sum(row);
                    if (!samples[check_sum]) {
                        samples[check_sum] = row;   
                    }
                    field_stats.distinct_values.push({value, check_sum});
                }
                field_stats.value_count++;
            }
        }
    });

    return convertor.fromFile(local_filepath);
};