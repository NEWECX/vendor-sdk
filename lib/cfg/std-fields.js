'use strict';

const { values_maps } = require('@ritani/diamond-glossary');
const transform_color = require('./transform-color');
const grade_mapping = require('./grade-mapping');
const reducible = require('./reducible');

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
		match: [{in: ['sku', 'stock', '^id', '^lot']}]
	},
	{
		key: 'carat',
		description: 'carat weight',
		require: 'required', 
		type: 'number',
		match: [{in: ['^cara', '^wei', 'weight', 'carat'] }]
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
		match: [{ in: ['cert', 'cert.*no', 'report.*#', 'report.*no']}, {nin: ['lab', 'type', 'date'] }]
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
		transform: (x) => x.cost_per_carat ? Math.round(x.carat * x.cost_per_carat * 100) / 100 : '',
		reducible: (x) => reducible(x, ['carat', 'cost_per_carat']),
		type: 'number',
		match: [{in: ['cost','price', 'cash']}, {nin: ['per', 'discount', '%', '/']}]
	},
	{
		key: 'cost_per_carat',
		description: 'the cost per carat',
		require: 'required', 
		transform: (x) => x.carat && x.cost ? Math.round(x.cost / x.carat * 100) / 100 : '',
		reducible: (x) => reducible(x, ['cost', 'carat']),
		type: 'number',
		match: [{in: ['cost', 'price', 'carat', '$']}, {in: ['per', '/']}, {nin: ['percent', 'rap']}],
	},
	{
		key: 'clarity', 
		values_map: combine_map_and_reverse_map('clarity'),
		description: 'clarity',
		require: 'required', 
		type: 'string',
		values: values_maps.clarity.values, 
		match: [{ in: ['^clari', '^purity'] }, {nin: ['charac']}]
	},
	{
		key: 'clarity_characteristics', 
		description: 'clarity characteristics, i.e, Feather',
		require: 'optional',
		match: [{ in: ['^clari', '^purity']}, {in: ['charac']}]
	},
	{
		key: 'color', 
		values_map: combine_map_and_reverse_map('color'),
		description: 'color',
		require: 'required',
		transform: (x) => transform_color(x),
		always_transform: true,
		reducible: (x) => reducible(x, ['fancy_color']),
		type: 'string',
		values: values_maps.color.values,
		match: [{ in: ['^color', '^colour']}, {nin: ['orig', 'distr']}]
	},
	{
		key: 'color_origin', 
		description: 'color origin, i.e, Nature',
		require: 'optional',
		match: [{ in: ['^color', '^colour']}, {in: ['orig']}]
	},
	{
		key: 'color_distribution', 
		description: 'color distribution, i.e, Even',
		require: 'optional',
		match: [{ in: ['^color', '^colour']}, {in: ['distr']}]
	},
	{
		key: 'cut', 
		values_map: combine_map_and_reverse_map('cut'),
		description: 'cut grade',
		require: 'expected',
		type: 'string',
		values: values_maps.cut.values,
		match: [{ in: ['^cut'] }]
	},
	{
		key: 'culet_size',
		values_map: combine_map_and_reverse_map('culet_size'),
		description: 'culet size',
		require: 'optional', 
		type: 'string',
		values: values_maps.culet_size.values,
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
		transform: (x) => { const p = x?.measurements?.split(/[ |*|\-|x|X]/).filter(x => x && !isNaN(x)).map(x => Number(x)); if (p && p.length > 2) return p[2]; },
		reducible: (x) => reducible(x, ['measurements']),
		type: 'number',
		match: [{ in: ['^depth', '^heigh']}, {nin: ['%', 'per']}]
	},
	{
		key: 'depth_percent',
		description: 'depth percent',
		transform: (x) => Math.round(x.depth / (x.width + x.length) / 2 * 100),
		require: 'optional', 
		type: 'number',
		match: [{ in: ['^depth']}, {in: ['%', 'per', 'pct']}] 
	},
	{
		key: 'width',
		description: 'width in mm',
		require: 'required',
		transform: (x) => { const p = x?.measurements?.split(/[ |*|\-|x|X]/).filter(x => x && !isNaN(x)).map(x => Number(x)); if (p && p.length > 1) { if (p[0] > p[1]) return p[1]; else return p[0]; }},
		reducible: (x) => reducible(x, ['measurements']),
		type: 'number',
		match: [{ in: ['^width']}, {nin: ['length']}] 
	},
	{
		key: 'length',
		description: 'length in mm',
		require: 'required', 
		transform: (x) => { const p = x?.measurements?.split(/[ |*|\-|x|X]/).filter(x => x && !isNaN(x)).map(x => Number(x)); if (p && p.length > 1) { if (p[0] > [1]) return p[0]; else return p[1]; }},
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
		match: [{ in: ['^flu'] }, { nin: ['color']}]
	},
	{
		key: 'fluorescence_color', 
		description: 'fluorescence color',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^flu'] }, { in: ['color'] }]
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
		match: [{ in: ['^tab', 'table']}]
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
		description: 'crown height percent',
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
		description: 'pavilion depth percent',
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
		match: [{ in: ['^fancy']}, {in: ['inten']}]
	},
	{
		key: 'fancy_color_overtone',
		values_map: combine_map_and_reverse_map('fancy_color_overtone'),
		description: 'fancy color overtone',
		require: 'optional', 
		type: 'string',
		values: values_maps.fancy_color_overtone.values,
		match: [{ in: ['^fancy']}, {in: ['overt']}]
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
		match: [{ in: ['locat']}, {nin: ['issue']}]
	},
	{
		key: 'days_to_ship',
		description: 'days need to ship the diamond',
		require: 'expected', 
		type: 'number',
		match: [{ in: ['day', 'time']}, {in: ['ship', 'deliv']}]
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
		key: 'report_date',
		description: 'date shows on lab report',
		transform: (x) => { 
			if (x.report_date) {
				const d = new Date(x.report_date); 
				return !d || d === 'Invalid Date' ? '' : d.toISOString().substr(0, 10); 
			} 
		},
		require: 'optional', 
		type: 'string',
		match: [{ in: ['report']}, {in: ['date', 'time', 'day']}]
	},
	{
		key: 'comments',
		description: 'comments',
		transform: (x, f) => f && /milk/i.test(f) ? 'Milky ' + x.comments : x.comments,
		always_transform: true,
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^comment', 'milk']}]
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


module.exports = std_fields;
