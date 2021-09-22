import { v4 as uuidv4 } from "uuid";

export default class Entry {
    constructor({ key = [], value, choices = [], readonly = false, parent, meta = {}, nometa = false, id } = {}) {
        this.id = id || uuidv4();

        this.keys = key;
        this._value = value;

        if(nometa === false) {
            this._meta = {
                readonly,
                choices,
                parent,
    
                ...meta,
            };
        }
    }

    nometa() {
        delete this._meta;

        return this;
    }

    get meta() {
        return this._meta;
    }

    get choices() {
        return this._meta ? this._meta.choices : void 0;
    }
    get parent() {
        return this._meta ? this._meta.parent : void 0;
    }

    get isReadOnly() {
        return this._meta ? this._meta.readonly : void 0;
    }

    get keys() {
        return this._keys;
    }
    set keys(keys) {
        if(Array.isArray(keys)) {
            this._keys = keys;
        } else {
            this._keys = [ keys ];
        }
    }

    add(...keys) {
        this._keys = [ ...new Set([
            ...this.keys,
            ...keys,
        ])];

        return this;
    }
    delete(...keys) {
        this._keys = this.keys.filter(key => !keys.includes(key));

        return this;
    }

    get value() {
        return this._value;
    }
    set value(value) {
        if(this.isReadOnly === true) {
            return this;
        }

        if(this.choices.length) {
            if(this.choices.includes(value)) {
                this._value = value;
            }
        } else {
            this._value = value;
        }

        return this;
    }

    get key() {
        return this.keys[ 0 ];
    }
    get synonyms() {
        return this.keys.slice(1);
    }

    prop(key, value) {
        if(typeof key === "object") {
            this._meta = {
                ...this._meta,
                ...key,
            };
        } else if(value !== void 0) {
            this._meta = this._meta || {};

            this._meta[ key ] = value;
        }

        return this._meta ? this._meta[ key ] : void 0;
    }
}