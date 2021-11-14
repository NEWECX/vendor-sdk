'use strict';

const fs = require('fs');
const node_path = require('path');
const {set_data_directory} = require('../util');

module.exports = (filepath) => {
    const fullpath = node_path.resolve(filepath);
    if (!fs.existsSync(fullpath)) {
        throw new Error(`Error: ${filepath} not exists`);
    }
    if (!fs.lstatSync(fullpath).isDirectory()) {
        throw new Error(`Error: ${filepath} is not a directory`);
    }
    set_data_directory(fullpath, true);
    console.log(`data directory is set to ${fullpath}`);
};