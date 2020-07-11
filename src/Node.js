import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

import Message from "./Message";
import Command from "./Command";

export const EnumEventType = {
    STATE: "Node.state",
    MESSAGE: "Node.message",
    COMMAND: "Node.command",
    PING: "Node.ping",
};

export default class Node extends EventEmitter {
    constructor(state = {}, { reducers = [], effects = [], governor } = {}) {
        super();

        this.id = uuidv4();
        this._state = state;
        this._governor = governor;
        this._reducers = reducers;
        this._effects = effects;
        this._config = {
            isSelfMessaging: true,
            allowCommands: false,
        };

        this.watchMessages(this);
        this.watchState(this);
        this.watchCommands(this);
        
        this.setMaxListeners(1000);
    }

    get state() {
        return this._state;
    }
    set state(newState) {
        const oldState = this._state;

        this._state = newState;

        this.emit(EnumEventType.STATE, {
            previous: oldState,
            current: newState
        });
    }
    get config() {
        return this._config;
    }

    get governor() {
        return this._governor;
    }
    set governor(fn) {
        if(typeof fn === "function") {
            this._governor = fn;
        }
    }

    mergeState(state = {}) {
        this.state = {
            ...this._state,
            ...state,
        };
    }
    mergeConfig(obj = {}) {
        this._config = {
            ...this._config,
            ...obj,
        };
    }

    flagOn(configEntry) {
        if(configEntry in this._config) {
            this._config[ configEntry ] = true;
        }

        return this;
    }
    flagOff(configEntry) {
        if(configEntry in this._config) {
            this._config[ configEntry ] = false;
        }

        return this;
    }
    flagToggle(configEntry) {
        if(configEntry in this._config) {
            this._config[ configEntry ] = !this._config[ configEntry ];
        }

        return this;
    }

    dispatch(type, payload) {
        this.emit(EnumEventType.MESSAGE, new Message(
            type,
            payload,
            this
        ));
    }
    onMessage(msg) {
        if(!Message.Conforms(msg)) {
            return;
        }

        if((this.config.isSelfMessaging && msg.emitter.id === this.id) || msg.emitter.id !== this.id) {     
            let state = Object.assign({}, this.state);

            if(typeof this.before === "function") {
                this.before.call(this, state, msg);
            }

            for(let reducer of this._reducers) {
                if(typeof reducer === "function") {
                    let newState = reducer.call(this, state, msg) || state;

                    if(!(typeof newState === "object" || Array.isArray(newState))) {
                        newState = [ newState ];
                    }

                    state = newState;
                }
            }

            this.state = state;
            
            if(typeof this.after === "function") {
                this.after.call(this, this.state, msg);
            }

            for(let effect of this._effects) {
                if(typeof effect === "function") {
                    effect.call(this, this.state, msg);
                }
            }
        }
    }
    watchMessages(node, twoWay = false) {
        if(node instanceof EventEmitter) {
            node.on(EnumEventType.MESSAGE, this.onMessage.bind(this));

            if(twoWay) {
                this.on(EnumEventType.MESSAGE, node.onMessage.bind(node));
            }
        }

        return this;
    }
    unwatchMessages(node, twoWay = false) {
        if(node instanceof EventEmitter) {
            node.off(EnumEventType.MESSAGE, this.onMessage.bind(this));

            if(twoWay) {
                this.off(EnumEventType.MESSAGE, node.onMessage.bind(node));
            }
        }

        return this;
    }

    onState(stateObj) {}
    watchState(node, twoWay = false) {
        if(node instanceof EventEmitter) {
            node.on(EnumEventType.STATE, function(stateObj) {
                this.onState(stateObj);
            }.bind(this));

            if(twoWay) {
                this.on(EnumEventType.STATE, function(stateObj) {
                    node.onState(stateObj);
                }.bind(this));
            }
        }

        return this;
    }
    unwatchState(node, twoWay = false) {
        if(node instanceof EventEmitter) {
            node.off(EnumEventType.STATE, function(stateObj) {
                this.onState(stateObj);
            }.bind(this));

            if(twoWay) {
                this.off(EnumEventType.STATE, function(stateObj) {
                    node.onState(stateObj);
                }.bind(this));
            }
        }

        return this;
    }

    command(fn, ...args) {
        this.emit(EnumEventType.COMMAND, new Command(
            fn,
            args,
            this,
        ));
    }
    onCommand(cmd) {
        if(this.config.allowCommands === true) {
            if(!Command.Conforms(cmd)) {
                return;
            }

            if(this.governor) {
                if(this.governor(cmd) === true) {
                    const { fn, args } = cmd;

                    if(typeof this[ fn ] === "function") {
                        return this[ fn ](...args);
                    }
                }
            } else {
                const { fn, args } = cmd;

                if(typeof this[ fn ] === "function") {
                    return this[ fn ](...args);
                }
            }
        }
    }
    watchCommands(node, twoWay = false) {
        if(node instanceof EventEmitter) {
            node.on(EnumEventType.COMMAND, function(cmd) {
                this.onCommand(cmd);
            }.bind(this));

            if(twoWay) {
                this.on(EnumEventType.COMMAND, function(cmd) {
                    node.onCommand(cmd);
                }.bind(this));
            }
        }

        return this;
    }
    unwatchCommands(node, twoWay = false) {
        if(node instanceof EventEmitter) {
            node.off(EnumEventType.COMMAND, function(cmd) {
                this.onCommand(cmd);
            }.bind(this));

            if(twoWay) {
                this.off(EnumEventType.COMMAND, function(cmd) {
                    node.onCommand(cmd);
                }.bind(this));
            }
        }

        return this;
    }

    // Emit a direct event and a Message-driven event
    ping() {
        this.emit(EnumEventType.PING, this.state);
        this.dispatch(EnumEventType.PING, this.state);
    }

    addEffect(fn) {
        if(typeof fn === "function") {
            this._effects.push(fn);
        }
    }
    removeEffect(fn) {
        if(typeof fn === "function") {
            this._effects = this._effects.filter(f => f !== fn);
        }

        return this;
    }

    addReducer() {
        if(arguments.length === 1) {
            const [ reducer ] = arguments;

            if(typeof reducer === "function") {
                this._reducers.push(reducer.bind(this));
            }
        } else if(arguments.length === 2) {
            const [ type, reducer ] = arguments;
            
            if(typeof reducer === "function") {
                this._reducers.push((state, msg) => {
                    if(msg.type === type) {
                        return reducer.call(this, state, msg);
                    }

                    return state;
                });
            }
        }

        return this;
    }
    clearReducers() {
        this._reducers = [];

        return this;
    }

    flatten() {
        const recurse = (state, ancestry = []) => {
            const arr = [];

            for(let key in state) {
                let element = state[ key ];

                if(typeof element === "object" && !Array.isArray(element)) {
                    arr.push(...recurse(element, [ ...ancestry, key ]));
                } else {
                    arr.push([
                        [ ...ancestry, key ].join("."),
                        element
                    ]);
                }
            }

            return arr;
        };

        return recurse(this.state, []);
    }
    unflatten(input) {
        let state = {};

        for(let [ key, value ] of input) {
            if(key.includes(".")) {
                let ancestry = key.split(".");
                let obj = state,
                    pointer = obj;

                for(let i = 0; i < ancestry.length; i++) {
                    let k = ancestry[ i ];

                    if(!pointer[ k ]) {
                        pointer[ k ] = {};
                    }

                    if(i < ancestry.length - 1) {
                        pointer = pointer[ k ];
                    }
                }

                pointer[ ancestry[ ancestry.length - 1] ] = value;
                
                state = {
                    ...state,
                    ...obj
                };
            } else {
                state[ key ] = value;
            }
        }

        this._state = state;

        return this.state;
    }
};