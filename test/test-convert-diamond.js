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
        const result = await convert_diamond(0, 0, 
            {'stock#': 'vendor-sku', carat: '1.00'},    // row
            [{key: 'vendor_sku', field: 'stock#'}],     // fields_map
            [{key: 'vendor_sku', type: 'string', require: 'expected'}, {key: 'carat', type: 'number', require: 'required'}], // std_fields
            ['vendor_sku', 'carat'] // assets_fields
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
        const result = await convert_diamond(0, 0, 
            { lab: 'AAA' },    // row
            [
                { key: 'certificate_lab', field: 'lab'}, // fields_map
            ],     
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "row_no": 1,
            "pass": false,
            "timestamp": 0,
            "certificate_lab": "* AAA",
            "original": {
              "lab": "AAA"
            },
            "errors": [
              "row_no: 1 error, value(AAA) not mapped for lab",
              "row_no: 1 error, certificate_lab => lab => * AAA not in AGSL, DF, EGL, GCAL, GIA, GHI, GSI, HRD, IGI, IIDGR, PGS",
              'row_no: 1 error, missing required value for lab'
            ]
        });
    });

    it('test convert-diamond 3', async () => {
        const assets_fields = ['certificate_lab'];
        const std_fields = [];
        for (const key of assets_fields) {
            std_fields.push(get_std_field(key))
        }
        const result = await convert_diamond(0, 0, 
            { lab: 'AAA' },    // row
            [
                { key: 'certificate_lab', field: 'lab', values_map: { aaa: 'AGSL' }}, // fields_map
            ],     
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "row_no": 1,
            "pass": true,
            "timestamp": 0,
            "certificate_lab": "AGSL",
            "original": {
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
        const result = await convert_diamond(0, 0, 
            { lab: '' },    // row
            [
                { key: 'certificate_lab', field: 'lab' }, // fields_map
            ],     
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "row_no": 1,
            "pass": false,
            "timestamp": 0,
            "certificate_lab": "*",
            "original": {
              "lab": ""
            },
            "errors": [
              "row_no: 1 error, missing required value for lab"
            ]
        });
    });

    it('test convert-diamond 5', async () => {
        const assets_fields = ['certificate_lab'];
        const std_fields = [];
        for (const key of assets_fields) {
            std_fields.push(get_std_field(key))
        }
        const result = await convert_diamond(0, 0, 
            { lab: '' },    // row
            [
                { key: 'certificate_lab', field: 'lab', default_value: 'GIA'}, // fields_map
            ],     
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "row_no": 1,
            "pass": true,
            "timestamp": 0,
            "certificate_lab": "GIA",
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
        const result = await convert_diamond(0, 0, 
            { lab_grown: '' },    // row
            [
                { key: 'lab_grown'}, // fields_map
            ],     
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "row_no": 1,
            "pass": false,
            "timestamp": 0,
            "lab_grown": "*",
            "original": {
              "lab_grown": ""
            },
            "errors": [
              "row_no: 1 error, missing required value for lab_grown"
            ]
        });
    });

    it('test convert-diamond 7', async () => {
        const assets_fields = ['lab_grown'];
        const std_fields = [];
        for (const key of assets_fields) {
            std_fields.push(get_std_field(key))
        }
        const result = await convert_diamond(0, 0, 
            { lab_grown: '' },    // row
            [
                { key: 'lab_grown', default_value: 1 }, // fields_map
            ],     
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "row_no": 1,
            "pass": true,
            "timestamp": 0,
            "lab_grown": 1,
            "original": {
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
        const result = await convert_diamond(0, 0, 
            { lab_grown: 'Y' },    // row
            [
                { key: 'lab_grown', values_map: { y: 1, n: 0 } }, // fields_map
            ],     
            std_fields,
            assets_fields,
        );
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result).to.be.deep.equals({
            "row_no": 1,
            "pass": true,
            "timestamp": 0,
            "lab_grown": 1,
            "original": {
              "lab_grown": "Y"
            }
        });
    });

});