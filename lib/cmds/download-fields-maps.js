'use strict';

require('colors');
const fs = require('fs');
const node_path = require('path');
const { get_project_directory, write_simple_js } = require('../util');
const { api_get_fields_maps } = require('../core');

module.exports = async() => {
    const project_dir = get_project_directory();
    if (!project_dir) {
        throw new Error('project directory not setup yet!');
    }
    const result = await api_get_fields_maps();
    if (result) {
        const src_dir = node_path.join(project_dir, 'src');
        if (!fs.existsSync(src_dir)) {
            fs.mkdirSync(src_dir, {recursive: true});
        }
        const filepath = write_simple_js(src_dir, 'fields-maps', result);
        console.log(`downloaded fields-maps is saved in ${filepath}`);
    } else {
        throw new Error('failed to get fields maps'.red);
    }
}
