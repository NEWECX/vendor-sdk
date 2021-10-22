'use strict';

const get_std_header = require('./get-std-header');
const push_errors = require('./push-errors');
const std_fields = require('../cfg/std-fields');

function is_std_header(header, errors) {

	if (!header || !Array.isArray(header)) {
		return false;
	}

	const std_header = get_std_header();

    if (header.length !== std_header.length) {
		return false;
	}

	const temp_errors = [];
	let result  = true
    for (let i = 0; i < std_fields.length; i++) {
		const std_field = std_fields[i];
		const key = std_field.key;
		const field = header[i];
		if (key !== field) {
			const lc_field = header[i].toLowerCase();
			if (key === lc_field) {
				push_errors(temp_errors, 'header', 'warning', `not standard, in column(${i}) ${field} should be all lower case`);
				continue;
			}
			if (std_field.require === 'optional' && (key.startsWith(lc_field) || lc_field.startsWith(key))) {
				push_errors(temp_errors, 'header', 'warning', `not standard, in column(${i}) ${field} missing or having extra letter(s)`);
				continue;
			}
			result = false;
			break;
		}
	}

	if (result) {
		if (temp_errors.length > 0) {
			for (let i = 0; i < std_header.length; i++) {
				header[i] = std_header[i];
			}
			errors.push(...temp_errors);
		}
	}
	return result;
}

module.exports = is_std_header;