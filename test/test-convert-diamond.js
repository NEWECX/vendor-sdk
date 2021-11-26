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
// stage_env=test mocha --reporter spec test/test-convert-diamond 

describe('Test convert-diamond', () => {

    it('test convert-diamond 1', async () => {
        const row = {'stock#': 'vendor-sku', carat: '1.00', certificate_lab: 'AGSL', certificate_number: '12345678'};
        const fields_map = [{key: 'vendor_sku', field: 'stock#'}];
        const options = undefined;
        const std_fields = [ 
            {key: 'vendor_sku', type: 'string', require: 'expected'}, 
            {key: 'carat', type: 'number', require: 'required'},
            {key: 'certificate_lab', type: 'string', require: 'required'}, 
            {key: 'certificate_number', type: 'string', require: 'required'}
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields); 
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "vendor_sku": "vendor-sku",
            "carat": 1,
            "certificate_lab": "AGSL",
            "certificate_number": "12345678",
            "original": {
              "stock#": "vendor-sku",
              "carat": "1.00",
              "certificate_lab": "AGSL",
              "certificate_number": "12345678"
            }
        });

    });

    it('test convert-diamond 2', async () => {
        const row = {'stock#': 'vendor-sku', carat: '1.00', certificate_lab: 'AGSL', certificate_number: '12345678'};
        const fields_map = [{key: 'vendor_sku', field: 'stock#'}];
        const options = undefined;
        const std_fields = [ 
            {key: 'vendor_sku', type: 'string', require: 'expected'}, 
            {key: 'carat', type: 'number', require: 'required'},
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields); 
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "vendor_sku": "vendor-sku",
            "carat": 1,
            "original": {
              "stock#": "vendor-sku",
              "carat": "1.00",
              "certificate_lab": "AGSL",
              "certificate_number": "12345678"
            }
        });

    });

    it('test convert-diamond 3', async () => {
        const row = {carat: '2.00', cost: '2000', cost_per_carat: '1000'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [ 
            {key: 'carat', type: 'number', require: 'required'},
            {key: 'cost', type: 'number', require: 'required'},
            {key: 'cost_per_carat', type: 'number', require: 'required'},
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields); 
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "carat": 2,
            "cost": 2000,
            "cost_per_carat": 1000,
            "original": {
              "carat": "2.00",
              "cost": "2000",
              "cost_per_carat": "1000"
            }
        });
    });

    it('test convert-diamond 4', async () => {
        const row = {carat: '2.00', cost: '2000', cost_per_carat: '1006'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [ 
            {key: 'carat', type: 'number', require: 'required'},
            {key: 'cost', type: 'number', require: 'required'},
            {key: 'cost_per_carat', type: 'number', require: 'required'},
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields); 
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(false);
        expect(result).to.be.deep.equals({
            "pass": false,
            "carat": 2,
            "cost": '',
            "cost_per_carat": '',
            "original": {
              "carat": "2.00",
              "cost": "2000",
              "cost_per_carat": "1006"
            },
            "errors": [
              {
                "field": "cost",
                "error": "cost (2000.00) not agrees with carat * cost_per_carat (2012.00), difference 12"
              }
            ]
        });
    });

    it('test convert-diamond 5', async () => {
        const row = {carat: '2.00', cost: '2000', cost_per_carat: '1004'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [ 
            {key: 'carat', type: 'number', require: 'required'},
            {key: 'cost', type: 'number', require: 'required'},
            {key: 'cost_per_carat', type: 'number', require: 'required'},
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields); 
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "carat": 2,
            "cost": 2000,
            "cost_per_carat": 1000,
            "original": {
              "carat": "2.00",
              "cost": "2000",
              "cost_per_carat": "1004"
            },
            "errors": [
              {
                "field": "cost",
                "warning": "difference between cost (2000.00) and carat * cost_per_carat (2008.00) is 8, select the lower one"
              }
            ]
        });
    });

    it('test convert-diamond 6', async () => {
        const row = {carat: '2.00', cost: '2000'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [ 
            {key: 'carat', type: 'number', require: 'required'},
            {key: 'cost', type: 'number', require: 'required'},
            {key: 'cost_per_carat', type: 'number', require: 'required'},
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields); 
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(false);
        expect(result).to.be.deep.equals({
            "pass": false,
            "carat": 2,
            "cost": 2000,
            "cost_per_carat": "",
            "original": {
              "carat": "2.00",
              "cost": "2000"
            },
            "errors": [
              {
                "field": "cost_per_carat",
                "error": "required key, cost_per_carat => , empty value"
              }
            ]
        });
    });

    it('test convert-diamond 7', async () => {
        const row = {carat: '2.00', cost: '2000'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [ 
            {key: 'carat', type: 'number', require: 'required'},
            {key: 'cost', type: 'number', require: 'required'},
            {key: 'cost_per_carat', type: 'number', transform: (x) => x.cost / x.carat, require: 'required'},
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields); 
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "carat": 2,
            "cost": 2000,
            "cost_per_carat": 1000,
            "original": {
              "carat": "2.00",
              "cost": "2000",
            }
        });
    });
    
    it('test convert-diamond 8', async () => {
        const row = { lab: 'AAA' };
        const fields_map = [
            { key: 'certificate_lab', field: 'lab'}, // fields_map
        ];
        const options = undefined;
        const std_fields = [{key: 'certificate_lab'}];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            certificate_lab: 'AAA',
            "original": {
              "lab": "AAA"
            }
          });
    })

    it('test convert-diamond 9', async () => {
        const row = { lab: 'AAA' };
        const fields_map = [
            { key: 'certificate_lab', field: 'lab'}, // fields_map
        ];
        const options = undefined;
        const std_fields = [{key: 'certificate_lab', values: ['GIA'], require: 'required'}];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(false);
        expect(result).to.be.deep.equals({
            "pass": false,
            "certificate_lab": "",
            "original": {
              "lab": "AAA"
            },
            "errors": [
              {
                "field": "lab",
                "error": "required key, certificate_lab => AAA, not in GIA"
              }
            ]
          });
    })

    it('test convert-diamond 10', async () => {
        const row = { lab: 'AAA' };
        const fields_map = [
            { key: 'certificate_lab', field: 'lab', values_map: {AAA: 'GIA'}}, // fields_map
        ];
        const options = undefined;
        const std_fields = [{key: 'certificate_lab', values: ['GIA'], require: 'required'}];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "certificate_lab": "GIA",
            "original": {
              "lab": "AAA"
            }
          });
    })

    it('test convert-diamond 11', async () => {
        const row = { lab: 'AAA', cert: 'GIA12345' };
        const fields_map = [ 
            { key: 'certificate_lab', field: 'lab', values_map: {AAA: 'GIA'}}, 
            { key: 'certificate_number', field: 'cert'}, 
        ];
        const options = undefined;
        const std_fields = [
            {key: 'certificate_lab', values: ['GIA'], require: 'required'},
            {key: 'certificate_number', require: 'required'}
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "certificate_lab": "GIA",
            "certificate_number": "12345",
            "original": {
              "lab": "AAA",
              "cert": "GIA12345"
            }
          });
    })


    it('test convert-diamond 12', async () => {
        const row = { lab: 'AAA', cert: 'none' };
        const fields_map = [ 
            { key: 'certificate_lab', field: 'lab', values_map: {AAA: 'GIA'}}, 
            { key: 'certificate_number', field: 'cert'}, 
        ];
        const options = undefined;
        const std_fields = [
            {key: 'certificate_lab', values: ['GIA'], require: 'required'},
            {key: 'certificate_number', require: 'required'}
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(false);
        expect(result).to.be.deep.equals({
          "pass": false,
          "certificate_lab": "GIA",
          "certificate_number": "",
          "original": {
            "lab": "AAA",
            "cert": "none"
          },
          "errors": [
            {
              "field": "cert",
              "error": "invalid certificate, invalid certificate number"
            }
          ]
        });
    })

    it('test convert-diamond 13', async () => {
        const row = { lab: 'AAA', cert: 'none' };
        const fields_map = [ 
            { key: 'certificate_lab', field: 'lab'}, 
            { key: 'certificate_number', field: 'cert'}, 
        ];
        const options = undefined;
        const std_fields = [
            {key: 'certificate_lab', values: ['GIA'], require: 'required'},
            {key: 'certificate_number', require: 'required'}
        ];
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(false);
        expect(result).to.be.deep.equals({
          "pass": false,
          "certificate_lab": "",
          "certificate_number": "",
          "original": {
            "lab": "AAA",
            "cert": "none"
          },
          "errors": [
            {
              "field": "lab",
              "error": "required key, certificate_lab => AAA, not in GIA"
            },
            {
              "field": "cert",
              "error": "invalid certificate, invalid certificate lab, not in GIA, AGSL, HRD, IGI, GCAL, DF, EGL, GHI, GSI, IIDGR, PGS, BSC, JGS, WGI, EDR, LGC"
            }
          ]
        });
    })

    it('test convert-diamond 14', async () => {
        const row = { color: 'G' };
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['color', 'fancy_color', 'fancy_color_intensity', 'fancy_color_overtone']) {
            std_fields.push(get_std_field(key))
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "color": "G",
            "fancy_color": "",
            "fancy_color_intensity": "",
            "fancy_color_overtone": "",
            "original": {
              "color": "G"
            }
          });
    })

    it('test convert-diamond 15', async () => {
        const row = { color: 'FIY' };
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['color', 'fancy_color', 'fancy_color_intensity', 'fancy_color_overtone']) {
            std_fields.push(get_std_field(key))
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "color": "FIY",
            "fancy_color": "YELLOW",
            "fancy_color_intensity": "FI",
            "fancy_color_overtone": "",
            "original": {
              "color": "FIY"
            }
          });
    })

    it('test convert-diamond 16', async () => {
        const row = { color: 'Fancy Light Yellow' };
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['color', 'fancy_color', 'fancy_color_intensity', 'fancy_color_overtone']) {
            std_fields.push(get_std_field(key))
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "color": "FLY",
            "fancy_color": "YELLOW",
            "fancy_color_intensity": "FL",
            "fancy_color_overtone": "",
            "original": {
              "color": "Fancy Light Yellow"
            }
          });
    })

    it('test convert-diamond 17', async () => {
        const row = { color: 'Fancy Orangish Light Yellow' };
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['color', 'fancy_color', 'fancy_color_intensity', 'fancy_color_overtone']) {
            std_fields.push(get_std_field(key))
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "color": "FLY",
            "fancy_color": "YELLOW",
            "fancy_color_intensity": "FL",
            "fancy_color_overtone": "ORANGE",
            "original": {
              "color": "Fancy Orangish Light Yellow"
            }
          });
    })

    it('test convert-diamond 18', async () => {
        const row = { color: 'Fancy Orangish Color' };
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['color', 'fancy_color', 'fancy_color_intensity', 'fancy_color_overtone']) {
            std_fields.push(get_std_field(key))
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "color": "FO",
            "fancy_color": "ORANGE",
            "fancy_color_intensity": "FA",
            "fancy_color_overtone": "ORANGE",
            "original": {
              "color": "Fancy Orangish Color"
            }
          });
    })

    it('test convert-diamond 19', async () => {
        const row = { };
        const fields_map = [ {key: 'lab_grown', default_value: 1}];
        const options = undefined;
        const std_fields = [];
        std_fields.push(get_std_field('lab_grown'))
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "lab_grown": 1,
            "original": {
            }
          });
    })
    
    it('test convert-diamond 20', async () => {
        const row = { length: '3', width: '3', depth: '2'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['length', 'width', 'depth', 'measurements']) {
            std_fields.push(get_std_field(key))
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "length": 3,
            "width": 3,
            "depth": 2,
            "measurements": "3.00 - 3.00 x 2.00",
            "original": {
              "length": "3",
              "width": "3",
              "depth": "2"
            }
          });
    })

    it('test convert-diamond 21', async () => {
        const row = { measurements: '3.00 - 3.00 x 2.00'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['length', 'width', 'depth', 'measurements']) {
            std_fields.push(get_std_field(key))
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "length": 3,
            "width": 3,
            "depth": 2,
            "measurements": "3.00 - 3.00 x 2.00",
            "original": {
              "measurements": "3.00 - 3.00 x 2.00"
            }
          });
    })

    it('test convert-diamond 22', async () => {
        const row = { measurements: '3.00 - 4.00 x 2.00'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['length', 'width', 'depth', 'measurements']) {
            std_fields.push(get_std_field(key))
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "length": 4,
            "width": 3,
            "depth": 2,
            "measurements": "4.00 - 3.00 x 2.00",
            "original": {
              "measurements": "3.00 - 4.00 x 2.00"
            }
          });
    })

    it('test convert-diamond 23', async () => {
        const row = { length: '3', width: '3'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['length', 'width', 'depth', 'measurements']) {
            std_fields.push(get_std_field(key))
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(false);
        expect(result).to.be.deep.equals({
            "pass": false,
            "length": 3,
            "width": 3,
            "depth": "",
            "measurements": "",
            "original": {
              "length": "3",
              "width": "3"
            },
            "errors": [
              {
                "field": "depth",
                "error": "required key, depth => , empty value"
              }
            ]
          });
    })

    it('test convert-diamond 24', async () => {
        const row = { length: '3', width: '3', measurements: '3.00 - 3.00 x 2.00'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['length', 'width', 'depth', 'measurements']) {
            std_fields.push(get_std_field(key))
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "length": 3,
            "width": 3,
            "depth": 2,
            "measurements": "3.00 - 3.00 x 2.00",
            "original": {
              "length": "3",
              "width": "3",
              "measurements": "3.00 - 3.00 x 2.00"
            }
          });
    })

    it('test convert-diamond 25', async () => {
        const row = { length: '3', width: '1', measurements: '3.00 - 3.00 x 2.00'};
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        for (const key of ['length', 'width', 'depth', 'measurements']) {
            std_fields.push(get_std_field(key));
        }
        const asset_fields = [];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "length": 3,
            "width": 1,
            "depth": 2,
            "measurements": "3.00 - 1.00 x 2.00",
            "original": {
              "length": "3",
              "width": "1",
              "measurements": "3.00 - 3.00 x 2.00"
            }
          });
    })

    it('test convert-diamond 26', async () => {
        const row = { orig_certificate_url: 'https://assets.newecx.com/template/assets/GIA-2205729946/certificate.pdf' };
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        std_fields.push(get_std_field('orig_certificate_url'));
        const asset_fields = ['orig_certificate_url'];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "orig_certificate_url": "https://assets.newecx.com/template/assets/GIA-2205729946/certificate.pdf",
            "original": {
              "orig_certificate_url": "https://assets.newecx.com/template/assets/GIA-2205729946/certificate.pdf"
            }
          });
    })

    it('test convert-diamond 27', async () => {
        const row = { orig_certificate_url: 'ftp://assets.newecx.com/template/assets/GIA-2205729946/certificate.pdf' };
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        std_fields.push(get_std_field('orig_certificate_url'));
        const asset_fields = ['orig_certificate_url'];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
          "pass": true,
          "orig_certificate_url": "",
          "original": {
            "orig_certificate_url": "ftp://assets.newecx.com/template/assets/GIA-2205729946/certificate.pdf"
          },
          "errors": [
            {
              "field": "orig_certificate_url",
              "warning": "expected key, orig_certificate_url => ftp://assets.newecx.com/template/assets/GIA-2205729946/certificate.pdf, invalid url"
            }
          ]
        });
    })

    it('test convert-diamond 28', async () => {
        const row = { orig_certificate_url: 'assets.newecx.com/template/assets/GIA-2205729946/certificate.pdf' };
        const fields_map = [];
        const options = undefined;
        const std_fields = [];
        std_fields.push(get_std_field('orig_certificate_url'));
        const asset_fields = ['orig_certificate_url'];
        const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
        //console.log('result', JSON.stringify(result, null, 2));
        expect(result.pass).equals(true);
        expect(result).to.be.deep.equals({
            "pass": true,
            "orig_certificate_url": "",
            "original": {
              "orig_certificate_url": "assets.newecx.com/template/assets/GIA-2205729946/certificate.pdf"
            },
            "errors": [
              {
                "field": "orig_certificate_url",
                "warning": "expected key, orig_certificate_url => assets.newecx.com/template/assets/GIA-2205729946/certificate.pdf, invalid url"
              }
            ]
          });
    })

    it('test convert-diamond 29', async () => {
      const row = { color: 'W-Z' };
      const fields_map = [];
      const options = undefined;
      const std_fields = [];
      for (const key of ['color']) {
          std_fields.push(get_std_field(key))
      }
      const asset_fields = [];
      const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
      //console.log('result', JSON.stringify(result, null, 2));
      expect(result.pass).equals(true);
      expect(result).to.be.deep.equals({
        "pass": true,
        "color": "Y",
        "original": {
          "color": "W-Z"
        }
      });
  })

  it('test convert-diamond 30', async () => {
    const row = { color: 'FVYO' };
    const fields_map = [];
    const options = undefined;
    const std_fields = [];
    for (const key of ['color', 'fancy_color', 'fancy_color_intensity', 'fancy_color_overtone']) {
        std_fields.push(get_std_field(key))
    }
    const asset_fields = [];
    const result = await convert_diamond(row, fields_map, options, std_fields, asset_fields);
    //console.log('result', JSON.stringify(result, null, 2));
    expect(result.pass).equals(true);
    expect(result).to.be.deep.equals({
      "pass": true,
      "color": "FVY",
      "fancy_color": "YELLOW",
      "fancy_color_intensity": "FV",
      "fancy_color_overtone": "ORANGE",
      "original": {
        "color": "FVYO"
      }
    });
  })

});