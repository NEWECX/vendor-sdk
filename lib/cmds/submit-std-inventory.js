'use strict';

const get_std_inventory_filepath = require('./get-std-inventory-filepath');
const { api_upload_inventory } = require('../core')

module.exports = async() => {
    const inventory_filepath = get_std_inventory_filepath();
    console.log('api upload std inventory ...');
    const result = await api_upload_inventory(inventory_filepath);
    console.log(result);
};