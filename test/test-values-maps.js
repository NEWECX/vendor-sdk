'use strict';

const chai = require('chai');
const values_maps = require('../lib/cfg/3-values-maps')
const std_fields = require('../lib/cfg/4-std-fields');
const get_std_field = require('../lib/util/get-std-field');

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --reporter spec test/test-values-maps

describe('Test values-maps', () => {

    it('test values-maps', async () => {
        for (const key in values_maps) {
            //console.log('verify', key);
            const {values, map, reverse_map} = values_maps[key];
            expect(values.length === Object.keys(map).length);
            expect(values.length === Object.keys(reverse_map).length);
            for (const value of values) {
                if (typeof value === 'string') {
                    expect(value).equals(value.toUpperCase());
                }
                expect(map).has.property(value);
                expect(map[value]).to.be.a('string');
            }
            for (const r_key in reverse_map) {
                expect(r_key).equals(r_key.toLowerCase());
                const r_value = reverse_map[r_key];
                expect(values.indexOf(r_value)).not.equals(-1);
            }
        }
    });

    it('test std_fields', async () => {
        for (const item of std_fields) {
            expect(item).has.property('key');
            expect(item).has.property('require');
            expect(item.require).is.oneOf(['required', 'expected', 'optional']);
            expect(item).has.property('type');
            expect(item.type).is.oneOf(['string', 'number']);
            if (item.values) {
                expect(item.values).is.an('array');
                expect(item.values.length).greaterThan(0);
            }
        }
        for (const key in values_maps) {
            const std_field = get_std_field(key);
            expect(std_field).has.property('values');
            expect(std_field.values).to.deep.equal(values_maps[key].values);
        }
    });

});