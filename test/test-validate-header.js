'use strict';

const chai = require('chai');
const validate_header = require('../lib/util/validate-header');

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --reporter spec test/test-validate-header

describe('Test validate-header', () => {

    it('1) test validate-header empty header', async () => {
        const header_errors = [];
        const result = validate_header(undefined,undefined,undefined,header_errors);
        //console.log(result, header_errors);
        expect(result).equals(false);
        expect(header_errors).to.be.deep.equal([ { field: 'header', error: 'missing or not array or empty' } ]);
    });

    it('2)test validate-header empty agreed_header', async () => {
        const header_errors = [];
        const result = validate_header(['a', 'b'],undefined,undefined,header_errors);
        //console.log(result, header_errors);
        expect(result).equals(false);
        expect(header_errors).to.be.deep.equal([ { field: 'header', error: 'agreed missing or not array' } ]);
    });

    it('3) test validate-header simple', async () => {
        const header_errors = [];
        const result = validate_header(['vendor_sku', 'carat'], ['vendor_sku', 'carat'],undefined,header_errors);
        //console.log(result, header_errors);
        expect(result).equals(true);
        expect(header_errors.length).equals(0);
    });

    it('4) test validate-header with case not match', async () => {
        const header_errors = [], fields_map = [];
        const result = validate_header(['vendor_sku', 'Carat'], ['vendor_sku', 'carat'],fields_map,header_errors);
        //console.log(fields_map, result, header_errors);
        expect(result).equals(true);
        expect(fields_map).to.be.deep.equal([
          {key: 'carat', field: 'Carat'}
        ]);
        expect(header_errors).to.be.deep.equal([
          {
            field: 'header',
            warning: 'column: 2 header is Carat, not matching with agreed header: carat'
          },
          {
            field: 'header',
            info: 'For your reference, the agreed header: vendor_sku, carat'
          }
        ]);
    });

    it('5) test validate-header more than agreed_header', async () => {
        const header_errors = [], fields_map = [];
        const result = validate_header(['vendor_sku', 'carat'], ['carat'],fields_map,header_errors);
        //console.log(result, header_errors);
        expect(result).equals(true);
        expect(header_errors).to.be.deep.equal([
          {
            field: 'header',
            warning: 'number of header fields is 2, not the same as number of agreed header 1'
          },
          {
            field: 'header',
            warning: 'column: 1 header is vendor_sku, not matching with agreed header: carat'
          },
          {
            field: 'header',
            info: 'For your reference, the agreed header: carat'
          }
        ]);
    });

    it('6) test validate-header more than agreed_header and case not match', async () => {
      const header_errors = [], fields_map = [];
      const result = validate_header(['vendor_sku', 'Carat'], ['carat'],fields_map,header_errors);
      //console.log(result, fields_map, header_errors);
      expect(result).equals(true);
      expect(fields_map).to.be.deep.equal([
        {key: 'carat', field: 'Carat'}
      ]);
      expect(header_errors).to.be.deep.equal([
        {
          field: 'header',
          warning: 'number of header fields is 2, not the same as number of agreed header 1'
        },
        {
          field: 'header',
          warning: 'column: 1 header is vendor_sku, not matching with agreed header: carat'
        },
        {
          field: 'header',
          warning: 'column: 2 header is Carat, not matching with agreed header: carat'
        },
        {
          field: 'header',
          info: 'For your reference, the agreed header: carat'
        }
      ]);
    });

    it('7) test validate-header less than agreed_header', async () => {
        const header_errors = [], fields_map = [];
        const result = validate_header(['carat'], ['vendor_sku', 'carat'],fields_map,header_errors);
        //console.log(result, fields_map, header_errors);
        expect(result).equals(true);
        expect(header_errors).to.be.deep.equal([
          {
            field: 'header',
            warning: 'number of header fields is 1, not the same as number of agreed header 2'
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

    it('8) test validate-header less than agreed_header and case not match', async () => {
      const header_errors = [], fields_map = [];
      const result = validate_header(['Carat'], ['vendor_sku', 'carat'],fields_map,header_errors);
      //console.log(result, fields_map, fields_map, header_errors);
      expect(fields_map).to.be.deep.equal([
        {key: 'carat', field: 'Carat'}
      ]);
      expect(result).equals(true);
      expect(header_errors).to.be.deep.equal([
        {
          field: 'header',
          warning: 'number of header fields is 1, not the same as number of agreed header 2'
        },
        {
          field: 'header',
          warning: 'column: 1 header is Carat, not matching with agreed header: vendor_sku'
        },
        {
          field: 'header',
          warning: 'column: 1 header is Carat, not matching with agreed header: carat'
        },
        {
          field: 'header',
          info: 'For your reference, the agreed header: vendor_sku, carat'
        }
      ]);
  });

  it('9) test validate-header with extra header', async () => {
    const header_errors = [], fields_map = [];
    const result = validate_header(['carat', 'carat', 'extra'], ['vendor_sku', 'carat'],fields_map,header_errors);
    //console.log(result, fields_map, fields_map, header_errors);
    expect(result).equals(false);
    expect(header_errors).to.be.deep.equal([
      {
        field: 'header',
        warning: 'number of header fields is 3, not the same as number of agreed header 2'
      },
      {
        field: 'header',
        warning: 'column: 1 header is carat, not matching with agreed header: vendor_sku'
      },
      {
        field: 'header',
        error: 'column: 2 header is carat, duplicated header field name'
      },
      {
        field: 'header',
        warning: 'column: 3 header is extra, it is an extra field'
      },
      {
        field: 'header',
        info: 'For your reference, the agreed header: vendor_sku, carat'
      }
    ]);
  });

  it('10) test validate-header with extra header', async () => {
      const header_errors = [], fields_map = [];
      const result = validate_header(['vendor_sku', 'carat', 'extra'], ['vendor_sku', 'carat'],fields_map,header_errors);
      //console.log(result, fields_map, fields_map, header_errors);
      expect(result).equals(true);
      expect(header_errors).to.be.deep.equal([
        {
          field: 'header',
          warning: 'number of header fields is 3, not the same as number of agreed header 2'
        },
        {
          field: 'header',
          warning: 'column: 3 header is extra, it is an extra field'
        },
        {
          field: 'header',
          info: 'For your reference, the agreed header: vendor_sku, carat'
        }
      ]);
  });

  it('11) test validate-header with extra space field', async () => {
    const header_errors = [], fields_map = [];
    const result = validate_header(['vendor_sku', 'carat '], ['vendor_sku', 'carat'],fields_map,header_errors);
    //console.log(result, fields_map, header_errors);
    expect(result).equals(true);
    expect(fields_map).to.be.deep.equal([
      {key: 'carat', field: 'carat '}
    ]);
    expect(header_errors).to.be.deep.equal([
      {
        field: 'header',
        warning: 'column: 2 header is carat , not matching with agreed header: carat'
      },
      {
        field: 'header',
        info: 'For your reference, the agreed header: vendor_sku, carat'
      }
    ]);
});

});