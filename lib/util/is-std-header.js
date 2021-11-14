'use strict';

const { std_fields } = require('../cfg');
const get_std_header = require('./get-std-header');
const push_errors = require('./push-errors');
const match_name_value = require('./match-name-value');

module.exports = (header, errors, fields_map) => {

	if (!header || !Array.isArray(header)) {
		return false;
	}

	const std_header = get_std_header();

    if (header.length !== std_header.length) {
		return false;
	}

	const temp_errors = [], small_errors = {};
    for (let i = 0; i < std_fields.length; i++) {
		const std_field = std_fields[i];
		const key = std_field.key;
		const field = header[i];
		if (key !== field) {
			if (small_errors) {
				const lc_field = header[i].trim().toLowerCase();
				if (key === lc_field) {
					small_errors[key] = field;
					push_errors(temp_errors, 'header', 'warning', `not standard, column(${i}) name ${field} should be all lower case`);
					continue;
				}
				if (match_name_value(field, std_field)) {
					small_errors[key] = field;
					push_errors(temp_errors, 'header', 'warning', `not standard, column(${i}) name ${field}`);
					continue;
				}
			}
			return false;
		}
	}

	if (temp_errors.length > 0) {
		errors.push(...temp_errors);
		for (const field_map of fields_map) {
			const key = field_map.key;
			if (small_errors[key]) {
				field_map.field = small_errors[key];
				delete small_errors[key];
			} else if (field_map.field) {
				delete field_map.field;
			}
		}
		for (const key in small_errors) {
			fields_map.push({key, field: small_errors[key]});
		}
		return true;
	}

	return true;
};