"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnumEventType = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Node2 = require("./../Node");

var _Node3 = _interopRequireDefault(_Node2);

var _Helper = require("./../ext/Helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumEventType = exports.EnumEventType = {
    MOUSE_MASK: "MouseNode.Mask",
    MOUSE_DOWN: "MouseNode.Down",
    MOUSE_UP: "MouseNode.Up",
    MOUSE_MOVE: "MouseNode.Move",
    MOUSE_CONTEXT_MENU: "MouseNode.ContextMenu",
    MOUSE_SELECTION: "MouseNode.Selection",
    MOUSE_SWIPE: "MouseNode.Swipe"
};

var MouseNode = function (_Node) {
    _inherits(MouseNode, _Node);

    function MouseNode() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            element = _ref.element;

        _classCallCheck(this, MouseNode);

        var _this = _possibleConstructorReturn(this, (MouseNode.__proto__ || Object.getPrototypeOf(MouseNode)).call(this));

        _this.mergeConfig({
            allowComplexActions: false,
            moveRequiresButton: true,

            swipe: {
                timeout: 500,
                threshold: 75
            },
            selection: {
                timeout: 5000,
                threshold: 20
            }
        });

        _this._state = {
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
            mask: 0,
            selection: {
                left: [],
                middle: [],
                right: []
            },
            swipe: {
                left: [],
                middle: [],
                right: []
            }
        };

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
        value: function updateMask(e) {
            var mask = this.state.mask;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.state.map[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var entry = _step.value;

                    if (entry.button === e.which) {
                        if (_Helper.Bitwise.has(mask, entry.flag)) {
                            mask = _Helper.Bitwise.remove(mask, entry.flag);
                        } else {
                            mask = _Helper.Bitwise.add(mask, entry.flag);
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

            this.state = _extends({}, this.state, {
                mask: mask
            });

            if (this.config.allowComplexActions === true) {
                this.dispatch(EnumEventType.MOUSE_MASK, this.state.mask);
            }
        }
    }, {
        key: "onMouseDown",
        value: function onMouseDown(e) {
            e.preventDefault();

            this.updateMask(e);
            this.dispatch(EnumEventType.MOUSE_DOWN, e);

            this._selection.begin(e);
            this._swipe.begin(e);
        }
    }, {
        key: "onMouseUp",
        value: function onMouseUp(e) {
            e.preventDefault();

            this.updateMask(e);
            this.dispatch(EnumEventType.MOUSE_UP, e);

            this._selection.end(e);
            this._swipe.end(e);
        }
    }, {
        key: "onMouseMove",
        value: function onMouseMove(e) {
            e.preventDefault();

            this.updateMask(e);

            if (this.config.moveRequiresButton === true) {
                if (e.buttons > 0) {
                    this.dispatch(EnumEventType.MOUSE_MOVE, e);
                }
            } else {
                this.dispatch(EnumEventType.MOUSE_MOVE, e);
            }
        }
    }, {
        key: "onContextMenu",
        value: function onContextMenu(e) {
            e.preventDefault();

            this.updateMask(e);
            this.dispatch(EnumEventType.MOUSE_CONTEXT_MENU, e);
        }
    }, {
        key: "_selection",
        get: function get() {
            var _this2 = this;

            return {
                begin: function begin(e) {
                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this2.state.selection[btn] = [];
                        _this2.state.selection[btn].push([e.x, e.y, Date.now()]);

                        setTimeout(function () {
                            if (_this2.state.selection[btn].length) {
                                _this2.state.selection[btn] = [];
                            }
                        }, _this2.config.selection.timeout);
                    }
                },
                end: function end(e) {
                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this2.state.selection[btn].push([e.x, e.y, Date.now()]);

                        var _state$selection$btn = _slicedToArray(_this2.state.selection[btn], 2),
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

                        if (dt <= _this2.config.selection.timeout && Math.abs(dx) >= _this2.config.selection.threshold && Math.abs(dy) >= _this2.config.selection.threshold) {
                            _this2.dispatch(EnumEventType.MOUSE_SELECTION, {
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
                                height: y1 - y0
                            });
                        }
                        _this2.state.selection[btn] = [];
                    }
                }
            };
        }
    }, {
        key: "_swipe",
        get: function get() {
            var _this3 = this;

            return {
                begin: function begin(e) {
                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this3.state.swipe[btn] = [];
                        _this3.state.swipe[btn].push([e.x, e.y, Date.now()]);

                        setTimeout(function () {
                            if (_this3.state.swipe[btn].length) {
                                _this3.state.swipe[btn] = [];
                            }
                        }, _this3.config.swipe.timeout);
                    }
                },
                end: function end(e) {
                    var btn = e.which === 1 ? "left" : e.which === 2 ? "middle" : e.which === 3 ? "right" : null;

                    if (btn) {
                        _this3.state.swipe[btn].push([e.x, e.y, Date.now()]);

                        var _state$swipe$btn = _slicedToArray(_this3.state.swipe[btn], 2),
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

                        if (dt <= _this3.config.swipe.timeout && (Math.abs(dx) >= _this3.config.swipe.threshold || Math.abs(dy) >= _this3.config.swipe.threshold)) {
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

                            _this3.dispatch(EnumEventType.MOUSE_SWIPE, {
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
                                direction: dir
                            });
                        }
                        _this3.state.swipe[btn] = [];
                    }
                }
            };
        }
    }]);

    return MouseNode;
}(_Node3.default);

exports.default = MouseNode;