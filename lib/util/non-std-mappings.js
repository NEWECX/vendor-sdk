'use strict';

const { shape_map, reverse_shape_map, clarity_values } = require('@ritani/diamond-glossary');

const is_empty = require('./is-empty');

const shape_names_map = Object.entries(shape_map).reduce((a, [key, val]) => ({...a, [val.toUpperCase()]: key}), {});

const common_grades = {
    map: {
        UX: 'VG',
        FR: 'F', 
        P: 'P',
        '-': 'F', 
    },
    convert: (v) => {
       if (v.includes('ID') || v === 'I') return 'EX';
       if (v.includes('PERF') || v === 'I') return 'EX';
       if (v.includes('EX') || v === 'X' || v === 'E') return 'EX';
       if (v.includes('V')) return 'VG';
       if (v.includes('G')) return 'G';
       if (v.includes('f')) return 'F'; 
    }
};

const mappings = {
    certificate_lab: {
        map: {AGS: 'AGSL'}
    },
    shape: {
        map: {
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
            'EUROPEAN': 'RD',
            'ROSE ROUND': 'RD',
            'BRILLIANT ROUND': 'RD', 
            ROSE: 'RD',
            EU: 'RD',
            PEN: 'PE',
            X: 'RD',
            'RECT': 'EM',
            'CORNERED SQUARE': 'AS',
            'SQUARE': 'PR',
            'TRIANGULAR': 'TR',
            'HEAR': 'HS',
            'OLD MINE': 'CU',
        },
        convert: (v) => {
            for (const [key, value] of Object.entries(reverse_shape_map)) {
                if (v.includes(key.toUpperCase())) {
                    return value;
                }
            }            
            for (const key in shape_names_map) {
                if (v.includes(key)) {
                    return shape_names_map[key];
                }
            }
        }
    },
    clarity: {
        map: {
            SI3: 'I1', 
            I4: 'I3',
            '-': 'IF',
            XX2: 'VVS2',
            UI1: 'SI1',
            UI2: 'SI2',
            UVS1: 'VVS1',
            'INTERNALLYFLAWLESS': 'IF',
            'INTERNALLY FLAWLESS': 'IF',
        },
        convert: (v) => {
            v = v.split('').filter(x => ['I', 'F', 'L', 'V', 'S', '1', '2', '3'].includes(x)).join('');
            if (clarity_values.includes(v)) {
                return v;
            }
        }
    },
    culet_size: {
        map: {
            POINTED: 'VS',
            CHIPPED: 'SL',
            ABRADED: 'LG',
            PO: 'VS',
        },
        convert: (v) => {
            if (v.startsWith('L')) return 'LG';
            if (v.startsWith('V')) {
                if (v.includes('S')) return 'VS';
                if (v.includes('L')) return 'VL';
            }
            if (v.startsWith('S')) {
                if (v.includes('L')) return 'SL';
                else return 'S';
            }
            if (v.includes('M')) return 'M';
            if (v.startsWith('N')) return 'N';
        }
    },
    fluorescence: {
        map: {
            SLIGHT: 'M',
        },
        convert: (v) => {
            if (v.startsWith('M')) return 'M';
            if (v.startsWith('S')) return 'S';
            if (v.startsWith('F')) return 'F';
            if (v.startsWith('V') && v.includes('S')) return 'VS';
            if (v.startsWith('N')) return 'N';
        }
    },
    cut: {
        map: {
            UX: 'VG',
            P: 'P',
            FR: 'F', 
            '-': 'F', 
        },
        convert: (v) => {
           if (v === 'I') return 'ID';
           if (v.includes('PERF') || v === 'I') return 'ID';
           if (v.includes('EX') || v === 'X' || v === 'E') return 'ID';
           if (v.includes('V')) return 'VG';
           if (v.includes('G')) return 'G';
           if (v.includes('F')) return 'F';
           if (v.startsWith('P')) return 'P';
        }
    },
    polish: common_grades,
    symmetry: common_grades,
    lab_grown: {
        convert: (v) => {
            if (v.startsWith('Y')) return 1;
            if (v.startsWith('N')) return 0;
        }
    }
};

const shape_mapping = mappings.shape.map;
const shape_mapping_keys = Object.keys(shape_mapping).sort((a,b) => b.length - a.length);
const new_shape_mapping = {};
for (const key of shape_mapping_keys) {
    new_shape_mapping[key] = shape_mapping[key];
}
mappings.shape.map = new_shape_mapping;

module.exports = (key, value) => {
    if (!key || !value || !mappings[key]) {
        return value;
    }
    let val = value.toUpperCase()
    const { map, convert } = mappings[key];
    if (map) {
        if (map[val]) return map[val];
        else {
            val = val.replace(/-/g, ' ');
            if (convert) {
                const result = convert(val);
                if (!is_empty(result)) return result;
            }
            for (const [k, v] of Object.entries(map)) {
                if (val.includes(k)) return v;
            }
        }
    }
    return value;
}