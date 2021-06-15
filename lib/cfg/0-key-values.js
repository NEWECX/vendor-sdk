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
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
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
	M: 'M',
	N: 'N',
	O: 'O',
	P: 'P',
	Q: 'Q',
	R: 'R',
	S: 'S',
	T: 'T',
	U: 'U',
	V: 'V',
	W: 'W',
	X: 'X',
	Y: 'Y',
	Z: 'Z'
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
	m: 'M',
	n: 'N',
	o: 'O',
	p: 'P',
	q: 'Q',
	r: 'R',
	s: 'S',
	t: 'T',
	u: 'U',
	v: 'V',
	w: 'W',
	x: 'X',
	y: 'Y',
	z: 'Z'
};

const clarity_values = [ 'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3' ];

const clarity_map = {
	FL: 'Flawless', 
	IF: 'Internally Flawless',
	VVS1: 'Very, Very Slightly Included 1',
	VVS2: 'Very, Very Slightly Included 2',
	VS1: 'Very Slightly Included 1', 
	VS2: 'Very Slightly Included 2', 
	SI1: 'Slightly Included 1', 
	SI2: 'Slightly Included 2',
	I1: 'Included 1', 
	I2: 'Included 2',
	I3: 'Included 3'
};

const reverse_clarity_map = {
	'flawless': 'FL', 
	'internally flawless': 'IF',
	'very, very slightly included 1': 'VVS1',
	'very, very slightly included 2': 'VVS2',
	'very slightly included 1': 'VS1', 
	'very slightly included 2': 'VS2', 
	'slightly included 1': 'SI1', 
	'slightly included 2': 'SI2',
	'included 1': 'I1',
	'included 2': 'I2',
	'included 3': 'I3',
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

const fancy_color_values = [
	'YELLOW',
	'PINK',
	'PURPLE', 
	'RED',
	'BLUE',
	'GREEN',
	'ORANGE',
	'BROWN',
	'BLACK',
	'GRAY'
];

const fancy_color_map = {
	YELLOW: 'Yellow',
	PINK: 'Pink',
	PURPLE: 'Purple', 
	RED: 'Red',
	BLUE: 'Blue',
	GREEN: 'Green',
	ORANGE: 'Orange',
	BROWN: 'Brown',
	BLACK: 'Black',
	GRAY: 'Gray',
};

const reverse_fancy_color_map = {
	yellow: 'YELLOW',
	pink: 'PINK',
	purple: 'PURPLE', 
	red: 'RED',
	blue: 'BLUE',
	green: 'GREEN',
	orange: 'ORANGE',
	brown: 'BROWN',
	black: 'BLACK',
	gray: 'GRAY',
};

const fancy_color_intensity_values = [ 'FL', 'FA', 'FI', 'FV', 'FE', 'FD' ];

const fancy_color_intensity_map = {
	FL: 'Fancy Light',
	FA: 'Fancy',
	FI: 'Fancy Intense',
	FV: 'Fancy Vivid',
	FE: 'Fancy Deep',
	FD: 'Fancy Dark'
};

const reverse_fancy_color_intensity_map = {
	'fancy light': 'FL',
	'fancy': 'FA',
	'fancy intense': 'FI',
	'fancy vivid': 'FV',
	'fancy deep': 'FE',
	'fancy dark': 'FD'
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
	fancy_color_values,
	fancy_color_map,
	reverse_fancy_color_map,
	fancy_color_intensity_values,
	fancy_color_intensity_map,
	reverse_fancy_color_intensity_map,

};