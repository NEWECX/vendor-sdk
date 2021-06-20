'use strict';

const isIdeal = (val='') => val.includes('id') || val === 'i';
const isExcellent = (val='') => val.includes('ex') || val === 'x' || val === 'e';
const isVeryGood = (val='') => val.includes('v');
const isGood = (val='') => val.includes('g') && !val.includes('v');
const isFair = (val='') => val.includes('f');

const gradeMapping = (val) =>{
    if (!val) {
        return '';
    }
    const value = val.toLowerCase();
    if (isIdeal(value)) return 'EX';
    if (isExcellent(value)) return 'EX';
    if (isVeryGood(value)) return 'VG';
    if (isGood(value)) return 'G';
    if (isFair(value)) return 'F';
    return val;
}

const dictMapping = (val, dict) => {
    if (!val) {
        return '';
    }
    const value = val.toLowerCase()
    return value in dict ? dict[value] : val;
}

module.exports = {
    gradeMapping,
    dictMapping,
};