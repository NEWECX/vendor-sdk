'use strict';

const filename_values = [
    'certificate.jpg', 
    'certificate.pdf', 
    'primary.jpg', 
    'cutprofile.jpg', 
    'plot.jpg', 
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'video.mp4', 
    'video1.mp4',
    'video2.mp4',
];

const assets_filename_map = {
    orig_certificate_url: ['certificate.jpg', 'certificate.pdf', 'certificate.png'], 
    orig_primary_image_url: ['primary.jpg', 'primary.png'], 
    orig_proportions_url: ['cutprofile.jpg', 'cutprofile.png'], 
    orig_plotting_url: ['plot.jpg', 'plot.png'], 
    orig_alt_image1_url: ['image1.jpg', 'image1.png'],
    orig_alt_image2_url: ['image2.jpg', 'image2.png'],
    orig_alt_image3_url: ['image3.jpg', 'image3.png'],
    orig_video_url: ['video.mp4'], 
    orig_video1_url: ['video1.mp4'],
    orig_video2_url: ['video2.mp4'],
};

const assets_stats_types = {
    orig_certificate_url: 'certificate', 
    orig_primary_image_url: 'primary_image', 
    orig_video_url: 'primary_video',
    orig_3d_360_url: '3d_360',
    orig_proportions_url: 'cutprofile', 
    orig_plotting_url: 'plot', 
    orig_alt_image1_url: 'alternate_image',
    orig_alt_image2_url: 'alternate_image',
    orig_alt_image3_url: 'alternate_image',
    orig_video1_url: 'alternate_video',
    orig_video2_url: 'alternate_video',
};

module.exports = {
	filename_values,
	assets_filename_map,
	assets_stats_types
};