import Node from "./../Node";
import { Bitwise } from "./Helper";

export const EnumMessageType = {
    KEY_MASK: "KeyNode.Mask",
    KEY_DOWN: "KeyNode.Down",
    KEY_UP: "KeyNode.Up",
    KEY_PRESS: "KeyNode.Press",
    KEY_CHORD: "KeyNode.Chord",
};

export default class KeyNode extends Node {
    constructor({ element, state = {}, config = {} } = {}) {
        super({
            map: [
                {
                    keys: [ 38, 87 ],
                    flag: 2 << 0,
                    name: "UP",
                },
                {
                    keys: [ 40, 83 ],
                    flag: 2 << 1,
                    name: "DOWN",
                },
                {
                    keys: [ 37, 65 ],
                    flag: 2 << 2,
                    name: "LEFT",
                },
                {
                    keys: [ 39, 68 ],
                    flag: 2 << 3,
                    name: "RIGHT",
                },
            ],
            mask: {
                current: 0,
                previous: 0,
            },
            press: {},

            ...state,
        });

        this.mergeConfig({
            allowComplexActions: false,

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

        if(this.config.allowComplexActions === true && this.state.mask.current !== this.state.mask.previous) {
            this.dispatch(EnumMessageType.KEY_MASK, this.state.mask.current);
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
        this.dispatch(EnumMessageType.KEY_DOWN, {
            mask: this.state.mask.current,
            event: e,
        });

        this._press.begin(e);
        this._chord.end(e);
    }
    onKeyUp(e) {
        e.preventDefault();

        this.updateMask(e, false);
        this.dispatch(EnumMessageType.KEY_UP, {
            mask: this.state.mask.current,
            event: e,
        });

        this._chord.end(e);
        this._press.end(e);
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