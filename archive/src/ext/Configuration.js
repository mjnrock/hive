import EventEmitter from "events";

export const EnumEventType = {
    UPDATE: "Configuration.Update",
};

/**
 * ! A basic assumption of this class is that ALL Options should be ONLY [] or {}, as any normal situation should have more than 1 choice
 * If a configuration setting only has 1 option, wrap it in an array (e.g. 1 = [ 1 ])
 * [] will be treated as singular entry systems (i.e. key = index, value = arr[ index ])
 * {} will be trated as key-value pair systems (i.e. key = key, value = obj[ key ])
 */
export default class Configuration extends EventEmitter {
    constructor(options, { state = {}, defaultsByKey = {}, defaultsByValue = {} } = {}) {
        super();

        this.state = state;
        this.options = options;

        if(!Object.keys(state).length) {
            for(let option in this.options) {
                if(option in defaultsByKey) {
                    this.setByKey(option, defaultsByKey[ option ], { suppress: true });
                } else if(option in defaultsByValue) {
                    this.setByValue(option, defaultsByValue[ option ], { suppress: true });
                } else {
                    this.state[ option ] = null;
                }
            }
        }
    }

    isValidKey(option, key) {
        let entries = this.options[ option ];

        if(typeof entries === "object") {
            return key in entries;
        }

        return false;
    }
    isValidValue(option, value) {
        let entries = this.options[ option ];

        if(entries) {
            if(Array.isArray(entries)) {
                return entries.indexOf(value) >= 0;
            } else {
                for(let [ k, v ] of Object.entries(entries)) {
                    if(v === value) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    has(option) {
        return !!this.state[ option ];
    }

    key(option) {
        const entry = this.state[ option ] || [];

        return entry[ 0 ];
    }
    value(option) {
        const entry = this.state[ option ] || [];

        return entry[ 1 ];
    }    
    current(option) {
        return this.state[ option ] || [];
    }

    choices(option) {
        return this.options[ option ];
    }
    first(option) {
        const entry = this.options[ option ];

        if(Array.isArray(entry)) {
            return entry[ 0 ];
        } else if(typeof entry === "object") {
            return Object.entries(entry)[ 0 ];
        }
    }
    last(option) {
        const entry = this.options[ option ];

        if(Array.isArray(entry)) {
            return entry[ entry.length - 1 ];
        } else if(typeof entry === "object") {
            return Object.entries(entry)[ entry.length - 1 ];
        }
    }

    set(method, option, input, { suppress = false } = {}) {
        if(method === "key") {
            return this.setByKey(option, input, { suppress });
        } else if(method === "value") {
            return this.setByValue(option, input, { suppress });
        }

        return false;
    }
    setByKey(option, key, { suppress = false } = {}) {
        let entries = this.options[ option ];

        if(entries) {
            const choice = entries[ key ];

            if(choice !== void 0) {
                const oldValue = this.state[ option ];
    
                this.state[ option ] = [ key, choice ];
    
                if(!suppress) {
                    this.emit(EnumEventType.UPDATE, {
                        method: "key",
                        args: [ ...arguments ],
                        previous: oldValue,
                        current: this.state[ option ],
                    });
                }

                return true;
            }
        }

        return false;
    }
    setByValue(option, value, { suppress = false } = {}) {
        let entries = this.options[ option ];

        if(entries) {
            let key,
                choice;
            if(Array.isArray(entries)) {
                key = entries.indexOf(value);

                if(key >= 0) {
                    choice = entries[ key ];
                }
            } else {
                for(let [ k, v ] of Object.entries(entries)) {
                    if(v === value) {
                        key = k;
                        choice = entries[ k ];
                        break;
                    }
                }
            }

            if(choice !== void 0 && key !== void 0) {
                const oldValue = this.state[ option ];

                this.state[ option ] = [ key, choice ];

                if(!suppress) {
                    this.emit(EnumEventType.UPDATE, {
                        method: "value",
                        args: [ ...arguments ],
                        previous: oldValue,
                        current: this.state[ option ],
                    });
                }

                return true;
            }
        }

        return false;
    }



    toObject() {
        return JSON.parse(JSON.stringify(this));
    }
    toJson(beautify = false) {
        if(beautify === true) {
            return JSON.stringify(this, null, 2);
        }

        return JSON.stringify(this);
    }

    static FromJson(json) {
        let obj = json;

        while(typeof obj === "string" || obj instanceof String) {
            obj = JSON.parse(obj);
        }

        return new Configuration(obj.options, {
            state: obj.state,
        });
    }

    toData({ flag = "both" } = {}) {
        if(flag === "both") {
            return this.state;
        }

        let obj = {};

        for(let option in this.state) {
            if(flag === "keys") {
                obj[ option ] = this.state[ option ][ 0 ];
            } else {
                obj[ option ] = this.state[ option ][ 1 ];
            }
        }

        return obj;
    }
    toKeys() {
        return this.toData({ flag: "keys" });
    }
    toValues() {
        return this.toData({ flag: "values" });
    }
}