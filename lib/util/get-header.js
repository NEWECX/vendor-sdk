'use strict';

module.exports = (items) => {
	const header = [];
	for (const item of items) {
		if (!item.key) {
			continue;
		}
		let field = item.key;
		if (item.field) {
			field = item.field;
		}
		header.push(field);
	}
	return header;
};
