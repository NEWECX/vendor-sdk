'use strict';

require('colors');
const {find_pkg, get_npm_pkg} = require('../util');

module.exports = (dir = __dirname) => {
    const pkg = find_pkg(dir);
    get_npm_pkg(dir).then(npm_pkg => {
        if (get_version_number(npm_pkg.version) > get_version_number(pkg.version)) {
            console.log();
            console.log(`${pkg.name} has a newer version ${npm_pkg.version.brightGreen} published. The running version is ${pkg.version.yellow}.`)
            console.log('To upgrade, please run:');
            console.log(`            npm -g install ${pkg.name}`.green);
            console.log();
        }
    }).catch(() => {
        //
    });
}

const version_array = [10000, 100, 1];

function get_version_number(version) {
    const parts = version.split('.').map(x => Number(x));
    let version_number = 0;
    for (let i = 0; i < version_array.length && i < parts.length; i++) {
        version_number += version_array[i] * parts[i];
    }
    return version_number;
}
