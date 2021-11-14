'use strict';

const chai = require('chai');
const node_path = require('path');
const {set_data_directory} = require('../lib').util;
const { api_upload_all_files } = require('../lib').core;

const download_data =  require('./download-data');

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --timeout 100000 --reporter spec test/test-api-client3

describe('Test api-client 3', () => {

    before(async () => {
        await download_data();
    })
    
    it('test api_upload_all_files', async () => {
        const data_dir = node_path.join(__dirname, 'data');
        const data = await api_upload_all_files(data_dir);
        //console.log('api_upload_all_files(1)', data);
        expect(data).has.property('inventory');
        expect(data.inventory).has.property('status');
        expect(data.inventory.status).equals('OK');
        expect(data).has.property('assets');
        for (const asset of data.assets) {
            expect(asset.status).equals('OK');
        }
    });

    it('test api_upload_all_files without data_dir', async () => {
        set_data_directory(node_path.join(__dirname, 'data'));
        const data = await api_upload_all_files();
        //console.log('api_upload_all_files(2)', data);
        expect(data).has.property('inventory');
        expect(data.inventory).has.property('status');
        expect(data.inventory.status).equals('OK');
        expect(data).has.property('assets');
        for (const asset of data.assets) {
            expect(asset.status).equals('OK');
        }
    });

});