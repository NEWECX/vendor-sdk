'use strict';

const package_json = require('package-json');
const finder = require('find-package-json');

module.exports = (dir = __dirname) => {
    return finder(dir).next().value;
}
module.exports = async (dir = __dirname) => {
    const pkg = finder(dir).next().value;
    const npm_pkg = await package_json(pkg.name.toLowerCase());
    return {pkg, npm_pkg};
}