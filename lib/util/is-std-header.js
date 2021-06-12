'use strict';

const get_std_header = require('./get-std-header');

function is_std_header(header) {

	if (!header || !Array.isArray(header)) {
		return false;
	}

	const std_header = get_std_header();

    if (header.length !== std_header.length) {
		return false;
	}

    for (let i = 0; i < std_header.length; i++) {
		if (std_header[i] !== header[i]) {
			return false;
		}
	}

	return true;
}

module.exports = is_std_header;