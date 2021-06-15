'use strict';

// in, nin, all, value_in , value_nin, value_all
//
function match_name_value(name, match, value = null) {

    for (const item of match) {

        const ops = Object.keys(item)[0];
        const vas = item[ops];

        switch (ops) {

            case 'in': {
                let matched = false;
                for (const va of vas) {
                    const regex = RegExp(va, 'i');
                    if (regex.test(name)) {
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    return false;
                }
                break;
            }
            case 'nin': {
                for (const va of vas) {
                    const regex = RegExp(va, 'i');
                    if (regex.test(name)) {
                        return false;
                    }
                }
                break;
            }
            case 'all': {
                for (const va of vas) {
                    const regex = RegExp(va, 'i');
                    if (!regex.test(name)) {
                        return false;
                    }
                }
                break;
            }
            case 'value_in': {
                if (value) {
                    let matched = false;
                    for (const va of vas) {
                        const regex = RegExp(va, 'i');
                        if (regex.test(value)) {
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) {
                        return false;
                    }
                }
                break;
            }        
            case 'value_nin': {
                if (value) {
                    for (const va of vas) {
                        const regex = RegExp(va, 'i');
                        if (regex.test(value)) {
                            return false;
                        }
                    }
                }
                break;
            }        
            case 'value_all': {
                if (value) {
                    for (const va of vas) {
                        const regex = RegExp(va, 'i');
                        if (!regex.test(value)) {
                            return false;
                        }
                    }
                }
                break;
            }
            default: {
                throw new Error(`ERROR: operator ${ops} not supported`);
            }        
        }
    }

    return true;
}

module.exports = match_name_value;