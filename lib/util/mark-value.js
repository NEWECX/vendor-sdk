'use strict';

function mark_value(value) {

    if (value === '') {

        return '*';

    } else if (typeof value === 'string') {

        if (value.charAt(0) !== '*') {
            return '* ' + value;
        } else {
            return value;
        }

    } else {

        return '* ' + value;
    }
}

module.exports = mark_value;