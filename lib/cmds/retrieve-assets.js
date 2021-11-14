'use strict';

const parse_inventory = require('./parse-inventory');
const { retrieval_report} = require('../util');
const { download_assets } = require('../core');

module.exports = async (options) => {
    const result = await parse_inventory(options);
    const diamonds = [];
    for (const diamond of result.diamonds) {
        if (diamond.pass) {
            diamonds.push(diamond);
        }
    }
    if (diamonds.length === 0) {
        throw new Error('no passed diamonds found');
    } else if (diamonds.length > 256) {
        console.log('');
        console.log('retrieve assets operation may take a while.');
        console.log(`it depends on internet speed and number of assets to retrieve.`);
        console.log('legend:');
        console.log(` ${'+'.green} : a successful asset retrieve`);
        console.log(` ${'x'.red} : an asset retrieve failed`);
        console.log(' . : halt 1 second due to throttle');
        console.log(' * : halt due to server responded: 429 - too many requests');
        console.log(' # : halt due to server responded: 5XX - server internal error');
        console.log('');
    }
    const diamonds_stats = await download_assets(diamonds, true);
    retrieval_report(diamonds_stats)
};