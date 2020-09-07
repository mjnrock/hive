"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnumEventType = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumEventType = exports.EnumEventType = {
    UPDATE: "Registry.Update"
};

var Registry = function (_EventEmitter) {
    _inherits(Registry, _EventEmitter);

    function Registry() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            setter = _ref.setter,
            getter = _ref.getter,
            _ref$entries = _ref.entries,
            entries = _ref$entries === undefined ? [] : _ref$entries,
            _ref$state = _ref.state,
            state = _ref$state === undefined ? {} : _ref$state;

        _classCallCheck(this, Registry);

        var _this = _possibleConstructorReturn(this, (Registry.__proto__ || Object.getPrototypeOf(Registry)).call(this, _extends({
            entries: new Map(entries),
            //? @getter/@setter are key/key-value hooks, allowing functions to dynamically modify parameters, if needed (i.e. get/set rules)
            getter: getter, // Modify the @key when using this.get(...)
            setter: setter }, state)));

        _this.id = (0, _uuid.v4)();
        return _this;
    }

    //? This allows this.get(key) to be modified dynamically to instead return this.state.entries.get(this.getter(key))


    _createClass(Registry, [{
        key: "empty",
        value: function empty() {
            return this.entries.clear();
        }
    }, {
        key: "get",
        value: function get(key) {
            if (this.getter) {
                var k = this.getter(key);

                return this.entries.get(k);
            }

            return this.entries.get(key);
        }
    }, {
        key: "set",
        value: function set(key, value) {
            var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref2$suppress = _ref2.suppress,
                suppress = _ref2$suppress === undefined ? false : _ref2$suppress;

            if (this.setter) {
                var _setter = this.setter(key, value),
                    _setter2 = _slicedToArray(_setter, 2),
                    k = _setter2[0],
                    v = _setter2[1];

                this.entries.set(k, v);

                if (suppress !== true) {
                    this.emit(EnumEventType.UPDATE, k, v, Date.now());
                }
            } else {
                this.entries.set(key, value);

                if (suppress !== true) {
                    this.emit(EnumEventType.UPDATE, key, value, Date.now());
                }
            }

            return this;
        }
    }, {
        key: "remove",
        value: function remove(key) {
            if (this.getter) {
                var k = this.getter(key);

                return this.entries.delete(k);
            }

            return this.entries.delete(key);
        }
    }, {
        key: "has",
        value: function has(key) {
            if (this.getter) {
                var k = this.getter(key);

                return this.entries.has(k);
            }

            return this.entries.has(key);
        }
    }, {
        key: "includes",
        value: function includes(value) {
            return [].concat(_toConsumableArray(this.entries.values())).some(function (entry) {
                return entry === value;
            });
        }

        /**
         * Contextually iterate over @input and apply @filter(key, value) at a row level (if filter result is *true*), if included; else, this.set(key, value)
         * @param {Registry|Map|Array|Object} input 
         * @param {?fn} filter | 
         */

    }, {
        key: "merge",
        value: function merge(input, filter) {
            var _this2 = this;

            var setter = function setter(key, value) {
                if (typeof filter === "function") {
                    if (filter(key, value) === true) {
                        _this2.set(key, value);
                    }
                } else {
                    _this2.set(key, value);
                }
            };

            if (input instanceof Registry) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = input.entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _step$value = _slicedToArray(_step.value, 2),
                            key = _step$value[0],
                            value = _step$value[1];

                        setter(key, value);
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
            } else if (input instanceof Map) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = input[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _step2$value = _slicedToArray(_step2.value, 2),
                            key = _step2$value[0],
                            value = _step2$value[1];

                        setter(key, value);
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
            } else if (Array.isArray(input)) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = input[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _step3$value = _slicedToArray(_step3.value, 2),
                            key = _step3$value[0],
                            value = _step3$value[1];

                        if (key !== void 0 && value !== void 0) {
                            setter(key, value);
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            } else if ((typeof input === "undefined" ? "undefined" : _typeof(input)) === "object") {
                Object.entries(input).forEach(function (_ref3) {
                    var _ref4 = _slicedToArray(_ref3, 2),
                        key = _ref4[0],
                        value = _ref4[1];

                    return setter(key, value);
                });
            }

            return this;
        }
    }, {
        key: "each",
        value: function each(fn) {
            var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref5$save = _ref5.save,
                save = _ref5$save === undefined ? false : _ref5$save;

            if (typeof fn === "function") {
                if (save === true) {
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = this.entries[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _step4$value = _slicedToArray(_step4.value, 2),
                                key = _step4$value[0],
                                value = _step4$value[1];

                            this.set(key, fn.call(this, key, value), { suppress: true });
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }

                    this.emit(EnumEventType.UPDATE, Date.now());
                } else {
                    //  This is intentionally left to manually use .getter (scope = this), if present; as this should remain a raw iterator
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = this.entries[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var _step5$value = _slicedToArray(_step5.value, 2),
                                key = _step5$value[0],
                                value = _step5$value[1];

                            fn.call(this, key, value);
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                }
            }

            return this;
        }
    }, {
        key: "getter",
        get: function get() {
            return this.state.getter;
        },
        set: function set(fn) {
            if (typeof fn === "function") {
                this.mergeState({
                    getter: fn
                });
            }
        }

        //? This allows this.set(key, value) to be modified dynamically to instead execute this.state.entries.set(...this.setter(key, value))

    }, {
        key: "setter",
        get: function get() {
            return this.state.setter;
        },
        set: function set(fn) {
            if (typeof fn === "function") {
                this.mergeState({
                    setter: fn
                });
            }
        }
    }, {
        key: "entries",
        get: function get() {
            return this.state.entries;
        }
    }, {
        key: "size",
        get: function get() {
            return this.entries.size;
        }
    }, {
        key: "isEmpty",
        get: function get() {
            return this.size === 0;
        }
    }]);

    return Registry;
}(_events2.default);

exports.default = Registry;
;