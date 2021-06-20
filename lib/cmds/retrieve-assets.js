'use strict';

const parse_inventory = require('./parse-inventory');
const { download_assets, retrieval_report} = require('../');

async function retrieve_assets() {
    const result = await parse_inventory();
    const diamonds = [];
    for (const diamond of result.diamonds) {
        if (diamond.pass) {
            diamonds.push(diamond);
        }
    }
    if (diamonds.length === 0) {
        throw new Error('no passed diamonds found');
    } else if (diamonds.length > 256) {
        console.log();
        console.log('retrieve assets operation may take a while.');
        console.log(`it depends on internet speed and number of assets to retrieve.`);
        console.log('legend:');
        console.log(' + : a successful asset retrieve');
        console.log(' x : a asset retrieve failed');
        console.log(' . : halt 1 second due to throttle');
        console.log(' * : halt due to server responded: 429 - too many requests');
        console.log(' # : halt due to server responded: 5XX - server internal error');
        console.log('\n');
    }
    const diamonds_stats = await download_assets(diamonds);
    retrieval_report(diamonds_stats)
}

module.exports = retrieve_assets;