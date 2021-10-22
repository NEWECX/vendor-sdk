'use strict';

const { clarity_values } = require('@ritani/diamond-glossary');

const common_grades = {
    '-': 'F', 
    P: 'F',
    FR: 'F', 
    UX: 'VG',
    convert: (v) => {
       if (v.includes('ID') || v === 'I') return 'EX';
       if (v.includes('EX') || v === 'X' || v === 'E') return 'EX';
       if (v.includes('V')) return 'VG';
       if (v.includes('G')) return 'G';
       if (v.includes('f')) return 'F'; 
    }
};

const mappings = {
    shape: {
        HT: 'HS',
        SQ: 'AS',
        CB: 'CU',
        CS: 'CU',
        RR: 'RD',
        CBSC: 'CU',
        CSRO: 'AS',
        RSPR: 'PR',
        BR: 'RD',
        CMB: 'CU',
        DYCU: 'CU',
        HHT: 'HS',
        AK: 'EM',
        E: 'EM', 
        H: 'HS', 
        B: 'RD', 
        SQR: 'AS',
        T: 'TR',
        AC: 'EM', 
        RAD: 'RA', 
        CB: 'CU',
        SQE: 'EM',
        RC: 'RA',
        EC: 'EM',
        TRIL: 'TR',
        BAG: 'EM',
        SHLD: 'SH',
        HEX: 'AS',
        OT: 'EM',
        PENT: 'PE',
        KT: 'TR',
        U: 'CU',
        RB: 'RD',
        MB: 'MQ',
        'ROSE PEAR': 'PS',
        TRILLIAN: 'TR',
        TRAPEZOID: 'TZ',
        'EUROPEAN CUT': 'RD',
        'ROSE ROUND': 'RD',
        'BRILLIANT ROUND': 'RD', 
        ROSE: 'RD',
        EU: 'RD',
        PEN: 'PE',
        X: 'RD'
    },
    clarity: {
        SI3: 'I1', 
        I4: 'I3',
        '-': 'IF',
        XX2: 'VVS2',
        UI1: 'SI1',
        UI2: 'SI2',
        UVS1: 'VVS1',
        convert: (v) => {
            for (const value of clarity_values) {
                if (v.startsWith(value)) {
                    return value;
                }
            }
        }
    },
    culet_size: {
        POINTED: 'VS',
        LONG: 'LG',
        SM: 'S',
        VSM: 'VS',
        CHIPPED: 'SL',
        VSM: 'VS', 
        SML: 'S',
        ABRADED: 'LG',
        SLG: 'SL',
        SML: 'S',
        NON: 'N',
        NONE: 'N',
        PO: 'VS',
        L: 'LG',
        'LONG FACETED': 'LG'
    },
    fluorescence: {
        NON: 'N',
        SLIGHT: 'M',
        convert: (v) => {
            if (v.startsWith('M')) return 'M';
            if (v.startsWith('S')) return 'S';
            if (v.startsWith('F')) return 'F';
            if (v.startsWith('V') && v.includes('S')) return 'VS';
        }
    },
    cut: common_grades,
    polish: common_grades,
    symmetry: common_grades,
};

module.exports = (key, value) => {
    if (!key || !value) {
        return value;
    }
    const mapping = mappings[key];
    if (!mapping) {
        return value;
    }
    const val = value.toUpperCase();
    if (mapping[val]) {
        return mapping[val];
    } else if (mapping.convert) {
        const v = mapping.convert(val);
        if (v) return v;
    }
    return value;
}