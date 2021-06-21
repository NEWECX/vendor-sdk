'use strict';

const { color_values, reverse_color_map, colors_to_fancy_colors, reverse_fancy_color_overtone_map, adjective_fancy_color_overtone_map, reverse_fancy_color_intensity_map } = require('@ritani/diamond-glossary');

function transform_color(diamond) {
	if (color_values.includes(diamond.color)) {
		return diamond.color;
	}
	if (colors_to_fancy_colors[diamond.color]) {
		const {fancy_color, fancy_color_intensity, fancy_color_overtone} = colors_to_fancy_colors[diamond.color];
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
    const parts = diamond.color.split(/[:| |-|.]/);
    if (!diamond.fancy_color & parts.length > 2) {
        const last_word = parts.pop().toLowerCase();
        if (reverse_fancy_color_overtone_map[last_word]) {
            diamond.fancy_color = reverse_fancy_color_overtone_map[last_word];
            const new_colors = [];
            for (const word of parts) {
                const lc_word = word.toLowerCase();
                if (adjective_fancy_color_overtone_map[lc_word]) {
                    diamond.fancy_color_overtone = adjective_fancy_color_overtone_map[lc_word];
                } else if (reverse_fancy_color_intensity_map[lc_word]) {
                    diamond.fancy_color_intensity = reverse_fancy_color_intensity_map[lc_word];
                } else {
                    new_colors.push(word);
                }
            }
            diamond.color = new_colors.join(' ');
        }
    }
    if (parts[0].length === 1) {
        const lc_word = parts[0].toLowerCase();
        if (reverse_color_map[lc_word]) {
            return reverse_color_map[lc_word];
        }
    }
	return diamond.color;
}

module.exports = transform_color;