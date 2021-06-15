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
    const var_name = name.replace(/-/g, '_');
    const code_block = typeof data === 'string' ? data : to_js(data);
    const content = `'use strict';\n\nconst ${var_name} = ${code_block};\n\nmodule.exports = ${var_name};`;
    fs.writeFileSync(filepath, content);
}

module.exports = write_simple_js;