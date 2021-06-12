'use strict';

const chai = require('chai');
const configuration = require('../lib/configuration');
const download_assets = require('../lib/download-assets')
const fs = require('fs');

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha  --timeout 3000 --reporter spec test/test-download-assets

describe('Test download-assets', () => {
    
    it('test download-assets 1', async () => {

        const diamond = {
            "certificate_lab": "GIA",
            "certificate_number": "2205729946",
            "orig_certificate_url": "https://assets.newecx.com/template/assets/GIA-2205729946/certificate.pdf",
            "orig_primary_image_url": "https://assets.newecx.com/template/assets/GIA-2205729946/primary.jpg",
            "orig_proportions_url": "https://assets.newecx.com/template/assets/GIA-2205729946/cutprofile.jpg",
            "orig_plotting_url": "https://assets.newecx.com/template/assets/GIA-2205729946/plot.jpg",
            "orig_video_url": "https://assets.newecx.com/template/assets/GIA-2205729946/video.mp4",
            "orig_alt_image1_url": "",
            "orig_alt_image2_url": "",
            "orig_alt_image3_url": "",
            "orig_video1_url": "",
            "orig_video2_url": "",
        };

        const data_dir = __dirname + '/download';
        const diamond_path = data_dir + '/assets/GIA-2205729946';

        cleanup_folder(diamond_path);

        configuration.set_data_dir( data_dir );

        const result = await download_assets(diamond);
        //console.log(result);
        expect(result).to.be.deep.equal({
            certificate: { provided: 1, retrieved: 1 },
            primary_image: { provided: 1, retrieved: 1 },
            cutprofile: { provided: 1, retrieved: 1 },
            plot: { provided: 1, retrieved: 1 },
            alternate_image: { provided: 0, retrieved: 0 },
            primary_video: { provided: 1, retrieved: 1 },
            alternate_video: { provided: 0, retrieved: 0 }
        });
        const list = fs.readdirSync(diamond_path);
        expect(list.includes('certificate.pdf')).equals(true);
        expect(list.includes('cutprofile.jpg')).equals(true);
        expect(list.includes('plot.jpg')).equals(true);
        expect(list.includes('primary.jpg')).equals(true);
        expect(list.includes('video.mp4')).equals(true);
    });

    it('test download-assets 2', async () => {

        const diamond = {
            certificate_lab: 'IGI',
            certificate_number: '459108837',
            orig_certificate_url: 'https://assets.newecx.com/template/assets/IGI-459108837/certificate.pdf',
            orig_primary_image_url: 'https://assets.newecx.com/template/assets/IGI-459108837/primary.jpg',
            orig_proportions_url: '',
            orig_plotting_url: '',
            orig_video_url: 'https://assets.newecx.com/template/assets/IGI-459108837/video.mp4',
            orig_3d_360_url: 'https://labgrowndiamond.s3.amazonaws.com/Video/Viewer4.0/Vision360.html?d=459108837',
            orig_alt_image1_url: '',
            orig_alt_image2_url: '',
            orig_alt_image3_url: '',
            orig_video1_url: '',
            orig_video2_url: ''        };

        const data_dir = __dirname + '/download';
        const diamond_path = data_dir + '/assets/IGI-459108837';

        cleanup_folder(diamond_path);

        configuration.set_data_dir( data_dir );

        const result = await download_assets(diamond);
        //console.log(result);
        expect(result).to.be.deep.equal({
            certificate: { provided: 1, retrieved: 1 },
            primary_image: { provided: 1, retrieved: 1 },
            cutprofile: { provided: 0, retrieved: 0 },
            plot: { provided: 0, retrieved: 0 },
            alternate_image: { provided: 0, retrieved: 0 },
            primary_video: { provided: 1, retrieved: 1 },
            alternate_video: { provided: 0, retrieved: 0 }
        });
        const list = fs.readdirSync(diamond_path);
        expect(list.includes('certificate.pdf')).equals(true);
        expect(list.includes('primary.jpg')).equals(true);
        expect(list.includes('video.mp4')).equals(true);
    });

    it('test download-assets certificate without extension', async () => {

        const diamond = {
            "certificate_lab": "GIA",
            "certificate_number": "2205729946",
            "orig_certificate_url": "https://assets.newecx.com/template/assets/GIA-2205729946/certificate",
        };

        const data_dir = __dirname + '/download';
        const diamond_path = data_dir + '/assets/GIA-2205729946';

        cleanup_folder(diamond_path);

        configuration.set_data_dir( data_dir );

        const result = await download_assets(diamond);
        //console.log(result);
        expect(result).to.be.deep.equal({
            certificate: { provided: 1, retrieved: 1 },
            primary_image: { provided: 0, retrieved: 0 },
            cutprofile: { provided: 0, retrieved: 0 },
            plot: { provided: 0, retrieved: 0 },
            alternate_image: { provided: 0, retrieved: 0 },
            primary_video: { provided: 0, retrieved: 0 },
            alternate_video: { provided: 0, retrieved: 0 }
        });
        const list = fs.readdirSync(diamond_path);
        expect(list.includes('certificate.pdf')).equals(true);
    });
});

function cleanup_folder(folder_path) {
    if (fs.existsSync(folder_path)) {
        const list = fs.readdirSync(folder_path);
        for (const filename of list) {
            fs.unlinkSync(folder_path + '/' + filename);
        }
    }
}