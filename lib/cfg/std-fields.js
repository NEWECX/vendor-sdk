'use strict';

const { values_maps } = require('@ritani/diamond-glossary');

// version '2021-11-03'
//
module.exports = [
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
		match: [{in: ['^cara', '^wei', 'weight', 'carat'] }],
		signature: true
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
		match: [{ in: ['cert']}, {value_in: ['^http']}, {ext_in: ['pdf', 'jpg', 'jpeg', 'png']}],
	},
	{
		key: 'shape',
		values_map: combine_map_and_reverse_map('shape'),
		description: 'shape',
		require: 'required', 
		type: 'string',
		values: values_maps.shape.values,
		match: [{in: ['^shape']} ],
		signature: true
	},
	{
		key: 'cost',
		description: 'the cost of the whole stone, NOT cost per carat',
		require: 'required', 
		transform: (x) => x.cost_per_carat ? Math.round(x.carat * x.cost_per_carat * 100) / 100 : '',
		reducible: (x) => reducible(x, ['carat', 'cost_per_carat']),
		type: 'number',
		match: [{in: ['cost','price', 'cash']}, {nin: ['per', 'discount', '%', '\\/']}],
	},
	{
		key: 'cost_per_carat',
		description: 'the cost per carat',
		require: 'required', 
		transform: (x) => x.carat && x.cost ? Math.round(x.cost / x.carat * 100) / 100 : '',
		reducible: (x) => reducible(x, ['cost', 'carat']),
		type: 'number',
		match: [{in: ['cost', 'price', 'carat', '\\$']}, {in: ['per', '\\/']}, {nin: ['percent', 'rap']}],
	},
	{
		key: 'clarity', 
		values_map: combine_map_and_reverse_map('clarity'),
		description: 'clarity',
		require: 'required', 
		type: 'string',
		values: values_maps.clarity.values, 
		match: [{ in: ['^clari', '^purity'] }, {nin: ['charac']}],
		signature: true
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
		// color processed separately
		type: 'string',
		values: values_maps.color.values,
		match: [{ in: ['^color', '^colour']}, {nin: ['orig', 'distr']}],
		signature: true
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
		match: [{ in: ['^cut'] }],
		signature: true
	},
	{
		key: 'culet_size',
		values_map: combine_map_and_reverse_map('culet_size'),
		description: 'culet size',
		require: 'optional', 
		type: 'string',
		values: values_maps.culet_size.values,
		match: [{ in: ['^cul']}, {nin: ['cond']}],
		signature: true
	},
	{
		key: 'culet_condition', 
		description: 'culet condition',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^cul']}, {in: ['cond']}],
		signature: true
	},
	{
		key: 'polish', 
		values_map: combine_map_and_reverse_map('polish'),
		description: 'polish',
		require: 'required', 
		type: 'string',
		values: values_maps.polish.values,
		match: [{ in: ['^pol']}],
		signature: true
	},
	{
		key: 'depth',
		description: 'depth in mm',
		require: 'required',
		transform: (x) => { const p = x?.measurements?.split(/[ |*|\-|x|X]/).filter(x => x && !isNaN(x)).map(x => Number(x)); if (p && p.length > 2) return p[2]; },
		reducible: (x) => reducible(x, ['measurements']),
		type: 'number',
		match: [{ in: ['^dep', '^heigh']}, {nin: ['%', 'per']}]
	},
	{
		key: 'depth_percent',
		description: 'depth percent',
		require: 'required', 
		type: 'number',
		match: [{ in: ['^depth']}, {in: ['%', 'per', 'pct']}],
		signature: true
	},
	{
		key: 'width',
		description: 'width in mm',
		require: 'required',
		transform: (x) => { const p = x?.measurements?.split(/[ |*|\-|x|X]/).filter(x => x && !isNaN(x)).map(x => Number(x)); if (p && p.length > 1) { return Math.min(p[0], p[1]) }},
		reducible: (x) => reducible(x, ['measurements']),
		type: 'number',
		match: [{ in: ['^wid']}, {nin: ['leng']}] 
	},
	{
		key: 'length',
		description: 'length in mm',
		require: 'required', 
		transform: (x) => { const p = x?.measurements?.split(/[ |*|\-|x|X]/).filter(x => x && !isNaN(x)).map(x => Number(x)); if (p && p.length > 1) { return Math.max(p[0], p[1]) }},
		reducible: (x) => reducible(x, ['measurements']),
		type: 'number',
		match: [{ in: ['^leng']}, {nin: ['wid']}]
	},
	{
		key: 'length_width_ratio',
		description: 'length width ratio',
		require: 'optional',
		transform: (x) => { if (!x.length || !x.width) return ''; if (x.width > x.length) {const t = x.width; x.width = x.length; x.length = t; } return Math.round(x.length / x.width * 100) / 100; },
		always_transform: true,
		reducible: (x) => reducible(x, ['width', 'length']),
		type: 'number',
		match: [{ in: ['wid']}, {in: ['leng']}, {in: ['rat']}]
	},
	{
		key: 'measurements',
		description: 'measurements by width - length x depth mm',
		require: 'optional', 
		transform: (x) => (x.width && x.length && x.depth) ? `${x.length.toFixed(2)} - ${x.width.toFixed(2)} x ${x.depth.toFixed(2)}` : x.measurements ? x.measurements : '',
		always_transform: true,
		reducible: (x) => reducible(x, ['width', 'length', 'depth']),
		type: 'string',
		match: [{ in: ['measur']}],
		signature: true
	},
	{
		key: 'fluorescence', 
		values_map: combine_map_and_reverse_map('fluorescence'),
		description: 'fluorescence',
		require: 'required', 
		type: 'string',
		values: values_maps.fluorescence.values,
		match: [{ in: ['^flu'] }, { nin: ['color']}],
		signature: true
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
		transform: (x) => [x.girdle_thin, x.girdle_thick, x.girdle_percent].filter(y => y).join(', '),
		reducible: (x) => reducible(x, ['girdle_thin'], ['girdle_thick'], ['girdle_percent']),
		type: 'string',
		match: [{ in: ['^gird', '^grid']}, {nin: ['%', 'per', 'thin', 'thick']}],
		signature: true
	},
	{
		key: 'girdle_thin',
		description: 'girdle thin',
		transform: (x) => { const a = x.girdle.split(',')[0].split(/ |to/).filter(x => x); if (a.length > 1) return a[0].toLowerCase(); },
		reducible: (x) => reducible(x, ['girdle']),
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^gird', '^grid']}, { in: ['thin', 'min']}, {nin: ['%', 'per', 'cond']}]
	},
	{
		key: 'girdle_thick',
		description: 'girdle thick',
		transform: (x) => { const a = x.girdle.split(',')[0].split(/ |to/).filter(x => x); if (a.length > 1 && !a[1].includes('faceted')) return a[1].toLowerCase(); },
		reducible: (x) => reducible(x, ['girdle']),
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^gird', '^grid']}, { in: ['thic', 'max']}, {nin: ['%', 'per', 'cond']}]
	},
	{
		key: 'girdle_percent',
		description: 'girdle percent',
		transform: (x) => { const a = x.girdle.split(','); if (a.length > 2) { const b = a[2].replace(/ |%/g, ''); if (!isNaN(b)) return Number(b); }},
		reducible: (x) => reducible(x, ['girdle']),
		require: 'optional', 
		type: 'number',
		match: [{ in: ['^gird', '^grid']}, {in: ['%', 'per']}]
	},
	{
		key: 'symmetry', 
		values_map: combine_map_and_reverse_map('symmetry'),
		description: 'symmetry',
		require: 'required', 
		type: 'string',
		values: values_maps.symmetry.values,
		match: [{ in: ['^symm']}],
		signature: true
	},
	{
		key: 'table_percent',
		description: 'table percent',
		require: 'required', 
		type: 'number',
		match: [{ in: ['^tab', 'table']}],
		signature: true
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
		match: [{ in: ['^crow']}, {in: ['hei']}],
		signature: true
	},
	{	
		key: 'crown_angle',
		description: 'crown angle',
		require: 'optional', 
		type: 'number',
		match: [{ in: ['^crow']}, {in: ['ang']}],
		signature: true
	},
	{
		key: 'pavilion_depth',
		description: 'pavilion depth percent',
		require: 'optional', 
		type: 'number',
		match: [{ in: ['^pav']}, {in: ['dep']}],
		signature: true
	},
	{
		key: 'pavilion_angle',
		description: 'pavilion angle',
		require: 'optional', 
		type: 'number',
		match: [{ in: ['^pav']}, {in: ['ang']}],
		signature: true
	},
	{
		key: 'fancy_color',
		values_map: combine_map_and_reverse_map('fancy_color'),
		description: 'fancy color',
		require: 'optional', 
		type: 'string',
		values: values_maps.fancy_color.values,
		match: [{ in: ['^fancy']}, {in: ['color']}, {nin: ['inten', 'overt']}],
		signature: true
	},
	{
		key: 'fancy_color_intensity',
		values_map: combine_map_and_reverse_map('fancy_color_intensity'),
		description: 'fancy color intensity',
		require: 'optional', 
		type: 'string',
		values: values_maps.fancy_color_intensity.values,
		match: [{ in: ['^fancy']}, {in: ['inten']}],
		signature: true
	},
	{
		key: 'fancy_color_overtone',
		values_map: combine_map_and_reverse_map('fancy_color_overtone'),
		description: 'fancy color overtone',
		require: 'optional', 
		type: 'string',
		values: values_maps.fancy_color_overtone.values,
		match: [{ in: ['^fancy']}, {in: ['overt']}],
		signature: true
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
		reducible: (x) => reducible(x, ['city'], ['state'], ['country']),
		type: 'string',
		match: [{ in: ['locat']}, {nin: ['issue']}]
	},
	{
		key: 'days_to_ship',
		description: 'days need to ship the diamond',
		require: 'optional', 
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
		match: [{ in: ['^lab']}, {in: ['grown']}],
		signature: true
	},
	{
		key: 'laser_inscription',
		description: 'laser inscription',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^laser', 'inscription']}, {in: ['inscrip']}],
		signature: true
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
		always_transform: true,
		require: 'optional', 
		type: 'string',
		match: [{ in: ['report']}, {in: ['date', 'time', 'day']}]
	},
	{
		key: 'comments',
		description: 'comments',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['^comment', 'milk']}]
	},
	{
		key: 'orig_primary_image_url',
		description: 'url for primary image primary.jpg',
		require: 'expected', 
		type: 'string',
		match: [{ in: ['image', 'photo']}, {value_in: ['^http']}, {ext_in: ['jpg', 'jpeg', 'png']}],
	},
	{
		key: 'orig_proportions_url',
		description: 'url for proportions diagram cutprofile.jpg',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['proport']}, {value_in: ['^http']}, {ext_in: ['jpg', 'jpeg', 'png']}],
		
	},
	{
		key: 'orig_plotting_url',
		description: 'url for plotting diagram plot.jpg',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['plot']}, {value_in: ['^http']}, {ext_in: ['jpg', 'jpeg', 'png']}],
	},
	{
		key: 'orig_video_url',
		description: 'url for video video.mp4',
		require: 'expected', 
		type: 'string',
		match: [{ in: ['video']}, {nin: ['360']}, {value_in: ['^http']}, {ext_in: ['mp4']}],
	},
	{
		key: 'orig_3d_360_url',
		description: 'url for 3D 360 vision url',
		require: 'optional', 
		type: 'string',
		match: [{ in: ['3d', '360']}, {value_in: ['^http']}, {ext_nin: ['mp4', 'jpg', 'jpeg', 'png', 'pdf']}],
	},
	{
		key: 'orig_alt_image1_url',
		description: 'url for additional image image1.jpg',
		require: 'optional', 
		type: 'string',
		match: [{value_in: ['^http']}, {ext_in: ['jpg', 'jpeg', 'png']}],
	},
	{
		key: 'orig_alt_image2_url',
		description: 'url for additional image image2.jpg',
		require: 'optional', 
		type: 'string',
		match: [{value_in: ['^http']}, {ext_in: ['jpg', 'jpeg', 'png']}],
	},
	{
		key: 'orig_alt_image3_url',
		description: 'url for additional image image3.jpg',
		require: 'optional', 
		type: 'string',
		match: [{value_in: ['^http']}, {ext_in: ['jpg', 'jpeg', 'png']}],
	},
	{
		key: 'orig_video1_url',
		description: 'url for additional video video1.mp4',
		require: 'optional', 
		type: 'string',
		match: [{value_in: ['^http']}, {ext_in: ['mp4']}],
	},
	{
		key: 'orig_video2_url',
		description: 'url for additional video video2.mp4',
		require: 'optional', 
		type: 'string',
		match: [{value_in: ['^http']}, {ext_in: ['mp4']}],
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

function reducible(...args) {
	const x = args.shift();
	for (const dependencies of args) {
		let ok = true;
		for (const key of dependencies) {
			if (!x[key]) {
				ok = false;
				break;
			}
		}
		if (ok) return true;
	}
	return false;
}
