'use strict';

const package_json = require('package-json');
const finder = require('find-package-json');

module.exports = {
    find_pkg,
    get_npm_pkg
}

function find_pkg(dir = __dirname) {
    return finder(dir).next().value
}

async function get_npm_pkg(pkg_name) {
    return await package_json(pkg_name);
}