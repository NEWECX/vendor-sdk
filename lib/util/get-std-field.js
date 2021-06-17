'use strict';

const std_fields = require('../cfg/std-fields');

function get_std_field(key) {
	return std_fields.find(x => x.key === key);
}

module.exports = get_std_field;