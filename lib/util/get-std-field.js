'use strict';

const std_fields = require('../cfg/4-std-fields');

function get_std_field(key) {
	return std_fields.find(x => x.key === key);
}

module.exports = get_std_field;