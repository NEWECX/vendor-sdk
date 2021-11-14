'use strict';

const origWarning = process.emitWarning;

process.emitWarning = (...args) => {
    if (!args[2].startsWith('DEP')) {
        return origWarning.apply(process, args);
    }
};
