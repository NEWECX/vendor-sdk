'use strict';

const chai = require('chai');
const node_path = require('path');
const read_from_csv = require('../lib/util/read-from-csv');
const mk_fields_map = require('../lib/util/mk-fields-map');

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --reporter spec test/test-mk-fields-map

describe('Test mk-fields-map', () => {

    it('test read_from_csv', async () => {
        const test_csv_filepath = node_path.join(__dirname, 'data', 'test.csv'); 
        const header_stats = {};
        const result = await read_from_csv(test_csv_filepath, header_stats);
        //console.log('result size', result.length, 'header_stats.samples size', Object.keys(header_stats.samples).length);
        //delete header_stats.samples;
        //console.log(JSON.stringify(header_stats, null, 2));
    });

    it('test mk_fields_map', async () => {
        const test_csv_filepath = node_path.join(__dirname, 'data', 'test.csv'); 
        const header_stats = {};
        await read_from_csv(test_csv_filepath, header_stats);
        console.log(header_stats);
        const result = mk_fields_map(header_stats)
        console.log(result);
    });

});