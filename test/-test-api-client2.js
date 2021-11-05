'use strict';

const chai = require('chai');
const node_path = require('path');
const configuration = require('../lib/configuration');

const download_data =  require('./download-data');

const {
    api_upload_inventory,
    api_upload_asset,
    api_upload_assets,
} = require('../lib/api-client')

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --timeout 100000 --reporter spec test/test-api-client2

describe('Test api-client 2', () => {

    before(async () => {
        await download_data();
    })
    
    it('test api_upload_inventory', async () => {
        const local_filepath = node_path.join(__dirname, 'data', 'inventory.csv');
        const data = await api_upload_inventory(local_filepath);
        console.log('upload_inventory(1)', data);
        expect(data).has.property('status');
        expect(data.status).equals('OK');
    });

    it('test api_upload_inventory without filename', async () => {
        configuration.set_data_directory(node_path.join(__dirname, 'data'));
        const data = await api_upload_inventory();
        //console.log('upload_inventory(2)', data);
        expect(data).has.property('status');
        expect(data.status).equals('OK');
    });

    it('test upload_asset with LAB-CERT# in filepath', async () => {
        const local_filepath = node_path.join(__dirname, 'data', 'assets', 'GIA-1234567890', 'primary.jpg');
        const data = await api_upload_asset(local_filepath);
        //console.log('upload_asset(1)', data);
        expect(data).has.property('status');
        expect(data.status).equals('OK');
    });

    it('test upload_asset with certificate_lab and certificate_number', async () => {
        const local_filepath = node_path.join(__dirname, 'data', 'somewhere', 'certificate.pdf');
        const data = await api_upload_asset(local_filepath, 'GIA', '2205729946');
        //console.log('upload_asset(2)', data);
        expect(data).has.property('status');
        expect(data.status).equals('OK');
    });

    it('test api_upload_assets', async () => {
        const assets_path = node_path.join(__dirname, 'data', 'assets');
        const results = await api_upload_assets(assets_path);
        //console.log('upload_assets(1)', results);
        for (const data of results) {
            expect(data).has.property('status');
            expect(data.status).equals('OK');
        }
    });

    it('test api_upload_assets without assets path', async () => {
        configuration.set_data_directory(node_path.join(__dirname, 'data'));
        const results = await api_upload_assets();
        //console.log('upload_assets(2)', results);
        for (const data of results) {
            expect(data).has.property('status');
            expect(data.status).equals('OK');
        }
    });

});