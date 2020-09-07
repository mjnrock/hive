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

export const Dice = {
	random: (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	roll: (X, Y, Z = 0) => {
		let value = 0;
		for(let i = 0; i < X; i++) {
			value += Dice.random(1, Y);
		}
		
		return value + Z;
	},

	coin: () => {
		return Dice.roll(1, 2) === 1 ? true : false;
	},

	d2: (Z = 0) => {
		return Dice.roll(1, 2) + Z;
	},
	d3: (Z = 0) => {
		return Dice.roll(1, 3) + Z;
	},
	d4: (Z = 0) => {
		return Dice.roll(1, 4) + Z;
	},
	d6: (Z = 0) => {
		return Dice.roll(1, 6) + Z;
	},
	d10: (Z = 0) => {
		return Dice.roll(1, 10) + Z;
	},
	d12: (Z = 0) => {
		return Dice.roll(1, 12) + Z;
	},
	d20: (Z = 0) => {
		return Dice.roll(1, 20) + Z;
	},
	d25: (Z = 0) => {
		return Dice.roll(1, 25) + Z;
	},
	d50: (Z = 0) => {
		return Dice.roll(1, 50) + Z;
	},
	d100: (Z = 0) => {
		return Dice.roll(1, 100) + Z;
	},

	weighted: (weights, values) => {                
		let total = 0;
		for(let i in weights) {
			total += weights[i];
		}
		
		let roll = Dice.random(1, total);
		
		let count = 0;
		for(let i = 0; i < weights.length; i++) {
			count += weights[i];
			
			if(roll <= count) {
				return values[i];
			}
		}
		
		return values[values.length - 1];
	}
};

export function GenerateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        // eslint-disable-next-line
        let r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        
        return v.toString(16);
    });
}

export class LinkedListNode {
	constructor(data) {
		this._data = data;
		this._previous = null;
		this._next = null;
	}
}

export class LinkedList {
	constructor() {
        this._length = 0;        
		this._head = null;
		this._tail = null;
	}

    size() {
        return this._length;
    }
	get(index) {
		let curr = this._head,
			i = 0;

		if (this._length === 0 || index < 0 || index > this._length - 1) {
			return false;
		}
		
		while (i < index) {
			curr = curr._next;
			i++;
		}
		
		return curr;
	}

	add(value) {
		let node = new LinkedListNode(value);

		if(this._length > 0) {
			this._tail._next = node;
			node._previous = this._tail;
			this._tail = node;
		} else {
			this._head = node;
			this._tail = node;
		}

		this._length++;

		return this;
	}
	remove(index) {
		if (this._length === 0 || index < 0 || index > this._length - 1) {
			return false;
		}

		if(index === 0) {
			if(!this._head._next) {
				this._head = null;
				this._tail = null;
			} else {
				this._head = this._head._next;
			}
		} else if(index === this._length - 1) {
			this._tail = this._tail._previous;
		} else {
			let i = 0,
				curr = this._head;
			while(i < index) {
				curr = curr._next;
				i++;
			}
			
			curr._previous._next = curr._next;
			curr._next._previous = curr._previous;
		}
				
		this._length--;
		if(this._length === 1) {
			this._tail = this._head;
		}
		if(this._length > 0) {
			this._head._previous = null;
			this._tail._next = null;
		}


		return this;
	}
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
    Dice,
    LinkedListNode,
    LinkedList,
    Enumerator,
    NormalizeTheta,
    Clamp,

    DistinctArrayFilter,
    ToDistinctArray,
};