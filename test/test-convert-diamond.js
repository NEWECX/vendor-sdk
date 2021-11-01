'use strict';

const chai = require('chai');
const convert_diamond = require('../lib/util/convert-diamond');
const get_std_field = require('../lib/util/get-std-field');

const expect = chai.expect;

//const agreed_header = require('./agreed-header');
//const fields_map = require('./fields-map');

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --reporter spec test/test-convert-diamond 

describe('Test convert-diamond', () => {

    it('test convert-diamond 1', async () => {
        const result = await convert_diamond( 
            {'stock#': 'vendor-sku', carat: '1.00', certificate_lab: 'AGSL', certificate_number: '12345678'},    // row
            [{key: 'vendor_sku', field: 'stock#'}],     // fields_map
            undefined,
            [{key: 'vendor_sku', type: 'string', require: 'expected'}, {key: 'carat', type: 'number', require: 'required'},
            {key: 'certificate_lab', type: 'string', require: 'required'}, {key: 'certificate_number', type: 'string', require: 'required'}], // std_fields
            ['vendor_sku', 'carat', 'certificate_lab', 'certificate_number'] // assets_fields
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
    });

    it('test convert-diamond 2', async () => {
        const assets_fields = ['certificate_lab'];
        const std_fields = [];
        for (const key of assets_fields) {
            std_fields.push(get_std_field(key))
        }
        const result = await convert_diamond( 
            { lab: 'AAA' },    // row
            [
                { key: 'certificate_lab', field: 'lab'}, // fields_map
            ],
            null,  
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "pass": false,
            "certificate_lab": "",
            "certificate_number": "",
            "original": {
              "lab": "AAA"
            },
            "errors": [
              {
                "field": "lab",
                "error": "value not mapped, certificate_lab => AAA, not in GIA, AGSL, HRD, IGI, GCAL, DF, EGL, GHI, GSI, IIDGR, PGS, BSC, JGS, WGI, EDR"
              }
            ]
        });
    })

    it('test convert-diamond 3', async () => {
        const assets_fields = ['certificate_lab', 'certificate_number'];
        const std_fields = [];
        for (const key of assets_fields) {
            std_fields.push(get_std_field(key))
        }
        const result = await convert_diamond(
            { lab: 'AAA', certificate_number: '1234'},    // row
            [
                { key: 'certificate_lab', field: 'lab', values_map: { aaa: 'AGSL' }}, // fields_map
            ],
            null,   
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "pass": true,
            "certificate_lab": "AGSL",
            "certificate_number": "1234",
            "original": {
              "certificate_number": "1234",
              "lab": "AAA"
            }
        });
    });

    it('test convert-diamond 4', async () => {
        const assets_fields = ['certificate_lab'];
        const std_fields = [];
        for (const key of assets_fields) {
            std_fields.push(get_std_field(key))
        }
        const result = await convert_diamond(
            { lab: '' },    // row
            [
                { key: 'certificate_lab', field: 'lab' }, // fields_map
            ],
            null,    
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "pass": false,
            "certificate_lab": "",
            "certificate_number": "",
            "original": {
              "lab": ""
            },
            "errors": [
              {
                "field": "lab",
                "error": "missing required value, key certificate_lab"
              }
            ]
        });
    });

    it('test convert-diamond 5', async () => {
        const assets_fields = ['certificate_lab'];
        const std_fields = [];
        for (const key of assets_fields) {
            std_fields.push(get_std_field(key))
        }
        const result = await convert_diamond(
            { lab: '' },    // row
            [
                { key: 'certificate_lab', field: 'lab', default_value: 'GIA'}, // fields_map
            ],
            null,     
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "pass": false,
            "certificate_lab": "GIA",
            "certificate_number": "",
            "original": {
                "lab": ""
            }
        });
    });

    it('test convert-diamond 6', async () => {
        const assets_fields = ['lab_grown'];
        const std_fields = [];
        for (const key of assets_fields) {
            std_fields.push(get_std_field(key))
        }
        const result = await convert_diamond( 
            { lab_grown: '' },    // row
            [
                { key: 'lab_grown'}, // fields_map
            ],
            null,     
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "pass": false,
            "lab_grown": "",
            "certificate_lab": "",
            "certificate_number": "",
            "original": {
              "lab_grown": ""
            },
            "errors": [
              {
                "field": "lab_grown",
                "error": "missing required value, key lab_grown"
              }
            ]
        });
    });

    it('test convert-diamond 7', async () => {
        const assets_fields = ['certificate_lab', 'certificate_number', 'lab_grown'];
        const std_fields = [];
        for (const key of assets_fields) {
            std_fields.push(get_std_field(key))
        }
        const result = await convert_diamond( 
            { certificate_lab: 'GIA', certificate_number: '1234567890', lab_grown: '' },    // row
            [
                { key: 'lab_grown', default_value: 1 }, // fields_map
            ],
            null,   
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "pass": true,
            "certificate_lab": "GIA",
            "certificate_number": "1234567890",
            "lab_grown": 1,
            "original": {
              "certificate_lab": "GIA",
              "certificate_number": "1234567890",
              "lab_grown": ""
            }
        });
    });

    it('test convert-diamond 8', async () => {
        const assets_fields = ['lab_grown'];
        const std_fields = [];
        for (const key of assets_fields) {
            std_fields.push(get_std_field(key))
        }
        const result = await convert_diamond(
            { lab_grown: 'Y' },    // row
            [
                { key: 'lab_grown', values_map: { y: 1, n: 0 } }, // fields_map
            ],
            null,    
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "certificate_lab": "",
            "certificate_number": "",
            "pass": false,
            "lab_grown": 1,
            "original": {
              "lab_grown": "Y"
            }
        });
    });

});