'use strict';

require('colors');
const get_npm_pkg = require('../util/get-npm-pkg');

function check_latest_version(dir = __dirname) {
    get_npm_pkg(dir).then((pkg, npm_pkg) => {
        if (npm_pkg.version > pkg.version) {
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

module.exports = check_latest_version;