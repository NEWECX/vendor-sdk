'use strict';

require('colors');

const csv = require("csvtojson");

const validate_fields_map = require('./validate-fields-map');
const validate_header =  require('./validate-header');
const convert_diamond = require('./convert-diamond');

const clean_fields_maps = require('../util/clean-fields-maps');
const push_errors = require('../util/push-errors');

module.exports = async (csv_filepath, fields_map, agreed_header, options) => {

    if (!csv_filepath) {
        throw new Error('csv_filepath is missing');
    }
    if (!fields_map) {
        throw new Error('required fields_map is missing');
    }
    if (!agreed_header || !Array.isArray(agreed_header)) {
        throw new Error('agreed_header is not array');
    }
    
    fields_map = clean_fields_maps(fields_map);

    // validate fields_map
    //
    const errors = validate_fields_map(fields_map);
    if (errors && errors.length > 0) {
        return {errors};
    }

    const header_errors = [];
    let header_ok;

    const convertor = csv({trim: true});

    convertor.on('header', (header) => {

        // validate header
        //
        header_ok = validate_header(header, agreed_header, fields_map, header_errors);

    });
    
    //console.log(fields_map);

    const diamonds = [];
    const diamond_ids_map = new Map();
    const created_at = new Date();
    let ok_count = 0;
    
    convertor.subscribe(async (row, index) => {

        // convert, validate and collect data per row
        //
        const result = await convert_diamond(row, fields_map, options);

        //console.log(result);

        const diamond = {row_no: index + 1, created_at, ...result}

        if (options && options.diamond_extension) {
            try {
                await options.diamond_extension(diamond, fields_map);
            } catch(err) {
                console.error('ERROR: call diamond_extension', err.message.red);
                if (process.env.DEBUG) {
                    console.error(err);
                }
            }
        }
        if (!header_ok) {
            if (diamond.pass) diamond.pass = false;
        } else if (diamond.pass) {
            ok_count += get_ok_count_inc_with_duplicate_checking(diamond_ids_map, diamond);
        }
        diamonds.push(diamond);

    });
    
    try {
        // start it
        await convertor.fromFile(csv_filepath);

    } catch(err) {

        console.log(err);
    }

    if (header_ok && options && options.diamonds_extension) {
        try {
            if (!await options.diamonds_extension(diamonds, header_errors)) {
                header_ok = false;
            }
        } catch(err) {
            console.error('ERROR: call diamonds_extension', err.message.red);
            if (process.env.DEBUG) {
                console.error(err);
            }
        }
    }

    // prepare result
    //
    const result = {header_ok, ok_count, total: diamonds.length, created_at};
    if (header_errors.length > 0) {
        result.header_errors = header_errors;
    }
    result.diamonds = diamonds;

    return result;
};

function get_ok_count_inc_with_duplicate_checking(diamond_ids_map, diamond) {

    const {certificate_lab, certificate_number} = diamond;
    const diamond_id = `${certificate_lab}-${certificate_number}`;

    const existed_passed = diamond_ids_map.get(diamond_id);
    if (!existed_passed) {
        diamond_ids_map.set(diamond_id, diamond);
        return 1;
    }

    const cost_diff = Math.abs(existed_passed.cost - diamond.cost);

    if (cost_diff >= 10) {

        diamond_ids_map.delete(diamond_id);
        existed_passed.pass = false;
        if (!existed_passed.errors) existed_passed.errors = [];
        push_errors(existed_passed.errors, 'certificate_number', 'error', `duplicated certificate ${certificate_lab}-${certificate_number}, cost different is ${cost_diff}`);
        diamond.pass = false;
        if (!diamond.errors) diamond.errors = [];
        push_errors(diamond.errors, 'certificate_number', 'error', `duplicated certificate ${certificate_lab}-${certificate_number}, cost different is ${cost_diff}`);
        return -1;

    } else if (existed_passed.cost <= diamond.cost) {

        diamond.pass = false;
        if (!diamond.errors) diamond.errors = [];
        push_errors(diamond.errors, 'certificate_number', 'error', `duplicated certificate ${certificate_lab}-${certificate_number} with the same or higher cost`);

    } else {

        diamond_ids_map.set(diamond_id, diamond);
        existed_passed.pass = false;
        if (!existed_passed.errors) existed_passed.errors = [];
        push_errors(existed_passed.errors, 'certificate_number', 'error', `duplicated certificate ${certificate_lab}-${certificate_number} wth higher cost`);

    }

    return 0;
}
