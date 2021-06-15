'use strict';

const chai = require('chai');
const to_js = require('../lib/util/to-js');

const expect = chai.expect;


// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --reporter spec test/test-to-js 

describe('Test to-js', () => {

    it('test to-js 1', async () => {
        const x = {a: 1, b: '2', c: 'abc'};
        const js = to_js(x);
        //console.log(js);
        expect(js).equals('{\n  a: 1,\n  b: 2,\n  c: \'abc\'\n}')
    });

    it('test to-js 2', async () => {
        const x = {a: 1, b: (x) => console.log(x), c: 'abc'};
        const js = to_js(x);
        //console.log(js);
        expect(js).equals('{\n  a: 1,\n  b: (x) => console.log(x),\n  c: \'abc\'\n}')
    });

});