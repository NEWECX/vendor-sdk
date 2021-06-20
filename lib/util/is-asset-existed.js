'use strict';

const fs = require('fs');
const node_path = require('path');

function is_asset_existed(filenames, lab, cert, data_dir) {
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
}

module.exports = is_asset_existed;