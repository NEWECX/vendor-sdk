'use strict';

const { values_maps } = require('@ritani/diamond-glossary');

// version '2021-06-01'
//
const std_fields = [
	{
		key: 'vendor_sku',
		description: 'vendor internal sku or stock#',
		require: 'expected', 
		transform: (x) => [x.certificate_lab, x.certificate_number].join('-'),
		reducible: (x) => reducible(x, ['certificate_lab', 'certificate_number']),
		type: 'string',
		match: [{in: ['sku', 'stock', '^id']}]
	},
	{
		key: 'carat',
		description: 'carat weight',
		require: 'required', 
		type: 'number',
		match: [{in: ['^cara', '^wei'] }]
	},
	{
		key: 'shipping_availability',
		description: 'memo field, please filter available ones to submit',
		require: 'optional', 
		type: 'string',
		match: [{in: ['avai'] }]
	},
	{
		key: 'certificate_lab',
		values_map: combine_map_and_reverse_map('certificate_lab'),
		//default_value: 'GIA',
		description: 'certificate lab',
		require: 'required', 
		type: 'string',
		values: values_maps.certificate_lab.values,
		match: [{in: ['lab', 'cert.*type']}, {nin: ['grown']}]
	},
	{
		key: 'certificate_number',
		description: 'certificate number',
		require: 'required', 
		type: 'string',
		match: [{ in: ['cert']}, {nin: ['lab', 'type'] }]
	},
	{
		key: 'orig_certificate_url',
		description: 'url for certificate.pdf (preferred) or  certificate.jpg',
		require: 'expected', 
		type: 'string',
		match: [{ in: ['cert']}, {value_in: ['^http']}],
	},
	{
		key: 'shape',
		values_map: combine_map_and_reverse_map('shape'),
		description: 'shape',
		require: 'required', 
		type: 'string',
		values: values_maps.shape.values,
		match: [{in: ['^shape']} ]
	},
	{
		key: 'cost',
		description: 'the cost of the whole stone, NOT cost per carat',
		require: 'required', 
		transform: (x) => x.carat * x.cost_per_carat,
		reducible: (x) => reducible(x, ['carat', 'cost_per_carat']),
		type: 'number',
		match: [{in: ['cost','price', 'cash']}, {nin: ['per', 'discount', '%', '/ct']}]
	},
	{
		key: 'cost_per_carat',
		description: 'the cost per carat',
		require: 'required', 
		transform: (x) => x.carat ? x.cost / x.carat : '',
		reducible: (x) => reducible(x, ['cost', 'carat']),
		type: 'number',
		match: [{in: ['cost', 'price', 'per carat']}, {in: ['per', '/ct']}],
	},
	{
		key: 'clarity', 
		values_map: combine_map_and_reverse_map('clarity'),
		description: 'clarity',
		require: 'required', 
		type: 'string',
		values: values_maps.clarity.values, 
		match: [{ in: ['^clari'] }]
	},
	{
		key: 'color', 
		values_map: combine_map_and_reverse_map('color'),
		description: 'color',
		require: 'required', 
		reducible: (x) => reducible(x, ['fancy_color']),
		type: 'string',
		values: values_maps.color.values,
		match: [{ in: ['^color']}]
	},
	{
		key: 'cut', 
		values_map: combine_map_and_reverse_map('cut'),
		description: 'cut grade',
		require: 'required',
		type: 'string',
		values: values_maps.cut.values,
		match: [{ in: ['^cut'] }]
	},
	{
		key: 'culet_size', 
		description: 'culet size',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^cul']}, {nin: ['cond']}]
	},
	{
		key: 'culet_condition', 
		description: 'culet condition',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^cul']}, {in: ['cond']}]
	},
	{
		key: 'polish', 
		values_map: combine_map_and_reverse_map('polish'),
		description: 'polish',
		require: 'required', 
		type: 'string',
		values: values_maps.polish.values,
		match: [{ in: ['^pol']}]
	},
	{
		key: 'depth',
		description: 'depth in mm',
		require: 'required',
		transform: (x) => x?.measurements?.split(/[ |*|\-|x]/).filter(x => x).pop(),
		reducible: (x) => reducible(x, ['measurements']),
		type: 'number',
		match: [{ in: ['^depth', '^heigh']}, {nin: ['%', 'per']}]
	},
	{
		key: 'depth_percent',
		description: 'depth percent',
		require: 'required', 
		type: 'number',
		match: [{ in: ['^depth']}, {in: ['%', 'per']}] 
	},
	{
		key: 'width',
		description: 'width in mm',
		require: 'required',
		transform: (x) => { const p = x?.measurements?.split(/[ |*|\-|x]/).filter(x => x); if (p) { if (p[0] > p[1]) return p[1]; else return p[0]; }},
		reducible: (x) => reducible(x, ['measurements']),
		type: 'number',
		match: [{ in: ['^width']}, {nin: ['length']}] 
	},
	{
		key: 'length',
		description: 'length in mm',
		require: 'required', 
		transform: (x) => { const p = x?.measurements?.split(/[ |*|\-|x]/).filter(x => x); if (p) { if (p[0] > [1]) return p[0]; else return p[1]; }},
		reducible: (x) => reducible(x, ['measurements']),
		type: 'number',
		match: [{ in: ['^length']}, {nin: ['width']}]
	},
	{
		key: 'length_width_ratio',
		description: 'length width ratio',
		require: 'optional',
		transform: (x) => Math.round(x.length / x.width * 100) / 100,
		type: 'number',
		match: [{ in: ['width']}, {in: ['length']}]
	},
	{
		key: 'measurements',
		description: 'measurements by width - length x depth mm',
		require: 'optional', 
		transform: (x) => x.width + ' - ' + x.length + ' x ' + x.depth,
		type: 'string',
		match: [{ in: ['measure']}]
	},
	{
		key: 'fluorescence', 
		values_map: combine_map_and_reverse_map('fluorescence'),
		description: 'fluorescence',
		require: 'required', 
		type: 'string',
		values: values_maps.fluorescence.values,
		match: [{ in: ['^fluor'] }, { nin: ['color']}]
	},
	{
		key: 'fluorescence_color', 
		description: 'fluorescence color',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^fluor'] }, { in: ['color'] }]
	},
	{
		key: 'girdle',
		description: 'girdle includes thin to thick',
		require: 'optional',
		transform: (x) => [x.girdle_thin, x.girdle_thick].filter(y => y).join(', '),
		type: 'string',
		match: [{ in: ['^girdle']}, {nin: ['%', 'per', 'thin', 'thick']}]
	},
	{
		key: 'girdle_thin',
		description: 'girdle thin',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^girdle']}, { in: ['thin', 'min']}, {nin: ['%', 'per', 'cond']}]
	},
	{
		key: 'girdle_thick',
		description: 'girdle thick',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^girdle']}, { in: ['thick', 'max']}, {nin: ['%', 'per', 'cond']}]
	},
	{
		key: 'girdle_percent',
		description: 'girdle percent',
		require: 'optional', 
		type: 'number',
		match: [{ in: ['^girdle']}, {in: ['%', 'per']}]
	},
	{
		key: 'symmetry', 
		values_map: combine_map_and_reverse_map('symmetry'),
		description: 'symmetry',
		require: 'required', 
		type: 'string',
		values: values_maps.symmetry.values,
		match: [{ in: ['^symm']}]
	},
	{
		key: 'table_percent',
		description: 'table percent',
		require: 'required', 
		type: 'number',
		match: [{ in: ['^tab', 'table']}, {in: ['%', 'per']}]
	},
	{
		key: 'key_to_symbols',
		description: 'key to symbols',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^key']}, {in: ['symb']}]
	},
	{	
		key: 'crown_height',
		description: 'crown height',
		require: 'optional', 
		type: 'number',
		match: [{ in: ['^crow']}, {in: ['hei']}]
	},
	{	
		key: 'crown_angle',
		description: 'crown angle',
		require: 'optional', 
		type: 'number',
		match: [{ in: ['^crow']}, {in: ['ang']}]
	},
	{
		key: 'pavilion_depth',
		description: 'pavilion depth',
		require: 'optional', 
		type: 'number',
		match: [{ in: ['^pav']}, {in: ['dep']}]
	},
	{
		key: 'pavilion_angle',
		description: 'pavilion angle',
		require: 'optional', 
		type: 'number',
		match: [{ in: ['^pav']}, {in: ['ang']}]
	},
	{
		key: 'fancy_color',
		values_map: combine_map_and_reverse_map('fancy_color'),
		description: 'fancy color',
		require: 'optional', 
		type: 'string',
		values: values_maps.fancy_color.values,
		match: [{ in: ['^fancy']}, {in: ['color']}, {nin: ['inten', 'overt']}]
	},
	{
		key: 'fancy_color_intensity',
		values_map: combine_map_and_reverse_map('fancy_color_intensity'),
		description: 'fancy color intensity',
		require: 'optional', 
		type: 'string',
		values: values_maps.fancy_color_intensity.values,
		match: [{ in: ['^fancy']}, {in: ['color']}, {in: ['inten']}]
	},
	{
		key: 'fancy_color_overtone',
		description: 'fancy color overtone',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^fancy']}, {in: ['color']}, {in: ['overt']}]
	},
	{
		key: 'city',
		description: 'city of the diamond location',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^city', '^town']}]
	},
	{
		key: 'state',
		description: 'state of the diamond location',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^state', '^province']}]
	},
	{
		key: 'country',
		description: 'country of the diamond location',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^country']}]
	},
	{
		key: 'location',
		description: 'location of the diamond',
		require: 'optional', 
		transform: (x) => [x.city, x.state, x.country].filter(y => y).join(', '),
		type: 'string',
		match: [{ in: ['location']}]
	},
	{
		key: 'lab_grown',
		values_map: combine_map_and_reverse_map('lab_grown', 'number'),
		//default_value: 0,
		description: 'lab grown or earth grown',
		require: 'required', 
		type: 'number',
		values: values_maps.lab_grown.values,
		match: [{ in: ['^lab']}, {in: ['grown']}]
	},
	{
		key: 'laser_inscription',
		description: 'laser inscription',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^laser']}, {in: ['inscrip']}]
	},
	{
		key: 'orig_primary_image_url',
		description: 'url for primary image primary.jpg',
		require: 'expected', 
		type: 'string',
		match: [{ in: ['image', 'photo']}, {value_in: ['^http']}],
	},
	{
		key: 'orig_proportions_url',
		description: 'url for proportions diagram cutprofile.jpg',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['proport']}, {value_in: ['^http']}],
	},
	{
		key: 'orig_plotting_url',
		description: 'url for plotting diagram plot.jpg',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['plot']}, {value_in: ['^http']}],
	},
	{
		key: 'orig_video_url',
		description: 'url for video video.mp4',
		require: 'expected', 
		type: 'string',
		match: [{ in: ['video']}, {nin: ['360']}, {value_in: ['^http']}],
	},
	{
		key: 'orig_3d_360_url',
		description: 'url for 3D 360 vision url',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['3d', '360']}, {value_in: ['^http']}],
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

function combine_map_and_reverse_map(key, type = 'string') {
	if (!values_maps[key]) {
		throw new Error(`values_maps for ${key} not found`);
	}
	const map = {};
	const regular_map = values_maps[key].map;
	for (const k in regular_map) {
		map[k.toLowerCase()] = type === 'number' ? Number(k) : k;
	}
	const reverse_map = values_maps[key].reverse_map;
	for (const k in reverse_map) {
		map[k.toLowerCase()] = reverse_map[k];
	}
	return map;
}

function reducible(x, dependencies) {
	if (!Array.isArray(x)) {
		for (const key of dependencies) {
			if (!x[key]) {
				return false;
			}
		}
		return true;
	} else if (x.length > 0) {
		if (typeof x[0] !== 'string') {
			if (x[0].key) {
				x = x.map(x => x.key);
			} else if (x[0].field) {
				x = x.map(x => x.field);
			} else {
				return false;
			}
		}
		for (const key of dependencies) {
			if (!x.includes(key)) {
				return false;
			}
		}
		return true;
	}
	return false;
}

module.exports = std_fields;