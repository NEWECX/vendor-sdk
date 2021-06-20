'use strict';

const { dictMapping } = require('./utils');

const dict = {
    vs: "VS",
    vsm: "VS",
    vsml: "VS",
    "very small": "VS",
    "v.small": "VS",
    v: "VS",

    sl: "SL",
    slg: "SL",
    "slightly large": "SL",

    s: "S",
    sml: "S",
    small: "S",
    sm: "S",

    "": "N",
    n: "N",
    pt: "N",
    p: "N",
    none: "N",
    non: "N",
    no: "N",
    pointed: "N",
    ptd: "N",
    "none pointed": "N",
    "-": "N",
    nn: "N",
    na: "N",
    po: "N",

    m: "M",
    me: "M",
    med: "M",
    md: "M",
    medium: "M",

    lg: "LG",
    l: "LG",
    large: "LG",
    vl: "LG",
    vlg: "LG",
    lge: "LG",
    long: "LG"
};

module.exports = val => dictMapping(val, dict);
