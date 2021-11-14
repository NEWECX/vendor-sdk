'use strict';

module.exports = (header_errors, diamonds_errors) => {
    let header_has_error = false;
    if (header_errors && header_errors.length > 0) {
        for (const error of header_errors) {
            const field = error.field;
            for (const type of ['error', 'warning', 'info']) {
                if (error[type]) {
                    if (type === 'error') {
                        header_has_error = true;
                    }
                    if (diamonds_errors) {
                        const message = error[type];
                        diamonds_errors.push({row_no: 0, field, type, message});
                    }
                    break;
                }
            }
            if (header_has_error && !diamonds_errors) break;
        }
    }
    return header_has_error;
};