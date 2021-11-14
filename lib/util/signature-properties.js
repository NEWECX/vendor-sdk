'use strict';

const { std_fields } = require('../cfg');

module.exports = () => std_fields.filter(x=> x.signature).map(x => x.key);
