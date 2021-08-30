'use strict';

const latestVersion = require('latest-version');
const finder = require('find-package-json');

function check_latest_version() {
    const pkg = finder(__dirname).next().value;
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