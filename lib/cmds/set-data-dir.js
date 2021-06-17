'use strict';

const fs = require('fs');
const node_path = require('path');
const {set_data_directory} = require('../');

function set_data_dir(filepath) {
    const fullpath = node_path.resolve(filepath);
    if (!fs.existsSync(fullpath)) {
        console.error(`Error: ${filepath} not exists`);
        process.exit(1);
    }
    if (!fs.lstatSync(fullpath).isDirectory()) {
        console.error(`Error: ${filepath} is not a directory`);
        process.exit(1);
    }
    set_data_directory(fullpath, true);
    console.log(`data directory is set to ${fullpath}`);
}

module.exports = set_data_dir;