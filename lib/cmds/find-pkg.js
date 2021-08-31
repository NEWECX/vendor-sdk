'use strict';

const finder = require('find-package-json');

module.exports = (dir = __dirname) => {
    return finder(dir).next().value;
}