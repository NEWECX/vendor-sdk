'use strict';

const fs = require('fs');
const node_path = require('path');
const { to_simple_js } = require('@ritani/to-simple-js');

function write_simple_js(dir_path, name, data) {

    const filepath = node_path.join(dir_path, name + '.js');
    if (fs.existsSync(filepath)) {
        const new_filepath = filepath + '-saved-' + new Date().toISOString().replace(/-|T|:|\.|Z/g, '');
        fs.renameSync(filepath, new_filepath)
    }
    const content = typeof data === 'string' ? data : to_simple_js(name, data);
    fs.writeFileSync(filepath, content);
    return filepath;
}

module.exports = write_simple_js;