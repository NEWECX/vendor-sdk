'use strict';

const { color_values, colors_to_fancy_colors } = require('@ritani/diamond-glossary');

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
	return diamond.color;
}

module.exports = transform_color;