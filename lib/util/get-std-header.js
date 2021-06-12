'use strict';

const std_fields = require('../cfg/4-std-fields');
const get_header = require('./get-header');

function get_std_header() {
	return get_header(std_fields);
}

module.exports = get_std_header;