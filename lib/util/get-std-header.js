'use strict';

const std_fields = require('../cfg/std-fields');
const get_header = require('./get-header');

function get_std_header() {
	return get_header(std_fields);
}

module.exports = get_std_header;