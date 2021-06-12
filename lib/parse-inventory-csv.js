'use strict';

const csv = require("csvtojson");
const validate_fields_map = require('./util/validate-fields-map');
const validate_header =  require('./util/validate-header');
const convert_diamond = require('./util/convert-diamond');
const std_fields = require('./cfg/4-std-fields');

module.exports = parse_inventory_csv;

async function parse_inventory_csv(csv_filepath, fields_map, agreed_header) {

    if (!csv_filepath) {
        throw new Error('csv_filepath is missing');
    }
    if (!fields_map) {
        throw new Error('required fields_map is missing');
    }
    if (!agreed_header || !Array.isArray(agreed_header)) {
        throw new Error('agreed_header is not array');
    }

    // validate fields_map
    //
    const errors = validate_fields_map(fields_map);
    if (errors && errors.length > 0) {
        return {errors};
    }

    let header_errors, is_std_header = false;

    const convertor = csv({trim: true});

    convertor.on('header', (header) => {

        // validate header
        //
        const result = validate_header(header, agreed_header);

        if (result !== 'ok') {

            if (result === 'std') {
                is_std_header = true;
            } else {
                header_errors = result;
            }

        }
    });
    
    const diamonds = [];
    const timestamp = Date.now();
    let ok_count = 0;
    
    convertor.subscribe((row, index) => {

        // convert, validate and collect data per row
        // 
        const diamond = is_std_header ?
            convert_diamond(timestamp, index, row, std_fields) :
            convert_diamond(timestamp, index, row, fields_map); 
    
        if (diamond.pass) {
            ok_count++;
        }
    
        diamonds.push(diamond);

    });
    
    // start it
    await convertor.fromFile(csv_filepath);

    // prepare result
    //
    const result = {ok_count, total: diamonds.length, created_at: new Date(timestamp)};
    if (header_errors && header_errors.length > 0) {
        result.header_errors = header_errors;
    }
    if (diamonds.length > 0) {
        result.diamonds = diamonds;
    }

    return result;
}
