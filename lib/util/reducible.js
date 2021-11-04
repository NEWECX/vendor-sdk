'use strict';

function reducible(...args) {
	const x = args.shift();
	for (const dependencies of args) {
		let ok = true;
		for (const key of dependencies) {
			if (!x[key]) {
				ok = false;
				break;
			}
		}
		if (ok) return true;
	}
	return false;
}

module.exports = reducible;