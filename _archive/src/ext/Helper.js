export const Bitwise = {
    add(base, ...flags) {
        flags.forEach(flag => {
            base |= flag;
        });

        return base;
    },    
    remove(base, ...flags) {
        flags.forEach(flag => {
            base &= ~flag;
        });

        return base;
    },    
    has(base, flag) {
        return !!(base & flag);
    }
};

export const DistinctArrayFilter = (value, index, self) => {
    return self.indexOf(value) === index;
};
export const ToDistinctArray = (array) => {
    return array.filter(DistinctArrayFilter);
};

// Array.prototype.distinct = function() {
//     return this.filter(DistinctArrayFilter);
// };

export function GenerateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        // eslint-disable-next-line
        let r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        
        return v.toString(16);
    });
}

export function Clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

export function Enumerator(items = {}) {
    let obj = {
        ...items,
    };

    obj.flagToName = (flag) => {
        for(let name in obj) {
            if(obj[ name ] === flag) {
                return name;
            }
        }

        return null;
    }
    obj.maskToNames = (mask) => {
        let names = [];

        for(let name in obj) {
            if(Bitwise.has(mask, obj[ name ])) {
                names.push(name);
            }
        }

        return names;
    }

    return obj;
};

export class ClassEnumerator {
    constructor(entries = {}) {
        this.entries = entries;

        return new Proxy(this, {
            get: (target, prop) => {
                // console.log(prop, prop in target, target[ prop ]);
                if(prop in target) {
                    return target[ prop ];
                }

                if(prop in this.entries) {
                    return this.entries[ prop ];
                }

                return target;
            },
            set: (target, prop, value) => {
                if(prop in this.entries) {
                    this.entries[ prop ] = value;
                } else {
                    target[ prop ] = value;
                }

                return target;
            }
        })
    }

    flagToName(flag) {
        for(let name in this.entries) {
            if(this.entries[ name ] === flag) {
                return name;
            }
        }

        return null;
    }

    maskToNames(mask) {
        let names = [];

        for(let name in this.entries) {
            if(Bitwise.has(mask, this.entries[ name ])) {
                names.push(name);
            }
        }

        return names;
    }

    has(mask, flag) {
        return Bitwise.has(mask, flag);
    }
    add(mask, ...flags) {
        return Bitwise.add(mask, ...flags);
    }
    remove(mask, ...flags) {
        return Bitwise.remove(mask, ...flags);
    }
}

export function NormalizeTheta(dx, dy, { toNearestDegree = false } = {}) {
    let theta = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if(theta < 0) {
        theta += 360;
    }

    if(typeof toNearestDegree === "number") {
        theta = Math.round(theta / toNearestDegree) * toNearestDegree;
    }

    if(theta % 360 === 0) {
        theta = 0;
    }

    return theta;
}

export default {
    GenerateUUID,
    Bitwise,
    Enumerator,
    NormalizeTheta,
    Clamp,

    DistinctArrayFilter,
    ToDistinctArray,
};