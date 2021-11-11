#!/usr/bin/env node

'use strict';

require('../lib/cmds/run-at-top');

const { get_program, run_program, /*check_latest_version*/ } =  require('../lib/cmds');

(async () => {
    const program = get_program();
    await run_program(program);
    //check_latest_version(__dirname);
})();
