'use strict';

module.exports = (errors, field, type, message) => {
    if (!errors) {
        return;
    }
    if (errors.find(x => x.field === field && x[type] === message)) {
        return;
    }
    const error = {field};
    error[type] = message;
    errors.push(error);
};