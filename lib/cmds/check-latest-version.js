'use strict';

const latestVersion = require('latest-version');
const pkg = require('../../package.json');

function check_latest_version() {
    latestVersion('@ritani/vendor-sdk').then(version => {
        if (version !== pkg.version) {
            console.log();
            console.log(`@ritani/vendor-sdk has a newer version ${version} published. The running version is ${pkg.version}.`)
            console.log('To upgrade, please run:');
            console.log('            npm -g install @ritani/vendor-sdk');
            console.log();
        }
    }).catch(err => {
        //
    });
}

module.exports = check_latest_version;