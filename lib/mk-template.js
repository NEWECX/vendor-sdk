'use strict';

const fs = require('fs');
const node_path = require('path')
const http_client = require('@samwen/http-client');
const extract = require('extract-zip')
const diamonds = require('./cfg/5-template');
const get_std_header = require('./util/get-std-header');
const std_fields = require('./cfg/4-std-fields');
const write_to_csv = require('./util/write-to-csv');

async function mk_template(fullpath) {
    const template_filepath = node_path.join(fullpath, 'template');
    if (!fs.existsSync(template_filepath)) {
        fs.mkdirSync(template_filepath, {recursive: true});
    }
    const inventory_filepath = node_path.join(template_filepath, 'inventory.csv');
    const instruction_filepath = node_path.join(template_filepath, 'instruction.csv');
    {
        const std_header = get_std_header();
        write_to_csv(inventory_filepath, diamonds, std_header);
    }
    {
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
            instructions.push({field: key, description, type, require, allowed_values: values ? values.join(', ') : '', example})
        }
        write_to_csv(instruction_filepath, instructions, instruction_fields);
    }
    {
        const url = 'https://assets.newecx.com/template/assets.zip';
        const local_filepath = node_path.join(template_filepath, 'assets.zip');
        if (fs.existsSync(local_filepath)) {
            fs.unlinkSync(local_filepath);
        }
        const options = {method: 'get', url, local_filepath};
        const response = await http_client(options);
        if (response.status === 200 && fs.existsSync(local_filepath)) {
            const assets_filepath = node_path.join(template_filepath, 'assets');
            try {
                if (fs.existsSync(assets_filepath)) {
                    fs.renameSync(assets_filepath, assets_filepath + '.saved-' + new Date().toISOString().replace(/-|T|:|\.|Z/g, ''));
                }
                await extract(local_filepath, { dir: template_filepath })
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