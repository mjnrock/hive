import Node from "./../Node";
import { Bitwise } from "./../ext/Helper";

export const EnumMessageType = {
    KEY_MASK: "KeyNode.Mask",
    KEY_DOWN: "KeyNode.Down",
    KEY_UP: "KeyNode.Up",
    KEY_PRESS: "KeyNode.Press",
    KEY_CHORD: "KeyNode.Chord",
};

export const EnumMoveDirection = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
};

export const EnumActionFlags = {
    KEY_MASK: 2 << 0,
    KEY_DOWN: 2 << 1,
    KEY_UP: 2 << 2,
    KEY_PRESS: 2 << 3,
    KEY_CHORD: 2 << 4,

    fullMask() {
        let mask = Object.entries(EnumActionFlags).map(([ key, value ]) => {
            if(key[ 0 ] === "K") {
                return value;
            }

            return 0;
        });

        return mask.reduce((a, v) => Bitwise.add(a, v), 0);
    },
    all() {
        return Object.entries(EnumActionFlags).map(([ key, value ]) => {
            if(key[ 0 ] === "K") {
                return value;
            }

            return false;
        }).filter(v => v !== false);
    }
};

export default class KeyNode extends Node {
    constructor({ element, state = {}, config = {}, ignore = [], only = [] } = {}) {
        super({
            map: [
                {
                    keys: [ 38, 87 ],
                    flag: 2 << 0,
                    name: EnumMoveDirection.UP,
                },
                {
                    keys: [ 40, 83 ],
                    flag: 2 << 1,
                    name: EnumMoveDirection.DOWN,
                },
                {
                    keys: [ 37, 65 ],
                    flag: 2 << 2,
                    name: EnumMoveDirection.LEFT,
                },
                {
                    keys: [ 39, 68 ],
                    flag: 2 << 3,
                    name: EnumMoveDirection.RIGHT,
                },
            ],
            mask: {
                current: 0,
                previous: 0,
            },
            press: {},

            ...state,
        });

        if(only.length) {
            ignore = EnumActionFlags.all().filter(v => !only.includes(v));
        }

        this.mergeConfig({
            actions: Bitwise.add(0,
                ignore.includes(EnumActionFlags.KEY_MASK) ? 0 : EnumActionFlags.KEY_MASK,
                ignore.includes(EnumActionFlags.KEY_DOWN) ? 0 : EnumActionFlags.KEY_DOWN,
                ignore.includes(EnumActionFlags.KEY_UP) ? 0 : EnumActionFlags.KEY_UP,
                ignore.includes(EnumActionFlags.KEY_PRESS) ? 0 : EnumActionFlags.KEY_PRESS,
                ignore.includes(EnumActionFlags.KEY_CHORD) ? 0 : EnumActionFlags.KEY_CHORD,
            ),
            press: {
                timeout: 500,
            },
            chord: {
                timeout: 5000,
                threshold: 2,
            },

            ...config,
        });

        if(element) {
            element.onkeydown = e => this.onKeyDown.call(this, e);
            element.onkeyup = e => this.onKeyUp.call(this, e);
        }
    }

    get mask() {
        return this.state.mask.current;
    }
    get actionMask() {
        return this.config.actions;
    }

    get map() {
        const map = {};

        this.state.map.forEach(obj => {
            map[ obj.name ] = obj.flag;
        });

        return map;
    }

    maskToNames(mask) {
        const bitmask = Number.isInteger(mask) ? mask : this.mask;

        return this.state.map.reduce((filtered, obj) => {
            if(Bitwise.has(bitmask, obj.flag)) {
                filtered.push(obj.name);
            }

            return filtered;
        }, []);
    }

    updateMask(e, action) {
        let mask = this.state.mask.current;

        for(let entry of this.state.map) {
            if(entry.keys.includes(e.which)) {
                if(action === true) {
                    mask = Bitwise.add(mask, entry.flag);
                } else if(action === false) {
                    mask = Bitwise.remove(mask, entry.flag);
                } else {
                    if(Bitwise.has(mask, entry.flag)) {
                        mask = Bitwise.remove(mask, entry.flag);
                    } else {
                        mask = Bitwise.add(mask, entry.flag);
                    }
                }
            }
        }
        this.state.mask.previous = this.state.mask.current;
        this.state.mask.current = mask;

        if(Bitwise.has(this.actionMask, EnumActionFlags.KEY_MASK)) {
            if(this.state.mask.current !== this.state.mask.previous) {
                this.dispatch(EnumMessageType.KEY_MASK, this.state.mask.current);
            }
        }
    }

    get _press() {
        return {
            begin: (e) => {
                if(!(this.state.press[ e.which ] || []).length) {
                    this.state.press[ e.which ] = [ Date.now() ];
                }

                setTimeout(() => {
                    if((this.state.press[ e.which ] || []).length) {
                        this.state.press[ e.which ].push(true); // hasExpired flag
                    }
                }, this.config.press.timeout);
            },
            end: (e) => {
                if((this.state.press[ e.which ] || []).length) {
                    const dt = Date.now() - this.state.press[ e.which ][ 0 ];

                    if(dt <= this.config.press.timeout && this.state.press[ e.which ][ 1 ] !== true) {
                        this.dispatch(EnumMessageType.KEY_PRESS, {
                            mask: this.state.mask.current,
                            code: e.which,
                            duration: dt,
                        });
                    }
                    
                    delete this.state.press[ e.which ];
                }
            },
        };
    }
    get _chord() {
        return {
            end: (e) => {
                const now = Date.now();
                const size = Object.keys(this.state.press).length;

                if(size >= this.config.chord.threshold) {
                    if(Object.values(this.state.press).every(([ value ]) => now - value <= this.config.chord.timeout)) {
                        this.dispatch(EnumMessageType.KEY_CHORD, {
                            mask: this.state.mask.current,
                            direction: e.type.replace("key", ""),
                            size: size,
                            shift: "16" in this.state.press,
                            ctlr: "17" in this.state.press,
                            alt: "18" in this.state.press,
                            ...this.state.press,
                        });
                    }
                }
            }
        };
    }

    onKeyDown(e) {
        e.preventDefault();

        this.updateMask(e, true);

        if(Bitwise.has(this.actionMask, EnumActionFlags.KEY_DOWN)) {
            this.dispatch(EnumMessageType.KEY_DOWN, {
                mask: this.state.mask.current,
                code: e.which,
                event: e,
            });
        }

        if(Bitwise.has(this.actionMask, EnumActionFlags.KEY_PRESS)) {
            this._press.begin(e);
        }

        if(Bitwise.has(this.actionMask, EnumActionFlags.KEY_CHORD)) {
            this._chord.end(e);
        }
    }
    onKeyUp(e) {
        e.preventDefault();

        this.updateMask(e, false);

        if(Bitwise.has(this.actionMask, EnumActionFlags.KEY_DOWN)) {
            this.dispatch(EnumMessageType.KEY_UP, {
                mask: this.state.mask.current,
                code: e.which,
                event: e,
            });
        }

        if(Bitwise.has(this.actionMask, EnumActionFlags.KEY_CHORD)) {
            this._chord.end(e);
        }
        if(Bitwise.has(this.actionMask, EnumActionFlags.KEY_PRESS)) {
            this._press.end(e);
        }
    }

    addKeyMask(name, flag, ...keys) {
        if(this.state.map.filter(entry => entry.name === name).length) {
            this.state.map.forEach((entry, i) => {
                if(entry.name === name) {
                    this.state.map[ i ].keys = [ ...new Set([
                        ...this.state.map[ i ].keys,
                        ...keys
                    ]) ];
                    this.state.map[ i ].flag = Number.isInteger(flag) ? flag : this.state.map[ i ].flag;
                }
            });
        } else {
            this.state.map.push({
                keys: keys,
                flag: flag,
                name: name,
            });
        }

        return this;
    }
    removeKeyMask(name) {
        this.state.map = this.state.map.filter(entry => entry.name !== name);

        return this;
    }
    setKeyMask(name, flag, ...keys) {
        this.removeKeyMask(name);
        this.state.map.push({
            keys: keys,
            flag: flag,
            name: name,
        });

        return this;
    }

    addKeyMasks(...nameFlagKeysObjs) {
        for(let { name, flag, keys } of nameFlagKeysObjs) {
            this.addKeyMask(name, flag, keys);
        }

        return this;
    }
}