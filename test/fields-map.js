'use strict';

const fields_map = [
	{
		key: 'sku',
	},
	{
		key: 'carat',
    },
	{
		key: 'shipping_availability',
	},
	{
		key: 'certificate_lab',
		values_map: {					// a hash table to, it maps value to the acceptable value								
			agsl: 'AGSL',  		
			ags: 'AGSL',  		
			df: 'DF',			
			egl: 'EGL',			
			gcal: 'GCAL', 		
			ghi: 'GHI', 		
			gia: 'GIA', 		
			gsi: 'GSI', 		
			hrd: 'HRD', 		
			igi: 'IGI',		
			iidgr: 'IIDGR', 	
			pgs: 'PGS'
		},
		default: 'GIA',
	},
	{
		key: 'certificate_number',
	},
	{
		key: 'orig_certificate_url',
	},
	{
		key: 'shape',
        values_map: {
			round: 'RD',
			princess: 'PR',
			emerald: 'EM',
			cushion: 'CU',
			radiant: 'RA',
			asscher: 'AS',
			pear: 'PS',
			oval: 'OV',
			marquise: 'MQ',
			heart: 'HS',
		},
	},
	{
		key: 'cost',
	},
	{
        key: 'clarity', 
        values_map: {
			'flawless': 'FL', 
			'internally flawless': 'IF',
			'very, very slightly included 1': 'VVS1',
			'very, very slightly included 2': 'VVS2',
			'very slightly included 1': 'VS1', 
			'very slightly included 2': 'VS2', 
			'slightly included 1': 'SI1', 
			'slightly included 2': 'SI2' 
		},
    },
	{
		key: 'color', 
		values_map: {
			d: 'D',
			e: 'E',
			f: 'F',
			g: 'G',
			h: 'H',
			i: 'I',
			j: 'J',
			k: 'K',
			l: 'L',
			'fancy light yellow': 'FLY',
			'fancy yellow': 'FY',
			'fancy intense yellow': 'FIY',
			'fancy vivid yellow': 'FVY',
		},
	},
	{
		key: 'cut', 
		values_map: {
			'excellent': 'EX',
			'very good': 'VG',
			'good': 'G'
		},
	},
	{
		key: 'culet', 
		values_map: {
			'none': 'N',
			'pointed': 'P', 
			'very small': 'VS', 
			'small': 'S',
			'medium': 'M',
			'slightly large': 'SL',
			'very large': 'VG', 
		},
	},
	{
		key: 'polish', 
		values_map: {
			'excellent': 'EX',
			'very good': 'VG',
			'good': 'G'
		},
	},
	{
		key: 'depth',
	},
	{
		key: 'depth_percent',
	},
	{
		key: 'width',
	},
	{
		key: 'length',
	},
	{
		key: 'length_width_ratio',
	},
	{
		key: 'fluorescence', 
		values_map: {
			'none': 'N',
			'faint': 'F',
			'medium': 'M',
			'strong': 'S',
			'very strong': 'VS',
		},
	},
	{
		key: 'girdle',
	},
	{
		key: 'symmetry', 
		values_map: {
			'excellent': 'EX',
			'very good': 'VG',
			'good': 'G',
			'fair': 'F'
		},
	},
	{
		key: 'table_percent',
	},
	{
		key: 'key_to_symbols',
	},
	{	
		key: 'crown_height',
	},
	{	
		key: 'crown_angle',
	},
	{
		key: 'pavilion_depth',
	},
	{
		key: 'pavilion_angle',
	},
	{
		key: 'location',
	},
	{
		key: 'lab_grown',
		values_map: {
			'N': 0,
			'Y': 1
		},
		default: 0,
	},
	{
		key: 'orig_primary_image_url',
	},
	{
		key: 'orig_proportions_url',
	},
	{
		key: 'orig_plotting_url',
	},
	{
		key: 'orig_video_url',
	},
	{
		key: 'orig_3d_360_url',
	},

	{
		key: 'orig_alt_image1_url',
	},
	{
		key: 'orig_alt_image2_url',
	},
	{
		key: 'orig_alt_image3_url',
	},
	{
		key: 'orig_video1_url',
	},
	{
		key: 'orig_video2_url',
	}
];

module.exports = fields_map;