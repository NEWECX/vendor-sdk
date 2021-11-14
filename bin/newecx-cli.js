#!/usr/bin/env node

'use strict';

require('./run-at-top');

const { set_options, run_program, /*check_latest_version*/ } =  require('../lib/cmds');

(async () => {
    const program = set_options();
    console.log('');
    await run_program(program);
    //check_latest_version(__dirname);
})();
