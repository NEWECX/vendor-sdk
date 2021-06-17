'use strict';

const fs = require('fs');
const node_path = require('path')
const http_client = require('@ritani/http-client');
const { to_simple_js, to_javascript } = require('@ritani/to-simple-js');
const extract = require('extract-zip')
const diamonds = require('./cfg/template');
const get_std_header = require('./util/get-std-header');
const std_fields = require('./cfg/std-fields');
const write_to_csv = require('./util/write-to-csv');
const write_simple_js = require('./util/write-simple-js');
const { values_maps, certificate_full_names } = require('@ritani/diamond-glossary');

async function mk_template(fullpath) {
    if (!fs.existsSync(fullpath)) {
        fs.mkdirSync(fullpath, {recursive: true});
    }
    const inventory_filepath = node_path.join(fullpath, 'inventory.csv');
    const instruction_filepath = node_path.join(fullpath, 'instruction.csv');
    {
        const std_header = get_std_header();
        write_to_csv(inventory_filepath, diamonds, std_header);
        write_simple_js(fullpath, 'agreed-header', std_header);
    }
    {
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
                dictionary = lines.join('\n');
            }
            instructions.push({field: key, description, type, require, allowed_values, dictionary, example});
            fields_map.push(field_map);
        }
        write_to_csv(instruction_filepath, instructions, instruction_fields);

        const comments = [
            {
                   starting: '    dictionary:',
                replacement: '\n /* for your reference:\n',
                        end: '    }'
            },
            {
                   starting: '    values_map:',
                replacement: '\n /* replace the ? with one of the allowed value and uncomment the block\n',
                        end: '    }'
            },
            {
                   starting: '    description:',
                replacement: '\n // description:'
            },
            {
                   starting: '    require:',
                replacement: ' // require:'
            },
            {
                    starting: '    type:',
                 replacement: ' // type:'
            },
            {
                    starting: '    allowed_values:',
                 replacement: '\n // allowed_values::'
            },
            {
                    starting: '    field: \'?',
                 replacement: ' // replace the ? with matched field name and uncomment the line\n // field: \'?'
            },
            {
                    starting: '    field: \'*',
                 replacement: ' // replace the *? with matched field name and uncomment the line\n // field: \'*'
            },
        ];

        const result = to_simple_js('fields_map', fields_map, comments);
        write_simple_js(fullpath, 'fields-map', result);
    }
    {
        const url = 'https://assets.newecx.com/template/assets.zip';
        const local_filepath = node_path.join(fullpath, 'assets.zip');
        if (fs.existsSync(local_filepath)) {
            fs.unlinkSync(local_filepath);
        }
        const options = {method: 'get', url, local_filepath};
        const response = await http_client(options);
        if (response.status === 200 && fs.existsSync(local_filepath)) {
            const assets_filepath = node_path.join(fullpath, 'assets');
            try {
                if (fs.existsSync(assets_filepath)) {
                    fs.renameSync(assets_filepath, assets_filepath + '.saved-' + new Date().toISOString().replace(/-|T|:|\.|Z/g, ''));
                }
                await extract(local_filepath, { dir: fullpath })
                fs.unlinkSync(local_filepath);
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log('failed to download assets.zip')
        }
    }
}

module.exports = mk_template;