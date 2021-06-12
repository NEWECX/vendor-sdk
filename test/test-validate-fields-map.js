'use strict';

const chai = require('chai');
const validate_fields_map = require('../lib/util/validate-fields-map');
const std_fields = require('../lib/cfg/4-std-fields');

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --reporter spec test/test-validate-fields-map

describe('Test validate-fields-map', () => {

    it('test std_fields_map', async () => {
        const result = validate_fields_map(std_fields);
        //console.log(result);
        expect(result).equals(null);
    });

    it('test empty fields_map', async () => {
        const result = validate_fields_map();
        //console.log(result);
        expect(result[0]).equals('fields_map is missing or empty');
    });

    it('test simple fields_map', async () => {
        const result = validate_fields_map([{key: 'sku', field: 'field1'}, {key: 'carat', field: 'field2'}]);
        //console.log(result);
        expect(result).equals(null);
    });

    it('test fields_map with missing key', async () => {
        const result = validate_fields_map([{field: 'field1'}]);
        //console.log(result);
        expect(result[0]).equals('fields_map[0] missing key');
    });

    it('test fields_map with unknown key', async () => {
        const result = validate_fields_map([{key: 'field-unknown', field: 'field1'}]);
        //console.log(result);
        expect(result[0]).equals('fields_map[0] with field-unknown is extra, not found in standard fields');
    });

    it('test fields_map with incorrect values_map', async () => {
        const result = validate_fields_map([{key: 'shape', values_map: {Round: 'RDD'}}]);
        //console.log(result);
        expect(result[0]).equals('fields_map[0] with values_map shape value Round => RDD, not validate');
    });

    it('test fields_map with incorrect default value', async () => {
        const result = validate_fields_map([{key: 'shape', default_value: 'RDD'}]);
        //console.log(result);
        expect(result[0]).equals('fields_map[0] with default value RDD, not validate');
    });
});