'use strict';

function sanitize_check(x) {
    const regex = new RegExp('require|import|fs|os|global|__|fetch|http|export|module', 'i');
    if (regex.test(x)) {
        throw new Error('ERROR: sanitize check failed');
    }
}

module.exports = sanitize_check;