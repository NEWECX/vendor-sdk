'use strict';

const chai = require('chai');
const validate_header = require('../lib/util/validate-header');

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --reporter spec test/test-validate-header

describe('Test validate-header', () => {

    it('test validate-header empty header', async () => {
        const result = validate_header();
        //console.log(result);
        expect(result[0]).equals('header is missing or not array or empty');
    });

    it('test validate-header empty agreed_header', async () => {
        const result = validate_header(['a', 'b']);
        //console.log(result);
        expect(result[0]).equals('agreed_header is missing or not array');
    });

    it('test validate-header simple', async () => {
        const result = validate_header(['sku', 'carat'], ['sku', 'carat']);
        //console.log(result);
        expect(result).equals('ok');
    });

    it('test validate-header less agreed_header', async () => {
        const result = validate_header(['sku', 'carat'], ['carat']);
        //console.log(result);
        expect(result[0]).equals('number of header fields 2 is not 1 of agreed header');
    });

    it('test validate-header less header', async () => {
        const result = validate_header(['carat'], ['sku', 'carat']);
        //console.log(result);
        expect(result[0]).equals('number of header fields 1 is not 2 of agreed header');
    });
});