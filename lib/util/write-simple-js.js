'use strict';

const fs = require('fs');
const node_path = require('path');
const to_js = require('./to-js');

function write_simple_js(dir_path, name, data) {

    const filepath = node_path.join(dir_path, name + '.js');
    if (fs.existsSync(filepath)) {
        const new_filepath = filepath + '-saved-' + new Date().toISOString().replace(/-|T|:|\.|Z/g, '');
        fs.renameSync(filepath, new_filepath)
    }
    const content = `'use strict';\n\nconst ${name} = ` + to_js(data) + `;\n\nmodule.exports = ${name};`;
    fs.writeFileSync(filepath, content);
}

module.exports = write_simple_js;