'use strict';

const { dictMapping } = require('./utils');

const dict = {
    f: "F",
    fb: "F",
    faint: "F",
    fa: "F",
    fnt: "F",
    "faint blue": "F",
    sl: "F",
    vsl: "F",
    slight: "F",
    "v slight": "F",
    ft: "F",
    fl1: "F",

    m: "M",
    mb: "M",
    medium: "M",
    med: "M",
    "medium blue": "M",
    "m.blue": "M",
    "m.yellow": "M",
    blue: "M",
    my: "M",
    "md blue": "M",
    fl2: "M",

    n: "N",
    "": "N",
    nn: "N",
    none: "N",
    non: "N",
    no: "N",
    fl0: "N",

    s: "S",
    sb: "S",
    strong: "S",
    stg: "S",
    st: "S",
    "strong blue": "S",
    "s.blue": "S",
    "str..blue": "S",
    "stro..blue": "S",
    str: "S",
    "str blue": "S",
    fl3: "S",

    v: "VS",
    vs: "VS",
    vstb: "VS",
    "very strong": "VS",
    "v-stg": "VS",
    vstg: "VS",
    vsb: "VS",
    "very strong blue": "VS",
    vstr: "VS",
    "v.s.blue": "VS",
    "v strong": "VS",
    "v.strong": "VS",
    fl4: "VS",
    vst: "VS"
};

module.exports = val => dictMapping(val, dict);