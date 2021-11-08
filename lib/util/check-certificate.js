'use strict';

const { certificate_lab_values } = require('@ritani/diamond-glossary');

module.exports = (certificate_lab, certificate_number) => {
    if (!certificate_lab_values.includes(certificate_lab)) {
        throw new Error('invalid certificate lab, not in ' + certificate_lab_values.join(', '));
    }
    if (/[non| |.|not|un|+]/i.test(certificate_number)) {
        throw new Error('invalid certificate number');
    }
    if (certificate_number.toUpperCase().startsWith(certificate_lab)) {
        certificate_number = certificate_number.substr(certificate_lab.length);
        if (certificate_number.length > 0) {
            const first_char = certificate_number.charAt(0);
            if ([' ', '-', '_', '#'].includes(first_char)) {
                certificate_number = certificate_number.substr(1);
            }
        }
    }
    if (!certificate_number) {
        throw new Error('certificate_number is an invalid value or empty');
    }
    if (['GIA', 'AGSL', 'GSI', 'HRD'].includes(certificate_lab)) {
        certificate_number = certificate_number.replace(/\D/g, '');
    } else if (certificate_lab === 'IGI') {
        certificate_number = certificate_number.toUpperCase();
        certificate_number = certificate_number.replace(/\W/g, '')
    } else if (certificate_lab === 'DF') {
        certificate_number = certificate_number.toUpperCase();
        certificate_number = certificate_number.replace(/[^0-9A-Z]/g, '')
    }
    if (!certificate_number) {
        throw new Error('certificate_number is an invalid value');
    }
    return {certificate_lab, certificate_number};
}