'use strict';

function push_errors(errors, field, type, message) {
    if (errors.find(x => x.field === field && x[type] === message)) {
        return;
    }
    const error = {field};
    error[type] = message;
    errors.push(error);
}

module.exports = push_errors;