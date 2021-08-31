'use strict';

const latestVersion = require('latest-version');
const find_pkg = require('./find-pkg');

function check_latest_version(dir = __dirname) {
    const pkg = find_pkg(dir);
    //console.log(pkg);
    latestVersion(pkg.name).then(version => {
        //console.log('version', version);
        if (version !== pkg.version) {
            console.log();
            console.log(`${pkg.name} has a newer version ${version} published. The running version is ${pkg.version}.`)
            console.log('To upgrade, please run:');
            console.log(`            npm -g install ${pkg.name}`);
            console.log();
        }
    }).catch(() => {
        //
    });
}

module.exports = check_latest_version;