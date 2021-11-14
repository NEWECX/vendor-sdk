'use strict';

// in, nin, all, value_in , value_nin, value_all
//
module.exports = (name, std_field, value) => {

    if (!name || !std_field) {
        return false;
    }
    name = name.trim().toLowerCase();
    if (name === std_field.key) {
        return true;
    }
    if (std_field.require !== 'required' &&  Math.abs(name.length - std_field.key.length) === 1) {
        if (name.startsWith(std_field.key) || std_field.key.startsWith(name)) {
            return true;
        }
    }
    if (!std_field.match) {
        return false;
    }
    
    for (const item of std_field.match) {

        const ops = Object.keys(item)[0];
        const vas = item[ops];

        switch (ops) {

            case 'in': {
                let match = false;
                for (const va of vas) {
                    const regex =  RegExp(va);
                    if (regex.test(name)) {
                        if (std_field.key === 'cost_per_carat' && name === 'POL or Pol/Sym') {
                            console.log(name, va, value);
                        }
                        match = true;
                        break;
                    }
                }
                if (!match) return false;
                break;
            }
            case 'nin': {
                for (const va of vas) {
                    const regex =  RegExp(va);
                    if (regex.test(name)) {
                        return false;
                    }
                }
                break;
            }
            case 'all': {
                for (const va of vas) {
                    const regex =  RegExp(va);
                    if (!regex.test(name)) {
                        return false;
                    }
                }
                break;
            }
            case 'value_in': {
                if (value) {
                    let match = false;
                    for (const va of vas) {
                        const regex =  RegExp(va);
                        if (regex.test(value)) {
                            match = true;
                            break;
                        }
                    }
                    if (!match) return false;
                }
                break;
            }        
            case 'value_nin': {
                if (value) {
                    for (const va of vas) {
                        const regex =  RegExp(va);
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
                        const regex =  RegExp(va);
                        if (!regex.test(value)) {
                            return false;
                        }
                    }
                }
               break;
            }
            case 'ext_in': {
                if (value) {
                    let match = false;
                    const filename = value.split('?')[0].split('/').pop();
                    for (const va of vas) {
                        const regex = RegExp(`\\.${va}$`, 'i');
                        if (regex.test(filename)) {
                            match = true;
                            break;
                        }
                    }
                    if (!match) return false;
                }
                break;
            }        
            case 'ext_nin': {
                if (value) {
                    const filename = value.split('?')[0].split('/').pop();
                    for (const va of vas) {
                        const regex = RegExp(`\\.${va}$`, 'i');
                        if (regex.test(filename)) {
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
};