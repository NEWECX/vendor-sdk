'use strict';

const { color_values, fancy_color_values } = require('@ritani/diamond-glossary');
const { reverse_fancy_color_intensity_map2, colors_to_fancy_colors, reverse_fancy_color_overtone_map2 } = require('./fancy-colors');

function transform_color(diamond) {
	if (!diamond.color) {
		return '';
	}
    const uc_color = diamond.color.toUpperCase();
	if (color_values.includes(uc_color)) {
		return uc_color;
	}
	if (colors_to_fancy_colors[uc_color]) {
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
	const parts = diamond.color.split(' ');
	const lc_first_word = parts[0].toLowerCase();
	if (lc_first_word === 'fancy') {
		parts.shift();
		const last_word = parts.pop().toUpperCase();
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
		return '';
	}
	return diamond.color;
}

module.exports = transform_color;