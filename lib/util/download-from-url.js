'use strict';

require('colors');

const fs = require('fs');
const node_path = require('path');
const file_type = require('file-type');
const http_client = require('@ritani/http-client');

module.exports = async (url, filenames, diamond_path, stats, ok_status, opts) => {
    let ext = null, local_filename = null;
    for (const filename of filenames) {
        const parts = filename.split('.');
        local_filename = parts[0];
        const file_ext = parts[1];
        if (url.indexOf('.' + file_ext) !== -1) {
            ext = file_ext;
            local_filename += '.' + ext;
            break;
        }
    }
    ok_status.total++;
    let local_filepath = node_path.join(diamond_path, local_filename);
    const options = {method: 'get', url, local_filepath, zip: true};
    const response = await http_client(options);
    let ok = false;
    if (response.status === 200) {
        const result = await file_type.fromFile(local_filepath);
        if (result && result.ext && result.ext !== ext) {
            const new_filename = local_filename  + '.' + result.ext;
            const new_local_filepath = node_path.join(diamond_path, new_filename);
            fs.renameSync(local_filepath, new_local_filepath);
            local_filepath = new_local_filepath;
            ok = true;
        } else {
            ok = true;
        }
    }
    if (fs.existsSync(local_filepath)) {
        if (ok) {
            const stat = fs.statSync(local_filepath);
            if (stat.size > 4096) {
                const filename = node_path.basename(local_filepath);
                if (filenames.includes(filename)) {
                    stats.retrieved++;
                    ok_status.successful++;
                    process.stdout.write('+'.green);
                    if (opts && opts.show_detail) {
                        console.log(' OK'.green, opts.field, url.gray);
                    }
                    return true;
                }
            }
        }
        fs.unlinkSync(local_filepath);
    }
    process.stdout.write('x'.red);
    if (opts && opts.show_detail) {
        console.log(' ER'.red, opts.field, url.yellow);
    }
    return false;
};