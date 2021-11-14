'use strict';

const fs = require('fs');
const node_path = require('path');

module.exports = async (data_dir, filenames, lab, cert) => {
    const diamond_path = node_path.join(data_dir, 'assets', lab + '-' + cert);
    let has_it = false;
    for (const filename of filenames) {
        const local_filepath = node_path.join(diamond_path, filename);
        if (fs.existsSync(local_filepath)) {
            has_it = true;
            break;
        }
    }
    return has_it;
};