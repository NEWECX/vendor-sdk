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
        expect(result).to.be.deep.equal([ { field: 'header', error: 'missing or not array or empty' } ]);
    });

    it('test validate-header empty agreed_header', async () => {
        const result = validate_header(['a', 'b']);
        //console.log(result);
        expect(result).to.be.deep.equal([ { field: 'header', error: 'agreed missing or not array' } ]);
    });

    it('test validate-header simple', async () => {
        const result = validate_header(['vendor_sku', 'carat'], ['vendor_sku', 'carat']);
        //console.log(result);
        expect(result).equals('ok');
    });

    it('test validate-header less agreed_header', async () => {
        const result = validate_header(['vendor_sku', 'carat'], ['carat']);
        //console.log(result);
        expect(result).to.be.deep.equal([
          {
            field: 'header',
            warning: 'number of header fields 2 is not 1 of agreed header'
          },
          {
            field: 'header',
            warning: 'column: 1 header is vendor_sku, not matching with agreed header: carat'
          },
          {
            field: 'header',
            warning: 'column: 2 header is carat, not matching with agreed header: undefined'
          },
          {
            field: 'header',
            info: 'For your reference, the agreed header: carat'
          }
        ]);
    });

    it('test validate-header less header', async () => {
        const result = validate_header(['carat'], ['vendor_sku', 'carat']);
        //console.log(result);
        expect(result).to.be.deep.equal([
          {
            field: 'header',
            warning: 'number of header fields 1 is not 2 of agreed header'
          },
          {
            field: 'header',
            warning: 'column: 1 header is carat, not matching with agreed header: vendor_sku'
          },
          {
            field: 'header',
            info: 'For your reference, the agreed header: vendor_sku, carat'
          }
        ]);
    });
});