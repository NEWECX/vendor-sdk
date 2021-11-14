'use strict';

const fs = require('fs');
const node_path = require('path');
const { to_simple_js } = require('@ritani/to-simple-js');

module.exports = (dir_path, name, data, save_old = false) => {

    const filepath = node_path.join(dir_path, name + '.js');
    if (fs.existsSync(filepath)) {
        if (save_old) {
            const backup_dir = node_path.join(dir_path, 'backup');
            if (!fs.existsSync(backup_dir)) {
                fs.mkdirSync(backup_dir, {recursive: true});
            }
            const new_filename = name + '-' + new Date().toISOString().replace(/-|T|:|\.|Z/g, '') + '.js';
            const new_filepath = node_path.join(backup_dir, new_filename);
            fs.renameSync(filepath, new_filepath);
        } else {
            fs.unlinkSync(filepath);
        }
    }
    
    const content = typeof data === 'string' ? data : to_simple_js(name, data);
    fs.writeFileSync(filepath, content);
    return filepath;
};