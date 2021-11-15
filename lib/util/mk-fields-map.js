'use strict';

const { to_simple_js } = require('@ritani/to-simple-js');

const { get_fields_map } = require('../core');

module.exports = async (header_stats, previous, options) => {

    const {fields_map, fields_not_used} = await get_fields_map(header_stats, previous, options);

    const comments = [
        {
               starting: '    dictionary:',
            replacement: '\n /* for your reference:\n',
                    end: '    }'
        },
        {
               starting: '    values_map:',
                 insert: '\n // if there is ? or wrong mapping, replace it with one of the allowed values\n',
        },
        {
               starting: '    description:',
            replacement: '\n // description:'
        },
        {
               starting: '    require:',
            replacement: ' // require:'
        },
        {
                starting: '    type:',
             replacement: ' // type:'
        },
        {
                starting: '    allowed_values:',
             replacement: '\n // allowed_values::'
        },
        {
                starting: '    field: \'?',
                  insert: '\n // replace the ? with matched field name and uncomment the line, OR provide default_value\n'
        },
        {
                starting: '    field: \'*',
                  insert: '\n // replace the *? with matched field name and uncomment the line, OR provide default_value\n'
        },
    ];

    let disclaim = '// This is a reference and draft version of fields maps based on the data you provided.\n';
    disclaim += '// It is vendor\'s responsibility to make it correct and accurate.\n\n';
    disclaim += '// PLEASE MAKE SURE cost and cost_per_carat are mapped CORRECTLY.\n';
    disclaim += '// You can use one of two fields, leave another unmapped or empty.\n\n';

    if (fields_not_used.length > 0) {
        comments.unshift({starting: 2, replacement: `${disclaim}// fields not used: \n// ${fields_not_used.join(', ')}\n`});
    } else {
        comments.unshift({starting: 2, replacement: disclaim});
    }

    const result = to_simple_js('fields_map', fields_map, comments);

    return result;
};