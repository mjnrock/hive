"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnumActionFlags = exports.EnumMoveDirection = exports.EnumMessageType = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Node2 = require("./../Node");

var _Node3 = _interopRequireDefault(_Node2);

var _Helper = require("./../ext/Helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumMessageType = exports.EnumMessageType = {
    KEY_MASK: "KeyNode.Mask",
    KEY_DOWN: "KeyNode.Down",
    KEY_UP: "KeyNode.Up",
    KEY_PRESS: "KeyNode.Press",
    KEY_CHORD: "KeyNode.Chord"
};

var EnumMoveDirection = exports.EnumMoveDirection = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
};

var EnumActionFlags = exports.EnumActionFlags = {
    KEY_MASK: 2 << 0,
    KEY_DOWN: 2 << 1,
    KEY_UP: 2 << 2,
    KEY_PRESS: 2 << 3,
    KEY_CHORD: 2 << 4,

    fullMask: function fullMask() {
        var mask = Object.entries(EnumActionFlags).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            if (key[0] === "K") {
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

            if (key[0] === "K") {
                return value;
            }

            return false;
        }).filter(function (v) {
            return v !== false;
        });
    }
};

var KeyNode = function (_Node) {
    _inherits(KeyNode, _Node);

    function KeyNode() {
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

        _classCallCheck(this, KeyNode);

        var _this = _possibleConstructorReturn(this, (KeyNode.__proto__ || Object.getPrototypeOf(KeyNode)).call(this, _extends({
            map: [{
                keys: [38, 87],
                flag: 2 << 0,
                name: EnumMoveDirection.UP
            }, {
                keys: [40, 83],
                flag: 2 << 1,
                name: EnumMoveDirection.DOWN
            }, {
                keys: [37, 65],
                flag: 2 << 2,
                name: EnumMoveDirection.LEFT
            }, {
                keys: [39, 68],
                flag: 2 << 3,
                name: EnumMoveDirection.RIGHT
            }],
            mask: {
                current: 0,
                previous: 0
            },
            press: {}

        }, state)));

        if (only.length) {
            ignore = EnumActionFlags.all().filter(function (v) {
                return !only.includes(v);
            });
        }

        _this.mergeConfig(_extends({
            actions: _Helper.Bitwise.add(0, ignore.includes(EnumActionFlags.KEY_MASK) ? 0 : EnumActionFlags.KEY_MASK, ignore.includes(EnumActionFlags.KEY_DOWN) ? 0 : EnumActionFlags.KEY_DOWN, ignore.includes(EnumActionFlags.KEY_UP) ? 0 : EnumActionFlags.KEY_UP, ignore.includes(EnumActionFlags.KEY_PRESS) ? 0 : EnumActionFlags.KEY_PRESS, ignore.includes(EnumActionFlags.KEY_CHORD) ? 0 : EnumActionFlags.KEY_CHORD),
            press: {
                timeout: 500
            },
            chord: {
                timeout: 5000,
                threshold: 2
            }

        }, config));

        if (element) {
            element.onkeydown = function (e) {
                return _this.onKeyDown.call(_this, e);
            };
            element.onkeyup = function (e) {
                return _this.onKeyUp.call(_this, e);
            };
        }
        return _this;
    }

    _createClass(KeyNode, [{
        key: "maskToNames",
        value: function maskToNames(mask) {
            var bitmask = Number.isInteger(mask) ? mask : this.mask;

            return this.state.map.reduce(function (filtered, obj) {
                if (_Helper.Bitwise.has(bitmask, obj.flag)) {
                    filtered.push(obj.name);
                }

                return filtered;
            }, []);
        }
    }, {
        key: "updateMask",
        value: function updateMask(e, action) {
            var mask = this.state.mask.current;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.state.map[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var entry = _step.value;

                    if (entry.keys.includes(e.which)) {
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

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.KEY_MASK)) {
                if (this.state.mask.current !== this.state.mask.previous) {
                    this.dispatch(EnumMessageType.KEY_MASK, this.state.mask.current);
                }
            }
        }
    }, {
        key: "onKeyDown",
        value: function onKeyDown(e) {
            e.preventDefault();

            this.updateMask(e, true);

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.KEY_DOWN)) {
                this.dispatch(EnumMessageType.KEY_DOWN, {
                    mask: this.state.mask.current,
                    code: e.which,
                    event: e
                });
            }

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.KEY_PRESS)) {
                this._press.begin(e);
            }

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.KEY_CHORD)) {
                this._chord.end(e);
            }
        }
    }, {
        key: "onKeyUp",
        value: function onKeyUp(e) {
            e.preventDefault();

            this.updateMask(e, false);

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.KEY_DOWN)) {
                this.dispatch(EnumMessageType.KEY_UP, {
                    mask: this.state.mask.current,
                    code: e.which,
                    event: e
                });
            }

            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.KEY_CHORD)) {
                this._chord.end(e);
            }
            if (_Helper.Bitwise.has(this.actionMask, EnumActionFlags.KEY_PRESS)) {
                this._press.end(e);
            }
        }
    }, {
        key: "addKeyMask",
        value: function addKeyMask(name, flag) {
            for (var _len = arguments.length, keys = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                keys[_key - 2] = arguments[_key];
            }

            var _this2 = this;

            if (this.state.map.filter(function (entry) {
                return entry.name === name;
            }).length) {
                this.state.map.forEach(function (entry, i) {
                    if (entry.name === name) {
                        _this2.state.map[i].keys = [].concat(_toConsumableArray(new Set([].concat(_toConsumableArray(_this2.state.map[i].keys), keys))));
                        _this2.state.map[i].flag = Number.isInteger(flag) ? flag : _this2.state.map[i].flag;
                    }
                });
            } else {
                this.state.map.push({
                    keys: keys,
                    flag: flag,
                    name: name
                });
            }

            return this;
        }
    }, {
        key: "removeKeyMask",
        value: function removeKeyMask(name) {
            this.state.map = this.state.map.filter(function (entry) {
                return entry.name !== name;
            });

            return this;
        }
    }, {
        key: "setKeyMask",
        value: function setKeyMask(name, flag) {
            for (var _len2 = arguments.length, keys = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                keys[_key2 - 2] = arguments[_key2];
            }

            this.removeKeyMask(name);
            this.state.map.push({
                keys: keys,
                flag: flag,
                name: name
            });

            return this;
        }
    }, {
        key: "addKeyMasks",
        value: function addKeyMasks() {
            for (var _len3 = arguments.length, nameFlagKeysObjs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                nameFlagKeysObjs[_key3] = arguments[_key3];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = nameFlagKeysObjs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref7 = _step2.value;
                    var name = _ref7.name,
                        flag = _ref7.flag,
                        keys = _ref7.keys;

                    this.addKeyMask(name, flag, keys);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return this;
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
        key: "map",
        get: function get() {
            var map = {};

            this.state.map.forEach(function (obj) {
                map[obj.name] = obj.flag;
            });

            return map;
        }
    }, {
        key: "_press",
        get: function get() {
            var _this3 = this;

            return {
                begin: function begin(e) {
                    if (!(_this3.state.press[e.which] || []).length) {
                        _this3.state.press[e.which] = [Date.now()];
                    }

                    setTimeout(function () {
                        if ((_this3.state.press[e.which] || []).length) {
                            _this3.state.press[e.which].push(true); // hasExpired flag
                        }
                    }, _this3.config.press.timeout);
                },
                end: function end(e) {
                    if ((_this3.state.press[e.which] || []).length) {
                        var dt = Date.now() - _this3.state.press[e.which][0];

                        if (dt <= _this3.config.press.timeout && _this3.state.press[e.which][1] !== true) {
                            _this3.dispatch(EnumMessageType.KEY_PRESS, {
                                mask: _this3.state.mask.current,
                                code: e.which,
                                duration: dt
                            });
                        }

                        delete _this3.state.press[e.which];
                    }
                }
            };
        }
    }, {
        key: "_chord",
        get: function get() {
            var _this4 = this;

            return {
                end: function end(e) {
                    var now = Date.now();
                    var size = Object.keys(_this4.state.press).length;

                    if (size >= _this4.config.chord.threshold) {
                        if (Object.values(_this4.state.press).every(function (_ref8) {
                            var _ref9 = _slicedToArray(_ref8, 1),
                                value = _ref9[0];

                            return now - value <= _this4.config.chord.timeout;
                        })) {
                            _this4.dispatch(EnumMessageType.KEY_CHORD, _extends({
                                mask: _this4.state.mask.current,
                                direction: e.type.replace("key", ""),
                                size: size,
                                shift: "16" in _this4.state.press,
                                ctlr: "17" in _this4.state.press,
                                alt: "18" in _this4.state.press
                            }, _this4.state.press));
                        }
                    }
                }
            };
        }
    }]);

    return KeyNode;
}(_Node3.default);

exports.default = KeyNode;