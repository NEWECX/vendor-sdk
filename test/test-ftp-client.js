'use strict';

const chai = require('chai');
const node_path = require('path');

const { login, logout, close } = require('@samwen/ftp-client');
const configuration = require('../lib/configuration');

const download_data =  require('./download-data');

const {
    ftp_upload_all_files,
    ftp_upload_inventory,
    ftp_upload_assets,
    ftp_upload_asset,
} = require('../lib/ftp-client')

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --timeout 60000 --reporter spec test/test-ftp-client

describe('Test ftp-client', () => {

    before(async () => {
        await download_data();
    })
    
    it('test ftp_upload_all_files', async () => {
        await login(async () => {
            const data_path = node_path.join(__dirname, 'data');
            const result = await ftp_upload_all_files(data_path);
            //console.log(result);
            expect(result).has.property('inventory');
            expect(result.inventory.status).equals('OK');
            expect(result).has.property('assets');
            for (const item of result.assets) {
                expect(item).has.property('status');
                expect(item.status).equals('OK');
            }
            await logout();
        });
    });

    it('test ftp_upload_all_files without data dir', async () => {
        await login(async () => {
            configuration.set_data_dir(node_path.join(__dirname, 'data'));
            const result = await ftp_upload_all_files();
            //console.log(result);
            expect(result).has.property('inventory');
            expect(result.inventory.status).equals('OK');
            expect(result).has.property('assets');
            for (const item of result.assets) {
                expect(item).has.property('status');
                expect(item.status).equals('OK');
            }
            await logout();
        });
    });

    it('test ftp_upload_inventory', async () => {
        await login(async () => {
            const local_filepath = node_path.join(__dirname, 'data', 'inventory-new.csv');
            const result = await ftp_upload_inventory(local_filepath);
            //console.log(result);
            expect(result).has.property('status');
            expect(result.status).equals('OK');
            await logout();
        });
    });

    it('test ftp_upload_inventory without local_filepath', async () => {
        await login(async () => {
            configuration.set_data_dir(node_path.join(__dirname, 'data'));
            const result = await ftp_upload_inventory();
            //console.log(result);
            expect(result).has.property('status');
            expect(result.status).equals('OK');
            await logout();
        });
    });

    it('test ftp_upload_asset', async () => {
        await login(async () => {
            const local_filepath = node_path.join(__dirname, 'data', 'assets', 'GIA-1234567890', 'primary.jpg');
            const result = await ftp_upload_asset(local_filepath);
            //console.log(result);
            expect(result).has.property('status');
            expect(result.status).equals('OK');
            await logout();
        });
    });

    it('test ftp_upload_asset with certificate_lab and certificate_number', async () => {
        await login(async () => {
            const local_filepath = node_path.join(__dirname, 'data', 'somewhere', 'certificate.pdf');
            const result = await ftp_upload_asset(local_filepath, 'GIA', '2205729946');
            //console.log(result);
            expect(result).has.property('status');
            expect(result.status).equals('OK');
            await logout();
        });
    });

    it('test ftp_upload_assets', async () => {
        await login(async () => {
            const assets_path = node_path.join(__dirname, 'data', 'assets');
            const result = await ftp_upload_assets(assets_path);
            //console.log(result);
            for (const item of result) {
                expect(item).has.property('status');
                expect(item.status).equals('OK');
            }
            await logout();
        });
    });

    it('test ftp_upload_assets with certificate_lab and certificate_number', async () => {
        await login(async () => {
            const assets_path = node_path.join(__dirname, 'data', 'assets');
            const result = await ftp_upload_assets(assets_path, 'GIA', '1234567890');
            //console.log(result);
            for (const item of result) {
                expect(item).has.property('status');
                expect(item.status).equals('OK');
                expect(item.certificate_number).equals('1234567890');
            }
            await logout();
        });
    });

    after(() => {
        close();
    })
});