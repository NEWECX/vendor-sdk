'use strict';

const values_maps = require('./3-values-maps');

// version '2021-06-01'
//
const std_fields = [
	{
		key: 'vendor_sku',
		description: 'vendor internal sku or stock#',
		require: 'expected', 
		type: 'string'
	},
	{
		key: 'carat',
		description: 'carat weight',
		require: 'required', 
		type: 'number'
	},
	{
		key: 'shipping_availability',
		description: 'memo field, please filter available ones to submit',
		require: 'optional', 
		type: 'string'
	},
	{
		key: 'certificate_lab',
		values_map: values_maps.certificate_lab.reverse_map,
		default_value: 'GIA',
		description: 'certificate lab',
		require: 'required', 
		type: 'string',
		values: values_maps.certificate_lab.values
	},
	{
		key: 'certificate_number',
		description: 'certificate number',
		require: 'required', 
		type: 'string'
	},
	{
		key: 'orig_certificate_url',
		description: 'url for certificate.pdf (preferred) or  certificate.jpg',
		require: 'expected', 
		type: 'string'
	},
	{
		key: 'shape',
		values_map: values_maps.shape.reverse_map,
		description: 'shape',
		require: 'required', 
		type: 'string',
		values: values_maps.shape.values, 
	},
	{
		key: 'cost',
		description: 'the cost of the whole stone, NOT cost per carat',
		require: 'required', 
		type: 'number'
	},
	{
		key: 'clarity', 
		values_map: values_maps.clarity.reverse_map,
		description: 'clarity',
		require: 'required', 
		type: 'string',
		values: values_maps.clarity.values, 
	},
	{
		key: 'color', 
		values_map: values_maps.color.reverse_map,
		description: 'color',
		require: 'required', 
		type: 'string',
		values: values_maps.color.values,
	},
	{
		key: 'cut', 
		values_map: values_maps.cut.reverse_map,
		description: 'cut',
		require: 'required', 
		type: 'string',
		values: values_maps.cut.values, 
	},
	{
		key: 'culet', 
		values_map: values_maps.culet.reverse_map,
		description: 'culet',
		require: 'required', 
		type: 'string',
		values: values_maps.culet.values, 
	},
	{
		key: 'polish', 
		values_map: values_maps.polish.reverse_map,
		description: 'polish',
		require: 'required', 
		type: 'string',
		values: values_maps.polish.values,
	},
	{
		key: 'depth',
		description: 'depth in mm',
		require: 'required', 
		type: 'number'
	},
	{
		key: 'depth_percent',
		description: 'depth percent',
		require: 'required', 
		type: 'number'
	},
	{
		key: 'width',
		description: 'width in mm',
		require: 'required', 
		type: 'number'
	},
	{
		key: 'length',
		description: 'length in mm',
		require: 'required', 
		type: 'number'
	},
	{
		key: 'length_width_ratio',
		description: 'length width ratio',
		require: 'optional', 
		type: 'number'
	},
	{
		key: 'fluorescence', 
		values_map: values_maps.fluorescence.reverse_map,
		description: 'fluorescence',
		require: 'required', 
		type: 'string',
		values: values_maps.fluorescence.values,
	},
	{
		key: 'girdle',
		description: 'girdle',
		require: 'optional', 
		type: 'string'
	},
	{
		key: 'girdle_percent',
		description: 'girdle percent',
		require: 'optional', 
		type: 'number'
	},
	{
		key: 'symmetry', 
		values_map: values_maps.symmetry.reverse_map,
		description: 'symmetry',
		require: 'required', 
		type: 'string',
		values: values_maps.symmetry.values,
	},
	{
		key: 'table_percent',
		description: 'table percent',
		require: 'required', 
		type: 'number'
	},
	{
		key: 'key_to_symbols',
		description: 'key to symbols',
		require: 'optional', 
		type: 'string'
	},
	{	
		key: 'crown_height',
		description: 'crown height',
		require: 'optional', 
		type: 'number'
	},
	{	
		key: 'crown_angle',
		description: 'crown angle',
		require: 'optional', 
		type: 'number'
	},
	{
		key: 'pavilion_depth',
		description: 'pavilion depth',
		require: 'optional', 
		type: 'number'
	},
	{
		key: 'pavilion_angle',
		description: 'pavilion angle',
		require: 'optional', 
		type: 'number'
	},
	{
		key: 'location',
		description: 'location of the diamond',
		require: 'optional', 
		type: 'string'	
	},
	{
		key: 'lab_grown',
		values_map: values_maps.lab_grown.reverse_map,
		default_value: 0,
		description: 'lab grown or earth grown',
		require: 'required', 
		type: 'number',
		values: values_maps.lab_grown.values,
	},
	{
		key: 'orig_primary_image_url',
		description: 'url for primary image primary.jpg',
		require: 'expected', 
		type: 'string'
	},
	{
		key: 'orig_proportions_url',
		description: 'url for proportions diagram cutprofile.jpg',
		require: 'optional', 
		type: 'string'
	},
	{
		key: 'orig_plotting_url',
		description: 'url for plotting diagram plot.jpg',
		require: 'optional', 
		type: 'string'
	},
	{
		key: 'orig_video_url',
		description: 'url for video video.mp4',
		require: 'expected', 
		type: 'string'
	},
	{
		key: 'orig_3d_360_url',
		description: 'url for 3D 360 vision url',
		require: 'optional', 
		type: 'string'
	},
	{
		key: 'orig_alt_image1_url',
		description: 'url for additional image image1.jpg',
		require: 'optional', 
		type: 'string'
	},
	{
		key: 'orig_alt_image2_url',
		description: 'url for additional image image2.jpg',
		require: 'optional', 
		type: 'string'
	},
	{
		key: 'orig_alt_image3_url',
		description: 'url for additional image image3.jpg',
		require: 'optional', 
		type: 'string'
	},
	{
		key: 'orig_video1_url',
		description: 'url for additional video video1.mp4',
		require: 'optional', 
		type: 'string'
	},
	{
		key: 'orig_video2_url',
		description: 'url for additional video video2.mp4',
		require: 'optional', 
		type: 'string'
	}
];

module.exports = std_fields;
