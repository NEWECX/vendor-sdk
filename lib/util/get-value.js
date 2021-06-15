'use strict';

function get_value(value, type) {

    if (typeof value === 'string') {

        const start_quote = value.charAt(0) === '"';
        const end_quote = value.charAt(value.length - 1) === '"';

        if ( start_quote || end_quote) {

            const parts = value.split('');
            if (start_quote) {
                parts.shift();
            }
            if (end_quote) {
                parts.pop();
            }
            value = parts.join('');

        }

    } else if (value === undefined || value === null) {
        
        value = '';

    }

    if ((type === 'number' || !type) && value !== '' && !isNaN(value) ) {

        value = Number(value);

    }

    return value;
}

module.exports = get_value;