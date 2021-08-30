#!/usr/bin/env node

'use strict';

const { get_program, run_program } =  require('../lib/cmds');

(async () => {
    const program = get_program();
    await run_program(program);
})();
