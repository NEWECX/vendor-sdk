'use strict';

const chai = require('chai');
const node_path = require('path');
const parse_inventory_csv = require('../lib/parse-inventory-csv');

const expect = chai.expect;

const agreed_header = require('./agreed-header');
const fields_map = require('./fields-map');

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --timeout 3000 --reporter spec test/test-parse-inventory-csv 

describe('Test parse-inventory-csv', () => {

    it('test parse-inventory-csv', async () => {
        const local_filepath = node_path.join(__dirname, 'data', 'inventory.csv');
        const result = await parse_inventory_csv(local_filepath, fields_map, agreed_header);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.ok_count).equals(1);
        expect(result.diamonds.length).equals(1);
        expect(result.diamonds[0].pass).equals(true);
    });

    it('test parse-inventory-csv new', async () => {
        const local_filepath = node_path.join(__dirname, 'data', 'inventory-new.csv');
        const result = await parse_inventory_csv(local_filepath, fields_map, agreed_header);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.ok_count).equals(2);
        expect(result.diamonds.length).equals(2);
        expect(result.diamonds[0].pass).equals(true);
    });
});