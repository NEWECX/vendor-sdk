'use strict';

const fs = require('fs');
const node_path = require('path')
const http_client = require('@samwen/http-client');
const extract = require('extract-zip')
const diamonds = require('./cfg/5-template');
const get_std_header = require('./util/get-std-header');
const std_fields = require('./cfg/4-std-fields');
const write_to_csv = require('./util/write-to-csv');
const write_simple_js = require('./util/write-simple-js');
const to_js = require('./util/to-js');

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
        const instruction_fields = ['field', 'description', 'type', 'require', 'allowed_values', 'example' ];
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
            instructions.push({field: key, description, type, require, allowed_values: values ? values.join(', ') : '', example});
            const field_map = { key, type, require };
            if (values) {
                fields_map.allowed_values = values.join(', ');
            }
            fields_map.description = description;
            fields_map.push(field_map);
        }
        write_to_csv(instruction_filepath, instructions, instruction_fields);
        const js = to_js(fields_map);
        const code_lines = js.split('\n');
        for (let i = 0; i < code_lines.length; i++) {
            let line = code_lines[i];
            line = line.replace('    description:', ' // description:');
            line = line.replace('    require:', ' // require:');
            line = line.replace('    type:', ' // type:');
            line = line.replace('    allowed_values:', ' // allowed_values:');
            code_lines[i] = line;
        }
        const codes = code_lines.join('\n');
        write_simple_js(fullpath, 'fields-map', codes);
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

// (async () => {
//     await mk_template(__dirname);
// })();

module.exports = mk_template;