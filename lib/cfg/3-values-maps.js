'use strict';

const key_values = require('./0-key-values');
const certificates = require('./1-certificates');

const values_maps = {
    certificate_lab: {
        values: certificates.certificate_lab_values,
        map: certificates.certificate_lab_map,
        reverse_map: certificates.reverse_certificate_lab_map,
    },
	shape: {
        values: key_values.shape_values, 
        map: key_values.shape_map, 
        reverse_map: key_values.reverse_shape_map
    },
	color: {
        values: key_values.color_values, 
        map: key_values.color_map, 
        reverse_map: key_values.reverse_color_map
    },
	clarity: {
        values: key_values.clarity_values, 
        map: key_values.clarity_map, 
        reverse_map: key_values.reverse_clarity_map
    },
	cut: {
        values: key_values.cut_values, 
        map: key_values.cut_map, 
        reverse_map: key_values.reverse_cut_map
    },
	polish: {
        values: key_values.polish_values, 
        map: key_values.polish_map, 
        reverse_map: key_values.reverse_polish_map
    },
	fluorescence: {
        values: key_values.fluorescence_values, 
        map: key_values.fluorescence_map, 
        reverse_map: key_values.reverse_fluorescence_map
    },
	symmetry: {
        values: key_values.symmetry_values, 
        map: key_values.symmetry_map, 
        reverse_map: key_values.reverse_symmetry_map
    },
	lab_grown: {
        values: key_values.lab_grown_values, 
        map: key_values.lab_grown_map, 
        reverse_map: key_values.reverse_lab_grown_map
    },
    fancy_color: {
        values: key_values.fancy_color_values, 
        map: key_values.fancy_color_map, 
        reverse_map: key_values.reverse_fancy_color_map
    },
    fancy_color_intensity: {
        values: key_values.fancy_color_intensity_values,
        map: key_values.fancy_color_intensity_map,
        reverse: key_values.reverse_fancy_color_intensity_map,
    }
};

module.exports = values_maps;