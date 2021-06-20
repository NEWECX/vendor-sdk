'use strict';

function reducible(x, dependencies) {
	for (const key of dependencies) {
		if (!x[key]) {
			return false;
		}
	}
	return true;
}

module.exports = reducible;