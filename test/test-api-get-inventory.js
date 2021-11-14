'use strict';

const chai = require('chai');
const node_path = require('path');
const { api_get_inventory } = require('../lib').core;
const fs = require('fs');

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha  --timeout 3000 --reporter spec test/test-api-get-inventory

describe('Test api-get-inventory', () => {
    
    it('test api-get-inventory', async () => {

      const data_dir = __dirname + '/data';
      const filepath = node_path.join(data_dir, 'test-inventory.csv');
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      const result = await api_get_inventory(filepath);
      //console.log(result)
      expect(result.status).equals('OK');
      expect(fs.existsSync(filepath)).equals(true);
    });


});
