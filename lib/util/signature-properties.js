'use strict';

const std_fields = require('../cfg/std-fields');

module.exports = () => std_fields.filter(x=> x.signature).map(x => x.key);
