import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export const EnumEventType = {
    UPDATE: "Registry.Update",
};

export default class Registry extends EventEmitter {
    constructor({ setter, getter, entries = [], state = {} } = {}) {
        super({
            entries: new Map(entries),
            //? @getter/@setter are key/key-value hooks, allowing functions to dynamically modify parameters, if needed (i.e. get/set rules)
            getter: getter,     // Modify the @key when using this.get(...)
            setter: setter,     // Modify the @key and @value when using this.set(...)
            
            ...state
        });
        this.id = uuidv4();
    }

    //? This allows this.get(key) to be modified dynamically to instead return this.state.entries.get(this.getter(key))
    get getter() {
        return this.state.getter;
    }
    set getter(fn) {
        if(typeof fn === "function") {
            this.mergeState({
                getter: fn,
            });
        }
    }

    //? This allows this.set(key, value) to be modified dynamically to instead execute this.state.entries.set(...this.setter(key, value))
    get setter() {
        return this.state.setter;
    }
    set setter(fn) {
        if(typeof fn === "function") {
            this.mergeState({
                setter: fn,
            });
        }
    }

    get entries() {
        return this.state.entries;
    }

    get size() {
        return this.entries.size;
    }

    get isEmpty() {
        return this.size === 0;
    }

    empty() {
        return this.entries.clear();
    }

    get(key) {
        if(this.getter) {
            const k = this.getter(key);

            return this.entries.get(k);
        }

        return this.entries.get(key);
    }
    set(key, value, { suppress = false } = {}) {
        if(this.setter) {
            const [ k, v ] = this.setter(key, value);

            this.entries.set(k, v);

            if(suppress !== true) {
                this.emit(EnumEventType.UPDATE, k, v, Date.now());
            }
        } else {
            this.entries.set(key, value);

            if(suppress !== true) {
                this.emit(EnumEventType.UPDATE, key, value, Date.now());
            }
        }

        return this;
    }
    remove(key) {
        if(this.getter) {
            const k = this.getter(key);

            return this.entries.delete(k);
        }

        return this.entries.delete(key);
    }

    has(key) {
        if(this.getter) {
            const k = this.getter(key);

            return this.entries.has(k);
        }

        return this.entries.has(key);
    }
    includes(value) {
        return [ ...this.entries.values() ].some(entry => entry === value);
    }

    /**
     * Contextually iterate over @input and apply @filter(key, value) at a row level (if filter result is *true*), if included; else, this.set(key, value)
     * @param {Registry|Map|Array|Object} input 
     * @param {?fn} filter | 
     */
    merge(input, filter) {
        const setter = (key, value) => {            
            if(typeof filter === "function") {
                if(filter(key, value) === true) {
                    this.set(key, value);
                }
            } else {
                this.set(key, value);
            }
        };

        if(input instanceof Registry) {
            for(let [ key, value ] of input.entries) {
                setter(key, value);
            }
        } else if(input instanceof Map) {
            for(let [ key, value ] of input) {
                setter(key, value);
            }
        } else if(Array.isArray(input)) {
            for(let [ key, value ] of input) {
                if(key !== void 0 && value !== void 0) {
                    setter(key, value);
                }
            }
        } else if(typeof input === "object") {
            Object.entries(input).forEach(([ key, value ]) => setter(key, value));
        }

        return this;
    }

    each(fn, { save = false } = {}) {
        if(typeof fn === "function") {
            if(save === true) {
                for(let [ key, value ] of this.entries) {
                    this.set(key, fn.call(this, key, value), { suppress: true });
                }

                this.emit(EnumEventType.UPDATE, Date.now());
            } else {
                //  This is intentionally left to manually use .getter (scope = this), if present; as this should remain a raw iterator
                for(let [ key, value ] of this.entries) {
                    fn.call(this, key, value);
                }
            }
        }

        return this;
    }
};