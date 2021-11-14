'use strict';

const fs = require('fs');
const node_path = require('path');
const { Parser } = require('json2csv');

module.exports = (local_filepath, items, fields, save_old = false) => {
    if (fs.existsSync(local_filepath)) {
        if (save_old) {
            const dirname = node_path.dirname(local_filepath);
            const backup_dir = node_path.join(dirname, 'backup');
            if (!fs.existsSync(backup_dir)) {
                fs.mkdirSync(backup_dir, {recursive: true});
            }
            const basename = node_path.basename(local_filepath);
            const ext = node_path.extname(basename);
            const name = basename.substr(0, basename.length - 1 - ext.length);
            const new_basename = name + '-' + new Date().toISOString().replace(/-|T|:|\.|Z/g, '') + '.' + ext;
            const new_filepath = node_path.join(backup_dir, new_basename);
            fs.renameSync(local_filepath, new_filepath);
        } else {
            fs.unlinkSync(local_filepath);
        }
    }
    const parser = new Parser({fields});
    const csv = parser.parse(items);
    fs.writeFileSync(local_filepath, csv);
};