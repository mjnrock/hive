import Node from "./../Node";
import { Bitwise } from "./../ext/Helper";

export const EnumEventType = {
    MOUSE_MASK: "MouseNode.Mask",
    MOUSE_DOWN: "MouseNode.Down",
    MOUSE_UP: "MouseNode.Up",
    MOUSE_MOVE: "MouseNode.Move",
    MOUSE_CONTEXT_MENU: "MouseNode.ContextMenu",
    MOUSE_SELECTION: "MouseNode.Selection",
    MOUSE_SWIPE: "MouseNode.Swipe",
};

export default class MouseNode extends Node {
    constructor({ element, state = {}, config = {} } = {}) {
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
            mask: 0,
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

            ...state,
        });

        this.mergeConfig({
            allowComplexActions: false,
            moveRequiresButton: true,

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

    updateMask(e) {
        let mask = this.state.mask;

        for(let entry of this.state.map) {
            if(entry.button === e.which) {
                if(Bitwise.has(mask, entry.flag)) {
                    mask = Bitwise.remove(mask, entry.flag);
                } else {
                    mask = Bitwise.add(mask, entry.flag)
                }
            }
        }
        this.state = {
            ...this.state,
            mask
        };

        if(this.config.allowComplexActions === true) {
            this.dispatch(EnumEventType.MOUSE_MASK, this.state.mask);
        }
    }

    get _selection() {
        return {
            begin: (e) => {
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));

                if(btn) {
                    this.state.selection[ btn ] = [];
                    this.state.selection[ btn ].push([ e.x, e.y, Date.now() ]);

                    setTimeout(() => {
                        if(this.state.selection[ btn ].length) {
                            this.state.selection[ btn ] = [];
                        }
                    }, this.config.selection.timeout);
                }
            },
            end: (e) => {
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));
                
                if(btn) {
                    this.state.selection[ btn ].push([ e.x, e.y, Date.now() ]);

                    const [ [ x0, y0, t0 ], [ x1, y1, t1 ] ] = this.state.selection[ btn ];
                    const dx = x1 - x0;
                    const dy = y1 - y0;
                    const dt = t1 - t0;

                    if(dt <= this.config.selection.timeout && (Math.abs(dx) >= this.config.selection.threshold && Math.abs(dy) >= this.config.selection.threshold)) {
                        this.dispatch(EnumEventType.MOUSE_SELECTION, {
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
                        });
                    }
                    this.state.selection[ btn ] = [];
                }
            },
        }
    }
    get _swipe() {
        return {
            begin: (e) => {
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));

                if(btn) {
                    this.state.swipe[ btn ] = [];
                    this.state.swipe[ btn ].push([ e.x, e.y, Date.now() ]);

                    setTimeout(() => {
                        if(this.state.swipe[ btn ].length) {
                            this.state.swipe[ btn ] = [];
                        }
                    }, this.config.swipe.timeout);
                }
            },
            end: (e) => {
                const btn = e.which === 1 ? "left" : (e.which === 2 ? "middle" : (e.which === 3 ? "right" : null));
                
                if(btn) {
                    this.state.swipe[ btn ].push([ e.x, e.y, Date.now() ]);

                    const [ [ x0, y0, t0 ], [ x1, y1, t1 ] ] = this.state.swipe[ btn ];
                    const dx = x1 - x0;
                    const dy = y1 - y0;
                    const dt = t1 - t0;

                    if(dt <= this.config.swipe.timeout && (Math.abs(dx) >= this.config.swipe.threshold || Math.abs(dy) >= this.config.swipe.threshold)) {
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

                        this.dispatch(EnumEventType.MOUSE_SWIPE, {
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
                        });
                    }
                    this.state.swipe[ btn ] = [];
                }
            },
        }
    }

    onMouseDown(e) {
        e.preventDefault();

        this.updateMask(e);
        this.dispatch(EnumEventType.MOUSE_DOWN, e);

        this._selection.begin(e);
        this._swipe.begin(e);
    }
    onMouseUp(e) {
        e.preventDefault();

        this.updateMask(e);
        this.dispatch(EnumEventType.MOUSE_UP, e);

        this._selection.end(e);
        this._swipe.end(e);
    }
    onMouseMove(e) {
        e.preventDefault();

        this.updateMask(e);

        if(this.config.moveRequiresButton === true) {
            if(e.buttons > 0) {
                this.dispatch(EnumEventType.MOUSE_MOVE, e);
            }
        } else {
            this.dispatch(EnumEventType.MOUSE_MOVE, e);
        }
    }
    onContextMenu(e) {
        e.preventDefault();

        this.updateMask(e);
        this.dispatch(EnumEventType.MOUSE_CONTEXT_MENU, e);
    }
}