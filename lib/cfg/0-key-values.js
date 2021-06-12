'use strict';

const shape_values = [ 'AS', 'CU', 'EM', 'HS', 'MQ', 'OV', 'PR', 'PS', 'RA', 'RD' ];

const shape_map = {
	RD: 'round',
	PR: 'princess',
	EM: 'emerald',
	CU: 'cushion',
	RA: 'radiant',
	AS: 'asscher',
	PS: 'pear',
	OV: 'oval',
	MQ: 'marquise',
	HS: 'heart',
};

const reverse_shape_map = {
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
};

const color_values = [
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'FLY',
	'FY',
	'FIY', 
	'FVY',
];

const color_map = {
	D: 'D',
	E: 'E',
	F: 'F',
	G: 'G',
	H: 'H',
	I: 'I',
	J: 'J',
	K: 'K',
	L: 'L',
	FLY: 'Fancy Light Yellow',
	FY: 'Fancy Yellow',
	FIY: 'Fancy Intense Yellow',
	FVY: 'Fancy Vivid Yellow',
};

const reverse_color_map = {
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
};

const clarity_values = [ 'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2' ];

const clarity_map = {
	FL: 'Flawless', 
	IF: 'Internally Flawless',
	VVS1: 'Very, Very Slightly Included 1',
	VVS2: 'Very, Very Slightly Included 2',
	VS1: 'Very Slightly Included 1', 
	VS2: 'Very Slightly Included 2', 
	SI1: 'Slightly Included 1', 
	SI2: 'Slightly Included 2'
};

const reverse_clarity_map = {
	'flawless': 'FL', 
	'internally flawless': 'IF',
	'very, very slightly included 1': 'VVS1',
	'very, very slightly included 2': 'VVS2',
	'very slightly included 1': 'VS1', 
	'very slightly included 2': 'VS2', 
	'slightly included 1': 'SI1', 
	'slightly included 2': 'SI2' 
};

const cut_values = [ 'EX', 'VG', 'G' ];

const cut_map = {
	EX: 'Excellent',
	VG: 'Very Good',
	G: 'Good'
};

const reverse_cut_map = {
	'excellent': 'EX',
	'very good': 'VG',
	'good': 'G'
};

const culet_values = [ 'N', 'P', 'VS', 'S', 'M', 'SL', 'VG'];

const culet_map = {
	N: 'None',
	P: 'Pointed', 
	VS: 'Very Small', 
	S: 	'Small',
	M: 'Medium',
	SL: 'Slightly Large',
	VG: 'Very Large'
};

const reverse_culet_map = {
	'none': 'N',
	'pointed': 'P', 
	'very small': 'VS', 
	'small': 'S',
	'medium': 'M',
	'slightly large': 'SL',
	'very large': 'VG', 
};

const polish_values = [ 'EX',  'VG', 'G' ];

const polish_map = {
	EX: 'Excellent',
	VG: 'Very Good',
	G: 'Good'
};

const reverse_polish_map = {
	'excellent': 'EX',
	'very good': 'VG',
	'good': 'G'
};

const fluorescence_values = ['N',  'F', 'M', 'S', 'VS']

const fluorescence_map = {
	N: 'None',
	F: 'Faint',
	M: 'Medium',
	S: 'Strong',
	VS: 'Very Strong',
};

const reverse_fluorescence_map = {
	'none': 'N',
	'faint': 'F',
	'medium': 'M',
	'strong': 'S',
	'very strong': 'VS',
};

const symmetry_values = [ 'EX', 'VG', 'G', 'F' ];

const symmetry_map = {
	EX: 'Excellent', 
	VG: 'Very Good', 
	G: 'Good', 
	F: 'Fair',
};

const reverse_symmetry_map = {
	'excellent': 'EX',
	'very good': 'VG',
	'good': 'G',
	'fair': 'F'
};

const lab_grown_values = [0, 1];

const lab_grown_map = {
	'0': 'N',
	'1': 'Y'
};

const reverse_lab_grown_map = {
	'n': 0,
	'y': 1 
};

module.exports = {
	shape_values,
	shape_map,
	reverse_shape_map,
	color_values,
	color_map,
	reverse_color_map,
	clarity_values,
	clarity_map,
	reverse_clarity_map,
	cut_values,
	cut_map,
	reverse_cut_map,
	culet_values,
	culet_map,
	reverse_culet_map,
	polish_values,
	polish_map,
	reverse_polish_map,
	fluorescence_values,
	fluorescence_map,
	reverse_fluorescence_map,
	symmetry_values,
	symmetry_map,
	reverse_symmetry_map,
	lab_grown_values,
	lab_grown_map,
	reverse_lab_grown_map,
};