'use strict';

const chai = require('chai');
const { get_std_field } = require('../lib').util;
const { convert_diamond } = require('../lib').core;

const expect = chai.expect;

//const agreed_header = require('./agreed-header');
//const fields_map = require('./fields-map');

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --reporter spec test/test-lab-grown-transform 

describe('Test lab-grown-transform', () => {

    it('test lab-grown-transform 1', async () => {
        const row = {certificate_lab: 'IGI', certificate_number: '12345678'};
        const fields_map = [{key: 'vendor_sku', field: 'stock#'}];
        const options = undefined;
        const std_fields = [ 
            {key: 'certificate_lab', type: 'string', require: 'required'}, 
            {key: 'certificate_number', type: 'string', require: 'required'},
            {
              key: 'lab_grown',
              require: 'required', 
              transform: (x) => { 
                if (!x.lab_grown) {
                  if (x.certificate_lab === 'GIA') return 0;
                  if (x.certificate_lab === 'IGI') return 1; 
                } 
              },
              type: 'number',
            },
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields); 
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
          "pass": true,
          "certificate_lab": "IGI",
          "certificate_number": "12345678",
          "lab_grown": 1,
          "original": {
            "certificate_lab": "IGI",
            "certificate_number": "12345678"
          }
        });
    });

    it('test lab-grown-transform 2', async () => {
        const row = {certificate_lab: 'GIA', certificate_number: '12345678'};
        const fields_map = [{key: 'vendor_sku', field: 'stock#'}];
        const options = undefined;
        const std_fields = [ 
            {key: 'certificate_lab', type: 'string', require: 'required'}, 
            {key: 'certificate_number', type: 'string', require: 'required'},
            {
              key: 'lab_grown',
              require: 'required', 
              transform: (x) => { 
                if (!x.lab_grown) {
                  if (x.certificate_lab === 'GIA') return 0;
                  if (x.certificate_lab === 'IGI') return 1; 
                } 
              },
              type: 'number',
            },
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields); 
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
          "pass": true,
          "certificate_lab": "GIA",
          "certificate_number": "12345678",
          "lab_grown": 0,
          "original": {
            "certificate_lab": "GIA",
            "certificate_number": "12345678"
          }
        });
    });

    it('test lab-grown-transform 3', async () => {
        const row = {certificate_lab: 'AGSL', certificate_number: '12345678'};
        const fields_map = [{key: 'vendor_sku', field: 'stock#'}];
        const options = undefined;
        const std_fields = [ 
            {key: 'certificate_lab', type: 'string', require: 'required'}, 
            {key: 'certificate_number', type: 'string', require: 'required'},
            {
              key: 'lab_grown',
              require: 'required',
              default_value: 0,
              transform: (x) => { 
                if (!x.lab_grown) {
                  if (x.certificate_lab === 'GIA') return 0;
                  if (x.certificate_lab === 'IGI') return 1; 
                } 
              },
              type: 'number',
            },
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields); 
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(false);
        expect(result).to.be.deep.equals({
            "pass": false,
            "certificate_lab": "AGSL",
            "certificate_number": "12345678",
            "lab_grown": "",
            "original": {
              "certificate_lab": "AGSL",
              "certificate_number": "12345678"
            },
            "errors": [
              {
                "field": "lab_grown",
                "error": "required key, lab_grown => , empty value"
              }
            ]
          });
    });
});