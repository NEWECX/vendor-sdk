'use strict';

const { certificate_lab_values } = require('@ritani/diamond-glossary');

module.exports = (lab, cert_num) => {
    if (!certificate_lab_values.includes(lab)) {
        throw new Error('invalid certificate lab, not in ' + certificate_lab_values.join(', '));
    }
    if (/[non| |.|not|un|+]/i.test(cert_num)) {
        throw new Error('invalid certificate number');
    }
    if (cert_num.toUpperCase().startsWith(lab)) {
        cert_num = cert_num.substr(lab.length);
        if (cert_num.length > 0) {
            const first_char = cert_num.charAt(0);
            if ([' ', '-', '_', '#'].includes(first_char)) {
                cert_num = cert_num.substr(1);
            }
        }
    }
    if (!cert_num) {
        throw new Error('certificate_number is an invalid value or empty');
    }
    if (['GIA', 'AGSL', 'GSI', 'HRD'].includes(lab)) {
        cert_num = cert_num.replace(/\D/g, '');
    } else if (lab === 'IGI') {
        cert_num = cert_num.toUpperCase();
        cert_num = cert_num.replace(/\W/g, '')
    } else if (lab === 'DF') {
        cert_num = cert_num.toUpperCase();
        cert_num = cert_num.replace(/[^0-9A-Z]/g, '')
    }
    if (!cert_num) {
        throw new Error('certificate_number is an invalid value');
    }
    return {certificate_lab: lab, certificate_number: cert_num};
}