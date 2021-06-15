const base62 = require('base-x')('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const crypto = require('crypto');

const get_check_sum = (input) => {
    if (typeof input === 'object') {
        input = JSON.stringify(input);
    }
    const hash = crypto.createHash('sha1');
    hash.update(input);
    return base62.encode(hash.digest());   
}

module.exports = get_check_sum;