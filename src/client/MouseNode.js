import Node from "./../Node";
import { Bitwise } from "./../ext/Helper";

export const EnumMessageType = {
    MOUSE_MASK: "MouseNode.Mask",
    MOUSE_DOWN: "MouseNode.Down",
    MOUSE_UP: "MouseNode.Up",
    MOUSE_MOVE: "MouseNode.Move",
    MOUSE_CLICK: "MouseNode.Click",
    MOUSE_DOUBLE_CLICK: "MouseNode.DoubleClick",
    MOUSE_CONTEXT_MENU: "MouseNode.ContextMenu",
    MOUSE_SELECTION: "MouseNode.Selection",
    MOUSE_SWIPE: "MouseNode.Swipe",
};

export const EnumActionFlags = {
    MOUSE_MASK: 2 << 0,
    MOUSE_DOWN: 2 << 1,
    MOUSE_UP: 2 << 2,
    MOUSE_MOVE: 2 << 3,
    MOUSE_CLICK: 2 << 4,
    MOUSE_DOUBLE_CLICK: 2 << 5,
    MOUSE_CONTEXT_MENU: 2 << 6,
    MOUSE_SELECTION: 2 << 7,
    MOUSE_SWIPE: 2 << 8,

    fullMask() {
        let mask = Object.entries(EnumActionFlags).map(([ key, value ]) => {
            if(key[ 0 ] === "M") {
                return value;
            }

            return 0;
        });

        return mask.reduce((a, v) => Bitwise.add(a, v), 0);
    },
    all() {
        return Object.entries(EnumActionFlags).map(([ key, value ]) => {
            if(key[ 0 ] === "M") {
                return value;
            }

            return false;
        }).filter(v => v !== false);
    }
};

export default class MouseNode extends Hive.Node {
    constructor({ element, state = {}, config = {}, ignore = [], only = [] } = {}) {
        super({
            map: [
                {
                    button: 1,
                    flag: 2 << 0,
                    name: "LEFT",
                },
                {
                    button: 2,
                    flag: 2 << 1,
                    name: "MIDDLE",
                },
                {
                    button: 3,
                    flag: 2 << 2,
                    name: "RIGHT",
                },
            ],
            mask: {
                current: 0,
                previous: 0,
            },
            element: element,
            
            // hooks: {},

            selection: {
                left: [],
                middle: [],
                right: [],
            },
            swipe: {
                left: [],
                middle: [],
                right: [],
            },
            click: {
                left: [],
                middle: [],
                right: [],
            },
            doubleClick: {
                left: [],
                middle: [],
                right: [],
            },

            ...state,
        });

        if(only.length) {
            ignore = EnumActionFlags.all().filter(v => !only.includes(v));
        }

        this.mergeConfig({
            moveRequiresButton: true,

            actions: Bitwise.add(0,
                ignore.includes(EnumActionFlags.MOUSE_CLICK) ? 0 : EnumActionFlags.MOUSE_CLICK,
                ignore.includes(EnumActionFlags.MOUSE_CONTEXT_MENU) ? 0 : EnumActionFlags.MOUSE_CONTEXT_MENU,
                ignore.includes(EnumActionFlags.MOUSE_DOUBLE_CLICK) ? 0 : EnumActionFlags.MOUSE_DOUBLE_CLICK,
                ignore.includes(EnumActionFlags.MOUSE_DOWN) ? 0 : EnumActionFlags.MOUSE_DOWN,
                ignore.includes(EnumActionFlags.MOUSE_MASK) ? 0 : EnumActionFlags.MOUSE_MASK,
                ignore.includes(EnumActionFlags.MOUSE_MOVE) ? 0 : EnumActionFlags.MOUSE_MOVE,
                ignore.includes(EnumActionFlags.MOUSE_SELECTION) ? 0 : EnumActionFlags.MOUSE_SELECTION,
                ignore.includes(EnumActionFlags.MOUSE_SWIPE) ? 0 : EnumActionFlags.MOUSE_SWIPE,
                ignore.includes(EnumActionFlags.MOUSE_UP) ? 0 : EnumActionFlags.MOUSE_UP,
            ),
            click: {
                timeout: 500,
                threshold: 25,
            },
            doubleClick: {
                timeout: 500,
                threshold: 25,
            },
            swipe: {
                timeout: 500,
                threshold: 75,
            },
            selection: {
                timeout: 5000,
                threshold: 20
            },

            ...config,
        });

        if(element) {
            element.onmousedown = e => this.onMouseDown.call(this, e);
            element.onmouseup = e => this.onMouseUp.call(this, e);
            element.onmousemove = e => this.onMouseMove.call(this, e);
            element.oncontextmenu = e => this.onContextMenu.call(this, e);
        }
    }

    get mask() {
        return this.state.mask.current;
    }
    get actionMask() {
        return this.config.actions;
    }

    get element() {
        return this.state.element;
    }

    updateMask(e, action) {
        let mask = this.state.mask.current;

        for(let entry of this.state.map) {
            if(entry.button === e.which) {
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

        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_MASK)) {
            if(this.state.mask.current !== this.state.mask.previous) {
                this.dispatch(EnumMessageType.MOUSE_MASK, this.state.mask.current);
            }
        }
    }

    getRelativePosition(e) {
        if("getBoundingClientRect" in (this.element || {})) {
            const { x, y } = this.element.getBoundingClientRect();

            return {
                x: e.x - x,
                y: e.y - y,
            };
        }

        return {
            x: e.x,
            y: e.y,
        }
    }

    get _click() {
        return {
            begin: (e) => {
                const { x, y } = this.getRelativePosition(e);
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));

                if(btn) {
                    this.state.click[ btn ] = [];
                    this.state.click[ btn ].push([ x, y, Date.now() ]);

                    setTimeout(() => {
                        if(this.state.click[ btn ].length) {
                            this.state.click[ btn ] = [];
                        }
                    }, this.config.click.timeout);
                }
            },
            end: (e) => {
                const { x, y } = this.getRelativePosition(e);
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));
                
                if(btn) {
                    this.state.click[ btn ].push([ x, y, Date.now() ]);

                    if(this.state.click[ btn ].length === 2) {
                        const [ [ x0, y0, t0 ], [ x1, y1, t1 ] ] = this.state.click[ btn ];
                        const dx = x1 - x0;
                        const dy = y1 - y0;
                        const dt = t1 - t0;
    
                        if(dt <= this.config.click.timeout && (Math.abs(dx) <= this.config.click.threshold && Math.abs(dy) <= this.config.click.threshold)) {
                            this.dispatch(EnumMessageType.MOUSE_CLICK, {
                                mask: this.state.mask.current,
                                button: btn,
                                start: {
                                    x: x0,
                                    y: y0,
                                },
                                end: {
                                    x: x1,
                                    y: y1,
                                },
                                target: {
                                    width: this.element.width || window.innerWidth,
                                    height: this.element.height || window.innerHeight,
                                },
                            });
                        }
                        this.state.click[ btn ] = [];
                    }
                }
            },
        }
    }
    get _doubleClick() {
        return {
            begin: (e) => {
                const { x, y } = this.getRelativePosition(e);
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));

                if(btn) {
                    const prevEntry = this.state.doubleClick[ btn ][ 0 ];
                    if(prevEntry && prevEntry[ 3 ]) {
                        clearTimeout(prevEntry[ 3 ]);

                        const timeout = setTimeout(() => {
                            if(this.state.doubleClick[ btn ].length) {
                                this.state.doubleClick[ btn ] = [];
                            }
                        }, this.config.doubleClick.timeout);
                        
                        this.state.doubleClick[ btn ].push([ x, y, Date.now(), timeout ]);
                    } else {
                        this.state.doubleClick[ btn ] = [];
    
                        const timeout = setTimeout(() => {
                            if(this.state.doubleClick[ btn ].length) {
                                this.state.doubleClick[ btn ] = [];
                            }
                        }, this.config.doubleClick.timeout);
                        
                        this.state.doubleClick[ btn ].push([ x, y, Date.now(), timeout ]);
                    }
                }
            },
            end: (e) => {
                const { x, y } = this.getRelativePosition(e);
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));
                
                if(btn) {
                    this.state.doubleClick[ btn ].push([ x, y, Date.now() ]);

                    if(this.state.doubleClick[ btn ].length === 4) {
                        const [ [ x0, y0, t0 ], [ x1, y1, t1 ] ] = this.state.doubleClick[ btn ];
                        const dx = x1 - x0;
                        const dy = y1 - y0;
                        const dt = t1 - t0;
    
                        if(dt <= this.config.doubleClick.timeout && (Math.abs(dx) <= this.config.doubleClick.threshold && Math.abs(dy) <= this.config.doubleClick.threshold)) {
                            this.dispatch(EnumMessageType.MOUSE_DOUBLE_CLICK, {
                                mask: this.state.mask.current,
                                button: btn,
                                start: {
                                    x: x0,
                                    y: y0,
                                },
                                end: {
                                    x: x1,
                                    y: y1,
                                },
                                target: {
                                    width: this.element.width || window.innerWidth,
                                    height: this.element.height || window.innerHeight,
                                },
                            });
                        }
                        this.state.doubleClick[ btn ] = [];
                    }
                }
            },
        }
    }
    get _selection() {
        return {
            begin: (e) => {
                const { x, y } = this.getRelativePosition(e);
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));

                if(btn) {
                    this.state.selection[ btn ] = [];
                    this.state.selection[ btn ].push([ x, y, Date.now() ]);

                    setTimeout(() => {
                        if(this.state.selection[ btn ].length) {
                            this.state.selection[ btn ] = [];
                        }
                    }, this.config.selection.timeout);
                }
            },
            end: (e) => {
                const { x, y } = this.getRelativePosition(e);
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));
                
                if(btn) {
                    this.state.selection[ btn ].push([ x, y, Date.now() ]);

                    if(this.state.selection[ btn ].length === 2) {
                        const [ [ x0, y0, t0 ], [ x1, y1, t1 ] ] = this.state.selection[ btn ];
                        const dx = x1 - x0;
                        const dy = y1 - y0;
                        const dt = t1 - t0;

                        if(dt <= this.config.selection.timeout && (Math.abs(dx) >= this.config.selection.threshold && Math.abs(dy) >= this.config.selection.threshold)) {
                            this.dispatch(EnumMessageType.MOUSE_SELECTION, {
                                mask: this.state.mask.current,
                                button: btn,
                                start: {
                                    x: x0,
                                    y: y0,
                                },
                                end: {
                                    x: x1,
                                    y: y1,
                                },
                                width: x1 - x0,
                                height: y1 - y0,
                                target: {
                                    width: this.element.width || window.innerWidth,
                                    height: this.element.height || window.innerHeight,
                                },
                            });
                        }
                        this.state.selection[ btn ] = [];
                    }
                }
            },
        }
    }
    get _swipe() {
        return {
            begin: (e) => {
                const { x, y } = this.getRelativePosition(e);
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));

                if(btn) {
                    this.state.swipe[ btn ] = [];
                    this.state.swipe[ btn ].push([ x, y, Date.now() ]);

                    setTimeout(() => {
                        if(this.state.swipe[ btn ].length) {
                            this.state.swipe[ btn ] = [];
                        }
                    }, this.config.swipe.timeout);
                }
            },
            end: (e) => {
                const { x, y } = this.getRelativePosition(e);
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));
                
                if(btn) {
                    this.state.swipe[ btn ].push([ x, y, Date.now() ]);

                    if(this.state.swipe[ btn ].length === 2) {
                        const [ [ x0, y0, t0 ], [ x1, y1, t1 ] ] = this.state.swipe[ btn ];
                        const dx = x1 - x0;
                        const dy = y1 - y0;
                        const dt = t1 - t0;

                        if(
                            dt <= this.config.swipe.timeout     // dt isn't too long for a swipe
                            && ((Math.abs(dx) >= this.config.swipe.threshold || Math.abs(dy) >= this.config.swipe.threshold)    // dx or dy meet threshold
                            && !(Math.abs(dx) >= this.config.swipe.threshold && Math.abs(dy) >= this.config.swipe.threshold))   // dx and dy do not BOTH meet threshold (i.e. too diagonal for a swipe)
                        ) {
                            let dir;

                            if(Math.abs(dx) >= Math.abs(dy)) {
                                if(dx > 0) {
                                    dir = "right";
                                } else {                            
                                    dir = "left";
                                }
                            } else {
                                if(dy > 0) {
                                    dir = "down";
                                } else {                            
                                    dir = "up";
                                }
                            }

                            this.dispatch(EnumMessageType.MOUSE_SWIPE, {
                                mask: this.state.mask.current,
                                button: btn,
                                start: {
                                    x: x0,
                                    y: y0,
                                },
                                end: {
                                    x: x1,
                                    y: y1,
                                },
                                magnitude: {
                                    x: dx,
                                    y: dy
                                },
                                direction: dir,
                                target: {
                                    width: this.element.width || window.innerWidth,
                                    height: this.element.height || window.innerHeight,
                                },
                            });
                        }
                        this.state.swipe[ btn ] = [];
                    }
                }
            },
        }
    }

    onMouseDown(e) {
        e.preventDefault();

        this.updateMask(e, true);
        
        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_DOWN)) {
            const { x, y } = this.getRelativePosition(e);
            
            this.dispatch(EnumMessageType.MOUSE_DOWN, {
                mask: this.state.mask.current,
                button: e.button,
                x: x,
                y: y,
                target: {
                    width: this.element.width || window.innerWidth,
                    height: this.element.height || window.innerHeight,
                },
                event: e,
            });
        }

        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_CLICK)) {
            this._click.begin(e);
        }
        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_SELECTION)) {
            this._selection.begin(e);
        }
        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_SWIPE)) {
            this._swipe.begin(e);
        }
        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_DOUBLE_CLICK)) {
            this._doubleClick.begin(e);
        }
    }
    onMouseUp(e) {
        e.preventDefault();

        this.updateMask(e, false);
        
        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_UP)) {
            const { x, y } = this.getRelativePosition(e);

            this.dispatch(EnumMessageType.MOUSE_UP, {
                mask: this.state.mask.current,
                button: e.button,
                x: x,
                y: y,
                target: {
                    width: this.element.width || window.innerWidth,
                    height: this.element.height || window.innerHeight,
                },
                event: e,
            });
        }

        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_CLICK)) {
            this._click.end(e);
        }
        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_SELECTION)) {
            this._selection.end(e);
        }
        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_SWIPE)) {
            this._swipe.end(e);
        }
        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_DOUBLE_CLICK)) {
            this._doubleClick.end(e);
        }
    }
    onMouseMove(e) {        
        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_MOVE)) {
            e.preventDefault();
            
            const { x, y } = this.getRelativePosition(e);

            if(this.config.moveRequiresButton === true) {
                if(e.buttons > 0) {
                    this.dispatch(EnumMessageType.MOUSE_MOVE, {
                        mask: this.state.mask.current,
                        button: e.button,
                        x: x,
                        y: y,
                        target: {
                            width: this.element.width || window.innerWidth,
                            height: this.element.height || window.innerHeight,
                        },
                        event: e,
                    });
                }
            } else {
                this.dispatch(EnumMessageType.MOUSE_MOVE, {
                    mask: this.state.mask.current,
                    button: e.button,
                    x: x,
                    y: y,
                    target: {
                        width: this.element.width || window.innerWidth,
                        height: this.element.height || window.innerHeight,
                    },
                    event: e,
                });
            }
        }
    }
    onContextMenu(e) {
        if(Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_CONTEXT_MENU)) {
            e.preventDefault();
            
            const { x, y } = this.getRelativePosition(e);

            this.dispatch(EnumMessageType.MOUSE_CONTEXT_MENU, {
                mask: this.state.mask.current,
                button: e.button,
                x: x,
                y: y,
                target: {
                    width: this.element.width || window.innerWidth,
                    height: this.element.height || window.innerHeight,
                },
                event: e,
            });
        }
    }
}

// static AttachHook(node, { name, anchor, threshold, timeout, begin, end } = {}) {
//     if(node instanceof MouseNode) {
//         node.mergeState({
//             [ name ]: {
//                 left: [],
//                 middle: [],
//                 right: [],
//             },
//         });
//         node.mergeConfig({
//             [ name ]: {
//                 timeout: timeout,
//                 threshold: threshold,
//             },
//         });

//         if(typeof node.state.hooks[ anchor ] !== "object") {
//             node.state.hooks[ anchor ] = {};
//         }

//         node.state.hooks[ anchor ][ name ] = {
//             begin,
//             end,
//         };
//     }
// }



    // __begin(prop) {
    //     const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));

    //     if(btn && this.state[ prop ] && this.config[ prop ]) {
    //         this.state[ prop ][ btn ] = [];
    //         this.state[ prop ][ btn ].push([ e.x, e.y, Date.now() ]);

    //         setTimeout(() => {
    //             if(this.state[ prop ][ btn ].length) {
    //                 this.state[ prop ][ btn ] = [];
    //             }
    //         }, this.config[ prop ].timeout);
    //     }
    // }
    // __end(eventType, prop, { fn, obj = {} } = {}) {
    //     const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));
        
    //     if(btn && this.state[ prop ] && this.config[ prop ]) {
    //         if(typeof fn === "function") {
    //             fn(btn, [ eventType, prop ]);
    //         } else {
    //             this.state[ prop ][ btn ].push([ e.x, e.y, Date.now() ]);

    //             if(this.state[ prop ][ btn ].length === 2) {
    //                 const [ [ x0, y0, t0 ], [ x1, y1, t1 ] ] = this.state[ prop ][ btn ];
    //                 const dx = x1 - x0;
    //                 const dy = y1 - y0;
    //                 const dt = t1 - t0;

    //                 if(dt <= this.config[ prop ].timeout && (Math.abs(dx) <= this.config[ prop ].threshold && Math.abs(dy) <= this.config[ prop ].threshold)) {
    //                     if(Object.keys(obj).length) {
    //                         this.dispatch(eventType, obj);
    //                     } else {
    //                         this.dispatch(eventType, {
    //                             button: btn,
    //                             start: {
    //                                 x: x0,
    //                                 y: y0,
    //                             },
    //                             end: {
    //                                 x: x1,
    //                                 y: y1,
    //                             },
    //                         });
    //                     }
    //                 }
    //                 this.state[ prop ][ btn ] = [];
    //             }
    //         }            
    //     }
    // }