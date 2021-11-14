'use strict';

const { std_fields } = require('../cfg');

module.exports = (key) => {
	return std_fields.find(x => x.key === key);
};