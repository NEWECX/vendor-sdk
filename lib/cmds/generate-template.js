'use strict';

const fs = require('fs');
const node_path = require('path');
const { get_project_directory, mk_template } = require('../');

async function generate_template() {
    const project_dir = get_project_directory();
    if (!project_dir) {
        console.error('project directory not setup yet!');
        process.exit(1);
    }
    const template_filepath = node_path.join(project_dir, 'template');
    if (!fs.existsSync(template_filepath)) {
        fs.mkdirSync(template_filepath);
    }
    await mk_template(template_filepath);
    console.log(`template files are saved in ${template_filepath}`);
}

module.exports = generate_template;
