'use strict';

const { color_values, colors_to_fancy_colors, fancy_color_color_values, fancy_color_short_map } = require('@ritani/diamond-glossary');

const { std_fields: standard_fields, color_keys} = require('../cfg');

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
	whi: 'WHITE',
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

function update_fancy_color(diamond, color_fields) {
	if (diamond.color.length === 1) {
		if (color_fields.fancy_color) diamond.fancy_color = '';
		if (color_fields.fancy_color_intensity) diamond.fancy_color_intensity = '';
		if (color_fields.fancy_color_overtone) diamond.fancy_color_overtone = '';	
	} else if (color_fields.fancy_color || color_fields.fancy_color_intensity) {
		const value = colors_to_fancy_colors[diamond.color];
		if (value) {
			if (color_fields.fancy_color) diamond.fancy_color = value.fancy_color;
			if (color_fields.fancy_color_intensity) diamond.fancy_color_intensity = value.fancy_color_intensity;
		}
	}
}

function get_average_color_from_range(uc_color) {
	if (uc_color.includes('FANCY')) return '';
	const parts = uc_color.split(/-| |FROM|TO|RANGE|FAINTCOLOR|\*|\+|,|\/|\\/).filter(x => x);
	if (parts.length === 0) return '';
	const colors = [];
	for (const color of parts) {
		if (color_values.includes(color)) {
			colors.push(color);
		}
	}
	if (colors.length === 0) return ''
	if (colors.length === 1) return colors[0];
	let sum = 0, i = 0;
	for (; i < colors.length; i++) sum += colors[i].charCodeAt(0);
	return String.fromCharCode(Math.round(sum / i));
}

module.exports = (diamond, std_fields = standard_fields) => {
	const color_fields = {};
	for (const key of color_keys) {
		const result = std_fields.find(x => x.key === key);
		if (result) color_fields[key] = result;
	}
	if (Object.keys(color_fields).length === 0) {
		return false;
	}
	if (color_fields.color && diamond.color) {
		const uc_color = diamond.color.toUpperCase();
		if (uc_color === 'NONE') {
			diamond.color = 'D';
			update_fancy_color(diamond, color_fields);
			return true;
		}
		if (color_fields.color.values.includes(uc_color)) {
			diamond.color = uc_color;
			update_fancy_color(diamond, color_fields);
			return true;
		}
		const average_color = get_average_color_from_range(uc_color);
		if (average_color) {
			diamond.color = average_color;
			update_fancy_color(diamond, color_fields);
			return true;
		}
		for (const fancy_color of fancy_color_color_values) {
			if (uc_color.includes(fancy_color)) {
				diamond.color = fancy_color;
				const remaining = uc_color.replace(fancy_color, '');
				if (remaining.length > 0 && color_fields.fancy_color_overtone) {
					if (fancy_color_short_map[remaining]) {
						diamond.fancy_color_overtone = fancy_color_short_map[remaining];
					}
				}
				update_fancy_color(diamond, color_fields);
				return true;
			}
		}
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
