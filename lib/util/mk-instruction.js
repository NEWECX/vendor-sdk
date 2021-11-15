'use strict';

const fs = require('fs');
const node_path = require('path')
const { to_javascript } = require('@ritani/to-simple-js');
const { values_maps, certificate_full_names } = require('@ritani/diamond-glossary');

const { std_fields, sample_diamonds: diamonds} = require('../cfg');

const write_to_csv = require('./write-to-csv');

module.exports = (fullpath, filename = 'instruction.csv') => {
    if (!fs.existsSync(fullpath)) {
        fs.mkdirSync(fullpath, {recursive: true});
    }
    const instruction_filepath = node_path.join(fullpath, filename);
    const fields_map = [];
    const instruction_fields = ['field', 'description', 'type', 'require', 'allowed_values', 'dictionary', 'example' ];
    const instructions = []; 
    for (const item of std_fields) {
        const { key, description, type, require, values} = item;
        let example = '';
        for (const diamond of diamonds) {
            const value = diamond[key];
            if (value !== '' && value !== undefined && value !== null) {
                example = value;
                break;
            }
        }
        const allowed_values = values ? values.join(', ') : ''
        const field_map = { key, type, require, description };
        let dictionary = '';
        if (allowed_values) {
            field_map.allowed_values = allowed_values;
            if (key === 'certificate_lab') {
                field_map.dictionary = certificate_full_names;
                dictionary = to_javascript(certificate_full_names);
            } else {
                field_map.dictionary = values_maps[key].map;
                dictionary = to_javascript(values_maps[key].map);
            }
            const lines = dictionary.split('\n');
            lines.shift();
            lines.pop();
            for (let i = 0; i < lines.length; i++) {
                lines[i] = lines[i].replace(/^ {2}/, '').replace(',', '');
            }
            dictionary = lines.join('; ');
        }
        instructions.push({field: key, description, type, require, allowed_values, dictionary, example});
        fields_map.push(field_map);
    }
    write_to_csv(instruction_filepath, instructions, instruction_fields);
};