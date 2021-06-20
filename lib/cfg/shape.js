'use strict';

const { dictMapping } = require('./utils');

const dict = {
    //ROUND
    b: "RD",
    br: "RD",
    rb: "RD",
    rbc: "RD",
    rd: "RD",
    ro: "RD",
    round: "RD",
    "brilliant round": "RD",
    rmb: "RD",

    //PRINCESS
    pr: "PR",
    pri: "PR",
    princess: "PR",
    sm: "PR",
    square: "PR",
    smb: "PR",

    //EMERALD
    e: "EM",
    ec: "EM",
    em: "EM",
    emerald: "EM",
    emr: "EM",
    se: "EM",
    sq: "EM",
    "sq emerald": "EM",
    "sq.emerald": "EM",
    sqe: "EM",
    sqem: "EM",

    //ASSCHER
    a: "AS",
    ac: "AS",
    as: "AS",
    ash: "AS",
    asher: "AS",
    asscher: "AS",
    x: "AS",
    sem: "AS",

    //OVAL
    o: "OV",
    ol: "OV",
    ov: "OV",
    oval: "OV",
    ob: "OV",

    //CUSHION
    c: "CU",
    cb: "CU",
    cmb: "CU",
    cmb1: "CU",
    cu: "CU",
    cumbr: "CU",
    cush: "CU",
    cushion: "CU",
    "cushion br": "CU",
    "cushion brilliant": "CU",
    "cushion mod": "CU",
    "cushion modified": "CU",

    //MARQUISE
    m: "MQ",
    marquise: "MQ",
    mq: "MQ",
    mb: "MQ",

    //RADIANT
    "long radiant": "RA",
    r: "RA",
    ra: "RA",
    rad: "RA",
    radiant: "RA",
    rc: "RA",
    "sq radiant": "RA",
    "sq.radiant": "RA",
    "square radiant": "RA",
    sr: "RA",
    sqr: "RA",
    crmb: "RA",
    csmb: "RA",

    //PEAR
    p: "PS",
    pe: "PS",
    pear: "PS",
    ps: "PS",
    psh: "PS",
    pb: "PS",

    //HEART
    h: "HS",
    he: "HS",
    heart: "HS",
    hrt: "HS",
    hs: "HS",
    hsh: "HS",
    ht: "HS",
    hb: "HS"
};

module.exports = val => dictMapping(val, dict);
