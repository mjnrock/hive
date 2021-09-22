import Entry from "./Entry";

//TODO Dualy link Registry to each Entry to facilitate keeping @keys in check

export default class Registry {
    constructor({ entries = [], version = `1.0.0` } = {}) {
        this.entries = new Map();
        this.version = version;

        this.add(...entries);
    }

    get(...keys) {
        if(keys.length === 1) {
            const entry = this.entries.get(keys[ 0 ]);

            if(entry) {
                return entry.value;
            }
        }

        const arr = [];
        for(let key of keys) {
            const entry = this.entries.get(key);

            if(entry) {
                arr.push(entry.value);
            }
        }

        return arr;
    }

    find(...keys) {        
        if(keys.length === 1) {
            const entry = this.entries.get(keys[ 0 ]);

            if(entry) {
                return entry;
            }
        }

        const arr = [];
        for(let key of keys) {
            const entry = this.entries.get(key);

            if(entry) {
                arr.push(entry);
            }
        }

        return arr;
    }
    add(...entries) {
        for(let entry of entries) {
            if(entry instanceof Entry) {
                for(let key of entry.keys) {
                    this.entries.set(key, entry);
                }

                this.entries.set(entry.id, entry);
            }
        }

        return this;
    }
    remove(...keysOrEntries) {
        for(let keyOrEntry of keysOrEntries) {
            if(keyOrEntry instanceof Entry) {
                for(let key of keyOrEntry.keys) {
                    this.entries.delete(key);
                }

                this.entries.delete(keyOrEntry.id);
            } else if(typeof keyOrEntry === "string" || keyOrEntry instanceof String) {
                const entry = this.find(keyOrEntry);
                
                this.remove(entry);
            }
        }

        return this;
    }

    create(opts = {}) {
        if(typeof opts !== "object") {
            const entry = new Entry({
                value: opts,
                nometa: true,
            });

            this.add(entry);

            return entry;
        }

        const entry = new Entry(opts);

        this.add(entry);

        return entry;
    }

    static Entry(...args) {
        return new Entry(...args);
    }

    patch() {
        const [ major, minor, patch ] = this.version.split(".");
        this.version = `${ major }.${ minor }.${ (~~patch) + 1 }`;

        return this.version;
    }
    minor() {
        const [ major, minor, patch ] = this.version.split(".");
        this.version = `${ major }.${ (~~minor) + 1 }.${ patch }`;

        return this.version;
    }
    major() {
        const [ major, minor, patch ] = this.version.split(".");
        this.version = `${ (~~major) + 1 }.${ minor }.${ patch }`;

        return this.version;
    }
}