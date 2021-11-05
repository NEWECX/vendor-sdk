'use strict';

const standard_fields = require('../cfg/std-fields');
const { colors_to_fancy_colors } = require('@ritani/diamond-glossary');
const color_keys = require('../cfg/color-keys');
const is_empty = require('./is-empty');

const reverse_fancy_color_intensity_map = {
	fai: 'FL',
	lig: 'FL',
	ave: 'FA',
	nor: 'FA',
	int: 'FI',
	viv: 'FV',
	dee: 'FP',
	dar: 'FD'
};

const reverse_fancy_color_map = {
	yel: 'YELLOW',
	pin: 'PINK',
	pur: 'PURPLE', 
	red: 'RED',
	blu: 'BLUE',
	gre: 'GREEN',
	ora: 'ORANGE',
	bro: 'BROWN',
	bla: 'BLACK',
	gra: 'GRAY',
};

function get_fancy_color_intensity(value) {
	for (const key in reverse_fancy_color_intensity_map) {
		if (value.includes(key)) {
			return reverse_fancy_color_intensity_map[key];
		}
	}
	return '';
}

function get_fancy_color(value) {
	for (const key in reverse_fancy_color_map) {
		if (value.includes(key) && /^((?!ish).)*$/.test(value)) {
			return reverse_fancy_color_map[key];
		}
	}
	return '';
}

function get_fancy_color_overtone(value) {
	for (const key in reverse_fancy_color_map) {
		if (value.includes(key) && /ish/.test(value)) {
			return reverse_fancy_color_map[key];
		}
	}
	return '';
}

function get_value(diamond, color_words, color_fields, key, f, wf) {
	if (diamond[key] && color_fields[key].values.includes(diamond[key])) {
		return;
	}
	if (diamond[key]) {
		diamond[key] = f(diamond[key]);
		if (diamond[key]) {
			return;
		}
	}
	let result = '';
	if (color_words.length > 0) {
		for (const word of color_words) {
			result = wf ? wf(word) : f(word);
			if (result) {
				break;
			}
		}
	}
	diamond[key] = result; 
}

// 'color', 'fancy_color', 'fancy_color_intensity', 'fancy_color_overtone'

module.exports = (diamond, errors, std_fields = standard_fields) => {
	const color_fields = {};
	for (const key of color_keys) {
		const result = std_fields.find(x => x.key === key);
		if (result) color_fields[key] = result;
	}
	if (Object.keys(color_fields).length === 0) {
		return false;
	}
	if (color_fields.color && diamond.color && color_fields.color.values.includes(diamond.color)) {
		if (diamond.color.length === 1) {
			diamond.fancy_color = '';
			diamond.fancy_color_intensity = '';
			diamond.fancy_color_overtone = '';	
		} else {
			const value = colors_to_fancy_colors[diamond.color];
			if (value) {
				diamond.fancy_color = value.fancy_color;
				diamond.fancy_color_intensity = value.fancy_color_intensity;
			}
		}
		return true;
	}
	const color_words = [];
	for (const key of color_keys) {
		if (!color_fields[key] || !diamond[key]) continue;
		const words = diamond[key].split(/ |,/).filter(x => x);
		for (const word of words) {
			if (!color_words.includes(word)) {
				color_words.unshift(word.toLowerCase());
			}
		}
	}
	if (color_fields.fancy_color_overtone) {
		get_value(diamond, color_words, color_fields, 'fancy_color_overtone', get_fancy_color, get_fancy_color_overtone);
	}
	if (color_fields.fancy_color_intensity) {
		get_value(diamond, color_words, color_fields, 'fancy_color_intensity', get_fancy_color_intensity);
	}

	if (color_fields.fancy_color) {
		get_value(diamond, color_words.reverse(), color_fields, 'fancy_color', get_fancy_color);
	}
	if (!diamond.fancy_color && diamond.fancy_color_overtone) {
		diamond.fancy_color = diamond.fancy_color_overtone;
	}
	if (diamond.fancy_color && !diamond.fancy_color_intensity) {
		diamond.fancy_color_intensity = 'FA';
	}

	if (diamond.fancy_color && diamond.fancy_color_intensity) {
		for (const color in colors_to_fancy_colors) {
			const value = colors_to_fancy_colors[color];
			if (value.fancy_color === diamond.fancy_color && value.fancy_color_intensity === diamond.fancy_color_intensity) {
				diamond.color = color;
				break;
			}
		}
	}
	return is_empty(diamond.color);
};