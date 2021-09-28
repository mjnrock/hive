"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnumActionFlags = exports.EnumMessageType = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Node2 = require("./../Node");

var _Node3 = _interopRequireDefault(_Node2);

var _Helper = require("./../ext/Helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumMessageType = exports.EnumMessageType = {
    MOUSE_MASK: "MouseNode.Mask",
    MOUSE_DOWN: "MouseNode.Down",
    MOUSE_UP: "MouseNode.Up",
    MOUSE_MOVE: "MouseNode.Move",
    MOUSE_CLICK: "MouseNode.Click",
    MOUSE_DOUBLE_CLICK: "MouseNode.DoubleClick",
    MOUSE_CONTEXT_MENU: "MouseNode.ContextMenu",
    MOUSE_SELECTION: "MouseNode.Selection",
    MOUSE_SWIPE: "MouseNode.Swipe"
};

var EnumActionFlags = exports.EnumActionFlags = {
    MOUSE_MASK: 2 << 0,
    MOUSE_DOWN: 2 << 1,
    MOUSE_UP: 2 << 2,
    MOUSE_MOVE: 2 << 3,
    MOUSE_CLICK: 2 << 4,
    MOUSE_DOUBLE_CLICK: 2 << 5,
    MOUSE_CONTEXT_MENU: 2 << 6,
    MOUSE_SELECTION: 2 << 7,
    MOUSE_SWIPE: 2 << 8,

    fullMask: function fullMask() {
        var mask = Object.entries(EnumActionFlags).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            if (key[0] === "M") {
                return value;
            }

            return 0;
        });

        return mask.reduce(function (a, v) {
            return _Helper.Bitwise.add(a, v);
        }, 0);
    },
    all: function all() {
        return Object.entries(EnumActionFlags).map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                key = _ref4[0],
                value = _ref4[1];

            if (key[0] === "M") {
                return value;
            }

            return false;
        }).filter(function (v) {
            return v !== false;
        });
    }
};

var MouseNode = function (_Node) {
    _inherits(MouseNode, _Node);

    function MouseNode() {
        var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            element = _ref5.element,
            _ref5$state = _ref5.state,
            state = _ref5$state === undefined ? {} : _ref5$state,
            _ref5$config = _ref5.config,
            config = _ref5$config === undefined ? {} : _ref5$config,
            _ref5$ignore = _ref5.ignore,
            ignore = _ref5$ignore === undefined ? [] : _ref5$ignore,
            _ref5$only = _ref5.only,
            only = _ref5$only === undefined ? [] : _ref5$only;

        _classCallCheck(this, MouseNode);

        var _this = _possibleConstructorReturn(this, (MouseNode.__proto__ || Object.getPrototypeOf(MouseNode)).call(this, _extends({
            map: [{
                button: 1,
                flag: 2 << 0,
                name: "LEFT"
            }, {
                button: 2,
                flag: 2 << 1,
                name: "MIDDLE"
            }, {
                button: 3,
                flag: 2 << 2,
                name: "RIGHT"
            }],
            mask: {
                current: 0,
                previous: 0
            },
            element: element,

            // hooks: {},

            selection: {
                left: [],
                middle: [],
                right: []
            },
            swipe: {
                left: [],
                middle: [],
                right: []
            },
            click: {
                left: [],
                middle: [],
                right: []
            },
            doubleClick: {
                left: [],
                middle: [],
                right: []
            }

        }, state)));

        if (only.length) {
            ignore = EnumActionFlags.all().filter(function (v) {
                return !only.includes(v);
            });
        }

        _this.mergeConfig(_extends({
            moveRequiresButton: true,

            actions: _Helper.Bitwise.add(0, ignore.includes(EnumActionFlags.MOUSE_CLICK) ? 0 : EnumActionFlags.MOUSE_CLICK, ignore.includes(EnumActionFlags.MOUSE_CONTEXT_MENU) ? 0 : EnumActionFlags.MOUSE_CONTEXT_MENU, ignore.includes(EnumActionFlags.MOUSE_DOUBLE_CLICK) ? 0 : EnumActionFlags.MOUSE_DOUBLE_CLICK, ignore.includes(EnumActionFlags.MOUSE_DOWN) ? 0 : EnumActionFlags.MOUSE_DOWN, ignore.includes(EnumActionFlags.MOUSE_MASK) ? 0 : EnumActionFlags.MOUSE_MASK, ignore.includes(EnumActionFlags.MOUSE_MOVE) ? 0 : EnumActionFlags.MOUSE_MOVE, ignore.includes(EnumActionFlags.MOUSE_SELECTION) ? 0 : EnumActionFlags.MOUSE_SELECTION, ignore.includes(EnumActionFlags.MOUSE_SWIPE) ? 0 : EnumActionFlags.MOUSE_SWIPE, ignore.includes(EnumActionFlags.MOUSE_UP) ? 0 : EnumActionFlags.MOUSE_UP),
            click: {
                timeout: 500,
                threshold: 25
            },
            doubleClick: {
                timeout: 500,
                threshold: 25
            },
            swipe: {
                timeout: 500,
                threshold: 75
            },
            selection: {
                timeout: 5000,
                threshold: 20
            }

        }, config));

        if (element) {
            element.onmousedown = function (e) {
                return _this.onMouseDown.call(_this, e);
            };
            element.onmouseup = function (e) {
                return _this.onMouseUp.call(_this, e);
            };
            element.onmousemove = function (e) {
                return _this.onMouseMove.call(_this, e);
            };
            element.oncontextmenu = function (e) {
                return _this.onContextMenu.call(_this, e);
            };
        }
        return _this;
    }

    _createClass(MouseNode, [{
        key: "updateMask",
        value: function updateMask(e, action) {
            var mask = this.state.mask.current;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.state.map[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var entry = _step.value;

                    if (entry.button === e.which) {
                        if (action === true) {
                            mask = _Helper.Bitwise.add(mask, entry.flag);
                        } else if (action === false) {
                            mask = _Helper.Bitwise.remove(mask, entry.flag);
                        } else {
                            if (_Helper.Bitwise.has(mask, entry.flag)) {
                                mask = _Helper.Bitwise.remove(mask, entry.flag);
                            } else {
                                mask = _Helper.Bitwise.add(mask, entry.flag);
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.state.mask.previous = this.state.mask.current;
            this.state.mask.current = mask;

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_MASK)) {
                if (this.state.mask.current !== this.state.mask.previous) {
                    this.dispatch(EnumMessageType.MOUSE_MASK, this.state.mask.current);
                }
            }
        }
    }, {
        key: "getRelativePosition",
        value: function getRelativePosition(e) {
            if ("getBoundingClientRect" in (this.element || {})) {
                var _element$getBoundingC = this.element.getBoundingClientRect(),
                    x = _element$getBoundingC.x,
                    y = _element$getBoundingC.y;

                return {
                    x: e.x - x,
                    y: e.y - y
                };
            }

            return {
                x: e.x,
                y: e.y
            };
        }
    }, {
        key: "onMouseDown",
        value: function onMouseDown(e) {
            e.preventDefault();

            this.updateMask(e, true);

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_DOWN)) {
                var _getRelativePosition = this.getRelativePosition(e),
                    x = _getRelativePosition.x,
                    y = _getRelativePosition.y;

                this.dispatch(EnumMessageType.MOUSE_DOWN, {
                    mask: this.state.mask.current,
                    button: e.button,
                    x: x,
                    y: y,
                    target: {
                        width: this.element.width || window.innerWidth,
                        height: this.element.height || window.innerHeight
                    },
                    event: e
                });
            }

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_CLICK)) {
                this._click.begin(e);
            }
            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_SELECTION)) {
                this._selection.begin(e);
            }
            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_SWIPE)) {
                this._swipe.begin(e);
            }
            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_DOUBLE_CLICK)) {
                this._doubleClick.begin(e);
            }
        }
    }, {
        key: "onMouseUp",
        value: function onMouseUp(e) {
            e.preventDefault();

            this.updateMask(e, false);

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_UP)) {
                var _getRelativePosition2 = this.getRelativePosition(e),
                    x = _getRelativePosition2.x,
                    y = _getRelativePosition2.y;

                this.dispatch(EnumMessageType.MOUSE_UP, {
                    mask: this.state.mask.current,
                    button: e.button,
                    x: x,
                    y: y,
                    target: {
                        width: this.element.width || window.innerWidth,
                        height: this.element.height || window.innerHeight
                    },
                    event: e
                });
            }

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_CLICK)) {
                this._click.end(e);
            }
            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_SELECTION)) {
                this._selection.end(e);
            }
            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_SWIPE)) {
                this._swipe.end(e);
            }
            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_DOUBLE_CLICK)) {
                this._doubleClick.end(e);
            }
        }
    }, {
        key: "onMouseMove",
        value: function onMouseMove(e) {
            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_MOVE)) {
                e.preventDefault();

                var _getRelativePosition3 = this.getRelativePosition(e),
                    x = _getRelativePosition3.x,
                    y = _getRelativePosition3.y;

                if (this.config.moveRequiresButton === true) {
                    if (e.buttons > 0) {
                        this.dispatch(EnumMessageType.MOUSE_MOVE, {
                            mask: this.state.mask.current,
                            button: e.button,
                            x: x,
                            y: y,
                            target: {
                                width: this.element.width || window.innerWidth,
                                height: this.element.height || window.innerHeight
                            },
                            event: e
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
                            height: this.element.height || window.innerHeight
                        },
                        event: e
                    });
                }
            }
        }
    }, {
        key: "onContextMenu",
        value: function onContextMenu(e) {
            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.MOUSE_CONTEXT_MENU)) {
                e.preventDefault();

                var _getRelativePosition4 = this.getRelativePosition(e),
                    x = _getRelativePosition4.x,
                    y = _getRelativePosition4.y;

                this.dispatch(EnumMessageType.MOUSE_CONTEXT_MENU, {
                    mask: this.state.mask.current,
                    button: e.button,
                    x: x,
                    y: y,
                    target: {
                        width: this.element.width || window.innerWidth,
                        height: this.element.height || window.innerHeight
                    },
                    event: e
                });
            }
        }
    }, {
        key: "mask",
        get: function get() {
            return this.state.mask.current;
        }
    }, {
        key: "actionMask",
        get: function get() {
            return this.config.actions;
        }
    }, {
        key: "element",
        get: function get() {
            return this.state.element;
        }
    }, {
        key: "_click",
        get: function get() {
            var _this2 = this;

            return {
                begin: function begin(e) {
                    var _getRelativePosition5 = _this2.getRelativePosition(e),
                        x = _getRelativePosition5.x,
                        y = _getRelativePosition5.y;

                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this2.state.click[btn] = [];
                        _this2.state.click[btn].push([x, y, Date.now()]);

                        setTimeout(function () {
                            if (_this2.state.click[btn].length) {
                                _this2.state.click[btn] = [];
                            }
                        }, _this2.config.click.timeout);
                    }
                },
                end: function end(e) {
                    var _getRelativePosition6 = _this2.getRelativePosition(e),
                        x = _getRelativePosition6.x,
                        y = _getRelativePosition6.y;

                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this2.state.click[btn].push([x, y, Date.now()]);

                        if (_this2.state.click[btn].length === 2) {
                            var _state$click$btn = _slicedToArray(_this2.state.click[btn], 2),
                                _state$click$btn$ = _slicedToArray(_state$click$btn[0], 3),
                                x0 = _state$click$btn$[0],
                                y0 = _state$click$btn$[1],
                                t0 = _state$click$btn$[2],
                                _state$click$btn$2 = _slicedToArray(_state$click$btn[1], 3),
                                x1 = _state$click$btn$2[0],
                                y1 = _state$click$btn$2[1],
                                t1 = _state$click$btn$2[2];

                            var dx = x1 - x0;
                            var dy = y1 - y0;
                            var dt = t1 - t0;

                            if (dt <= _this2.config.click.timeout && Math.abs(dx) <= _this2.config.click.threshold && Math.abs(dy) <= _this2.config.click.threshold) {
                                _this2.dispatch(EnumMessageType.MOUSE_CLICK, {
                                    mask: _this2.state.mask.current,
                                    button: btn,
                                    start: {
                                        x: x0,
                                        y: y0
                                    },
                                    end: {
                                        x: x1,
                                        y: y1
                                    },
                                    target: {
                                        width: _this2.element.width || window.innerWidth,
                                        height: _this2.element.height || window.innerHeight
                                    }
                                });
                            }
                            _this2.state.click[btn] = [];
                        }
                    }
                }
            };
        }
    }, {
        key: "_doubleClick",
        get: function get() {
            var _this3 = this;

            return {
                begin: function begin(e) {
                    var _getRelativePosition7 = _this3.getRelativePosition(e),
                        x = _getRelativePosition7.x,
                        y = _getRelativePosition7.y;

                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        var prevEntry = _this3.state.doubleClick[btn][0];
                        if (prevEntry && prevEntry[3]) {
                            clearTimeout(prevEntry[3]);

                            var timeout = setTimeout(function () {
                                if (_this3.state.doubleClick[btn].length) {
                                    _this3.state.doubleClick[btn] = [];
                                }
                            }, _this3.config.doubleClick.timeout);

                            _this3.state.doubleClick[btn].push([x, y, Date.now(), timeout]);
                        } else {
                            _this3.state.doubleClick[btn] = [];

                            var _timeout = setTimeout(function () {
                                if (_this3.state.doubleClick[btn].length) {
                                    _this3.state.doubleClick[btn] = [];
                                }
                            }, _this3.config.doubleClick.timeout);

                            _this3.state.doubleClick[btn].push([x, y, Date.now(), _timeout]);
                        }
                    }
                },
                end: function end(e) {
                    var _getRelativePosition8 = _this3.getRelativePosition(e),
                        x = _getRelativePosition8.x,
                        y = _getRelativePosition8.y;

                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this3.state.doubleClick[btn].push([x, y, Date.now()]);

                        if (_this3.state.doubleClick[btn].length === 4) {
                            var _state$doubleClick$bt = _slicedToArray(_this3.state.doubleClick[btn], 2),
                                _state$doubleClick$bt2 = _slicedToArray(_state$doubleClick$bt[0], 3),
                                x0 = _state$doubleClick$bt2[0],
                                y0 = _state$doubleClick$bt2[1],
                                t0 = _state$doubleClick$bt2[2],
                                _state$doubleClick$bt3 = _slicedToArray(_state$doubleClick$bt[1], 3),
                                x1 = _state$doubleClick$bt3[0],
                                y1 = _state$doubleClick$bt3[1],
                                t1 = _state$doubleClick$bt3[2];

                            var dx = x1 - x0;
                            var dy = y1 - y0;
                            var dt = t1 - t0;

                            if (dt <= _this3.config.doubleClick.timeout && Math.abs(dx) <= _this3.config.doubleClick.threshold && Math.abs(dy) <= _this3.config.doubleClick.threshold) {
                                _this3.dispatch(EnumMessageType.MOUSE_DOUBLE_CLICK, {
                                    mask: _this3.state.mask.current,
                                    button: btn,
                                    start: {
                                        x: x0,
                                        y: y0
                                    },
                                    end: {
                                        x: x1,
                                        y: y1
                                    },
                                    target: {
                                        width: _this3.element.width || window.innerWidth,
                                        height: _this3.element.height || window.innerHeight
                                    }
                                });
                            }
                            _this3.state.doubleClick[btn] = [];
                        }
                    }
                }
            };
        }
    }, {
        key: "_selection",
        get: function get() {
            var _this4 = this;

            return {
                begin: function begin(e) {
                    var _getRelativePosition9 = _this4.getRelativePosition(e),
                        x = _getRelativePosition9.x,
                        y = _getRelativePosition9.y;

                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this4.state.selection[btn] = [];
                        _this4.state.selection[btn].push([x, y, Date.now()]);

                        setTimeout(function () {
                            if (_this4.state.selection[btn].length) {
                                _this4.state.selection[btn] = [];
                            }
                        }, _this4.config.selection.timeout);
                    }
                },
                end: function end(e) {
                    var _getRelativePosition10 = _this4.getRelativePosition(e),
                        x = _getRelativePosition10.x,
                        y = _getRelativePosition10.y;

                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this4.state.selection[btn].push([x, y, Date.now()]);

                        if (_this4.state.selection[btn].length === 2) {
                            var _state$selection$btn = _slicedToArray(_this4.state.selection[btn], 2),
                                _state$selection$btn$ = _slicedToArray(_state$selection$btn[0], 3),
                                x0 = _state$selection$btn$[0],
                                y0 = _state$selection$btn$[1],
                                t0 = _state$selection$btn$[2],
                                _state$selection$btn$2 = _slicedToArray(_state$selection$btn[1], 3),
                                x1 = _state$selection$btn$2[0],
                                y1 = _state$selection$btn$2[1],
                                t1 = _state$selection$btn$2[2];

                            var dx = x1 - x0;
                            var dy = y1 - y0;
                            var dt = t1 - t0;

                            if (dt <= _this4.config.selection.timeout && Math.abs(dx) >= _this4.config.selection.threshold && Math.abs(dy) >= _this4.config.selection.threshold) {
                                _this4.dispatch(EnumMessageType.MOUSE_SELECTION, {
                                    mask: _this4.state.mask.current,
                                    button: btn,
                                    start: {
                                        x: x0,
                                        y: y0
                                    },
                                    end: {
                                        x: x1,
                                        y: y1
                                    },
                                    width: x1 - x0,
                                    height: y1 - y0,
                                    target: {
                                        width: _this4.element.width || window.innerWidth,
                                        height: _this4.element.height || window.innerHeight
                                    }
                                });
                            }
                            _this4.state.selection[btn] = [];
                        }
                    }
                }
            };
        }
    }, {
        key: "_swipe",
        get: function get() {
            var _this5 = this;

            return {
                begin: function begin(e) {
                    var _getRelativePosition11 = _this5.getRelativePosition(e),
                        x = _getRelativePosition11.x,
                        y = _getRelativePosition11.y;

                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this5.state.swipe[btn] = [];
                        _this5.state.swipe[btn].push([x, y, Date.now()]);

                        setTimeout(function () {
                            if (_this5.state.swipe[btn].length) {
                                _this5.state.swipe[btn] = [];
                            }
                        }, _this5.config.swipe.timeout);
                    }
                },
                end: function end(e) {
                    var _getRelativePosition12 = _this5.getRelativePosition(e),
                        x = _getRelativePosition12.x,
                        y = _getRelativePosition12.y;

                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this5.state.swipe[btn].push([x, y, Date.now()]);

                        if (_this5.state.swipe[btn].length === 2) {
                            var _state$swipe$btn = _slicedToArray(_this5.state.swipe[btn], 2),
                                _state$swipe$btn$ = _slicedToArray(_state$swipe$btn[0], 3),
                                x0 = _state$swipe$btn$[0],
                                y0 = _state$swipe$btn$[1],
                                t0 = _state$swipe$btn$[2],
                                _state$swipe$btn$2 = _slicedToArray(_state$swipe$btn[1], 3),
                                x1 = _state$swipe$btn$2[0],
                                y1 = _state$swipe$btn$2[1],
                                t1 = _state$swipe$btn$2[2];

                            var dx = x1 - x0;
                            var dy = y1 - y0;
                            var dt = t1 - t0;

                            if (dt <= _this5.config.swipe.timeout // dt isn't too long for a swipe
                            && (Math.abs(dx) >= _this5.config.swipe.threshold || Math.abs(dy) >= _this5.config.swipe.threshold) && // dx or dy meet threshold
                            !(Math.abs(dx) >= _this5.config.swipe.threshold && Math.abs(dy) >= _this5.config.swipe.threshold) // dx and dy do not BOTH meet threshold (i.e. too diagonal for a swipe)
                            ) {
                                    var dir = void 0;

                                    if (Math.abs(dx) >= Math.abs(dy)) {
                                        if (dx > 0) {
                                            dir = "right";
                                        } else {
                                            dir = "left";
                                        }
                                    } else {
                                        if (dy > 0) {
                                            dir = "down";
                                        } else {
                                            dir = "up";
                                        }
                                    }

                                    _this5.dispatch(EnumMessageType.MOUSE_SWIPE, {
                                        mask: _this5.state.mask.current,
                                        button: btn,
                                        start: {
                                            x: x0,
                                            y: y0
                                        },
                                        end: {
                                            x: x1,
                                            y: y1
                                        },
                                        magnitude: {
                                            x: dx,
                                            y: dy
                                        },
                                        direction: dir,
                                        target: {
                                            width: _this5.element.width || window.innerWidth,
                                            height: _this5.element.height || window.innerHeight
                                        }
                                    });
                                }
                            _this5.state.swipe[btn] = [];
                        }
                    }
                }
            };
        }
    }]);

    return MouseNode;
}(_Node3.default);

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


exports.default = MouseNode;