'use strict';

const get_inventory_filepath = require('./get-inventory-filepath');
const { api_upload_inventory } = require('../core')

module.exports = async () => {
    const inventory_filepath = get_inventory_filepath();
    console.log('api upload inventory ...');
    const result = await api_upload_inventory(inventory_filepath);
    console.log(result);
};