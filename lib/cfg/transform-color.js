'use strict';

const { color_values, fancy_color_values } = require('@ritani/diamond-glossary');
const { reverse_fancy_color_intensity_map2, colors_to_fancy_colors, reverse_fancy_color_overtone_map2 } = require('./fancy-colors');

function transform_color(diamond) {
	if (!diamond.color) {
		return '';
	}
	const uc_color = diamond.color.toUpperCase();
	if (uc_color === 'FC' || uc_color === 'FANCY COLOR') {
		return '';
	} else if (color_values.includes(uc_color)) {
		return uc_color;
	} else if (colors_to_fancy_colors[uc_color]) {
		const {fancy_color, fancy_color_intensity, fancy_color_overtone} = colors_to_fancy_colors[uc_color];
		if (fancy_color) {
			diamond.fancy_color = fancy_color;
		}
		if (fancy_color_intensity) {
			diamond.fancy_color_intensity = fancy_color_intensity;
		}
		if (fancy_color_overtone) {
			diamond.fancy_color_overtone = fancy_color_overtone;
		}
		return '';
	}
	const parts = uc_color.split(/[^a-zA-Z0-9]/);
	if (parts[0].length === 1 && color_values[parts[0]]) {
		return color_values[parts[0]]
	}
	if (parts[0] === 'FANCY') {
		if (parts.length > 1) {
			parts.shift();
			const last_word = parts.pop();
			if (fancy_color_values.includes(last_word)) {
				diamond.fancy_color = last_word;
			} else {
				console.log(`fancy color ${last_word} is not in the allowed list`);
				diamond.fancy_color = last_word;
			}
			if (parts.length > 0) {
				for (const part of parts) {
					const lc_part = part.toLowerCase();
					if (reverse_fancy_color_intensity_map2[lc_part]) {
						diamond.fancy_color_intensity = reverse_fancy_color_intensity_map2[lc_part];
					}
					if (reverse_fancy_color_overtone_map2[lc_part]) {
						diamond.fancy_color_overtone = reverse_fancy_color_overtone_map2[lc_part];
					}
				}
			}
		}
		return '';
	}
	return diamond.color;
}

module.exports = transform_color;