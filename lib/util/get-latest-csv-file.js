'use strict';

const fs = require('fs');
const node_path = require('path');

module.exports = (data_dir, no_empty_csv = true) => {
    const result = [null, null]
    const files = fs.readdirSync(data_dir);
    let csv_files = files.filter(x => x.endsWith('.csv'));
    if (no_empty_csv) {
        csv_files = csv_files.filter(x => !x.endsWith('empty.csv'));
    }
    if (csv_files.length === 1) {
        result[0] = csv_files[0];
        result[1] = node_path.join(data_dir, csv_files[0]);
    } else if (csv_files.length > 1) {
        csv_files.sort(function(a, b) {
            const path_a = node_path.join(data_dir, a);
            const path_b = node_path.join(data_dir, b);
            return fs.statSync(path_b).mtimeMs - fs.statSync(path_a).mtimeMs;
        });
        result[0] = csv_files[0];
        result[1] = node_path.join(data_dir, csv_files[0]);
    }
    return result;
};