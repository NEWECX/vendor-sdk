'use strict';

const chai = require('chai');
const node_path = require('path');

const {
    api_get_inventory_info,
    api_get_header,
    api_get_fields_map,
    api_update_header,
    api_update_fields_map,
    api_get_asset_info,
    api_get_report,
} = require('../lib/api-client')

const download_data =  require('./download-data');

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --timeout 100000 --reporter spec test/test-api-client1

const old_headers = [ 'sku', 'carat', 'shipping_availability', 'certificate_lab', 'certificate_number', 'orig_certificate_url', 'shape', 'cost', 'clarity', 'color', 'cut', 'culet', 'polish', 'depth', 'depth_percent', 'width', 'length', 'length_width_ratio', 'fluorescence', 'girdle', 'symmetry', 'table_percent', 'key_to_symbols', 'crown_angle', 'location', 'lab_grown', 'orig_primary_image_url', 'orig_proportions_diagram', 'orig_plotting_diagram', 'orig_video_url', 'orig_alternate_image1_url', 'orig_alternate_image2_url', 'orig_alternate_image3_url', 'orig_video1_url', 'orig_video2_url'];

const old_fields_map = { certificate_lab: 'certificate_lab', certificate_number: 'certificate_number'};

const new_headers = [ 'stock#', 'carat', 'shipping_availability', 'certificate_lab', 'certificate_number', 'orig_certificate_url', 'shape', 'cost', 'clarity', 'color', 'cut', 'culet', 'polish', 'depth', 'depth_percent', 'width', 'length', 'length_width_ratio', 'fluorescence', 'girdle', 'symmetry', 'table_percent', 'key_to_symbols', 'crown_angle', 'location', 'lab_grown', 'orig_primary_image_url', 'orig_proportions_diagram', 'orig_plotting_diagram', 'orig_video_url', 'orig_alternate_image1_url', 'orig_alternate_image2_url', 'orig_alternate_image3_url', 'orig_video1_url', 'orig_video2_url'];

const new_fields_map = { sku: 'stock#', certificate_lab: 'certificate_lab', certificate_number: 'certificate_number'};

describe('Test api-client 1', () => {

    before(async () => {
        await download_data();
    })

    it('test api_get_report', async () => {
        const data = await api_get_report();
        expect(Object.keys(data).length).greaterThan(0);
        //console.log('get_report', data);
    });

    it('test api_get_inventory_info', async () => {
        const data = await api_get_inventory_info();
        expect(Object.keys(data).length).greaterThan(0);
        if (Object.keys(data).length > 3) {
            expect(data).has.property('md5');
        } else {
            console.log('get_inventory_info', data);
        }
    });

    it('test api_get_header', async () => {
        const data = await api_get_header();
        expect(Object.keys(data).length).greaterThan(0);
        //console.log('get_header', data);
    });

    it('test api_get_fields_map', async () => {
        const data = await api_get_fields_map();
        expect(Object.keys(data).length).greaterThan(0);
        //console.log('get_fields_map', data);
    });

    it('test api_update_header', async () => {
        const data = await api_update_header(new_headers);
        expect(Object.keys(data).length).greaterThan(0);
        //console.log('update_header', data);
        expect(data.status).equals('OK');
        const data_new = await api_get_header();
        expect(data_new).to.be.deep.equals(new_headers);
        await api_update_header(old_headers);
    });

    it('test api_update_fields_map', async () => {
        const data = await api_update_fields_map(new_fields_map);
        expect(Object.keys(data).length).greaterThan(0);
        //console.log('update_fields_map', data);
        expect(data.status).equals('OK');
        const data_new = await api_get_fields_map();
        expect(data_new).to.be.deep.equals(new_fields_map)
        await api_update_fields_map(old_fields_map);
    });

    it('test get_asset_info with LAB-CERT# in filepath', async () => {
        const local_filepath = node_path.join(__dirname, 'data', 'assets', 'GIA-2205729946', 'primary.jpg');
        const data = await api_get_asset_info(local_filepath);
        expect(Object.keys(data).length).greaterThan(0);
        if (Object.keys(data).length > 3) {
            expect(data).has.property('md5');
        } else {
            console.log('get_asset_info(1)', data);
        }
    });

    it('test get_asset_info with certificate_lab and certificate_number', async () => {
        const local_filepath = node_path.join(__dirname, 'data', 'somewhere', 'certificate.pdf');
        const data = await api_get_asset_info(local_filepath, 'GIA', '2205729946');
        expect(Object.keys(data).length).greaterThan(0);
        if (Object.keys(data).length > 3) {
            expect(data).has.property('md5');
        } else {
            console.log('get_asset_info(2)', data);
        }
    });

});