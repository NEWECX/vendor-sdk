'use strict';

const fs = require('fs');
const node_path = require('path');

function get_latest_csv_file(data_dir) {
    const result = [null, null]
    const files = fs.readdirSync(data_dir);
    const csv_files = files.filter(x => x.endsWith('.csv'));
    if (csv_files.length === 1) {
        result[0] = csv_files[0];
        result[1] = node_path.join(data_dir, csv_files[0]);
    } else if (csv_files.length > 1) {
        csv_files.sort(function(a, b) {
            const path_a = node_path.join(data_dir, a);
            const path_b = node_path.join(data_dir, b);
            return fs.statSync(path_b).mtime.getTime() - fs.statSync(path_a).mtime.getTime();
        });
        result[0] = csv_files[0];
        result[1] = node_path.join(data_dir, csv_files[0]);
    }
    return result;
}

module.exports = get_latest_csv_file;