'use strict';

const { std_fields } = require('../cfg');
const get_header = require('./get-header');

module.exports = () => {
	return get_header(std_fields);
};