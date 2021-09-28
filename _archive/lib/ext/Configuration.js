"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnumEventType = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumEventType = exports.EnumEventType = {
    UPDATE: "Configuration.Update"
};

/**
 * ! A basic assumption of this class is that ALL Options should be ONLY [] or {}, as any normal situation should have more than 1 choice
 * If a configuration setting only has 1 option, wrap it in an array (e.g. 1 = [ 1 ])
 * [] will be treated as singular entry systems (i.e. key = index, value = arr[ index ])
 * {} will be trated as key-value pair systems (i.e. key = key, value = obj[ key ])
 */

var Configuration = function (_EventEmitter) {
    _inherits(Configuration, _EventEmitter);

    function Configuration(options) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$state = _ref.state,
            state = _ref$state === undefined ? {} : _ref$state,
            _ref$defaultsByKey = _ref.defaultsByKey,
            defaultsByKey = _ref$defaultsByKey === undefined ? {} : _ref$defaultsByKey,
            _ref$defaultsByValue = _ref.defaultsByValue,
            defaultsByValue = _ref$defaultsByValue === undefined ? {} : _ref$defaultsByValue;

        _classCallCheck(this, Configuration);

        var _this = _possibleConstructorReturn(this, (Configuration.__proto__ || Object.getPrototypeOf(Configuration)).call(this));

        _this.state = state;
        _this.options = options;

        if (!Object.keys(state).length) {
            for (var option in _this.options) {
                if (option in defaultsByKey) {
                    _this.setByKey(option, defaultsByKey[option], { suppress: true });
                } else if (option in defaultsByValue) {
                    _this.setByValue(option, defaultsByValue[option], { suppress: true });
                } else {
                    _this.state[option] = null;
                }
            }
        }
        return _this;
    }

    _createClass(Configuration, [{
        key: "isValidKey",
        value: function isValidKey(option, key) {
            var entries = this.options[option];

            if ((typeof entries === "undefined" ? "undefined" : _typeof(entries)) === "object") {
                return key in entries;
            }

            return false;
        }
    }, {
        key: "isValidValue",
        value: function isValidValue(option, value) {
            var entries = this.options[option];

            if (entries) {
                if (Array.isArray(entries)) {
                    return entries.indexOf(value) >= 0;
                } else {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = Object.entries(entries)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var _step$value = _slicedToArray(_step.value, 2),
                                k = _step$value[0],
                                v = _step$value[1];

                            if (v === value) {
                                return true;
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
                }
            }

            return false;
        }
    }, {
        key: "has",
        value: function has(option) {
            return !!this.state[option];
        }
    }, {
        key: "key",
        value: function key(option) {
            var entry = this.state[option] || [];

            return entry[0];
        }
    }, {
        key: "value",
        value: function value(option) {
            var entry = this.state[option] || [];

            return entry[1];
        }
    }, {
        key: "current",
        value: function current(option) {
            return this.state[option] || [];
        }
    }, {
        key: "choices",
        value: function choices(option) {
            return this.options[option];
        }
    }, {
        key: "first",
        value: function first(option) {
            var entry = this.options[option];

            if (Array.isArray(entry)) {
                return entry[0];
            } else if ((typeof entry === "undefined" ? "undefined" : _typeof(entry)) === "object") {
                return Object.entries(entry)[0];
            }
        }
    }, {
        key: "last",
        value: function last(option) {
            var entry = this.options[option];

            if (Array.isArray(entry)) {
                return entry[entry.length - 1];
            } else if ((typeof entry === "undefined" ? "undefined" : _typeof(entry)) === "object") {
                return Object.entries(entry)[entry.length - 1];
            }
        }
    }, {
        key: "set",
        value: function set(method, option, input) {
            var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
                _ref2$suppress = _ref2.suppress,
                suppress = _ref2$suppress === undefined ? false : _ref2$suppress;

            if (method === "key") {
                return this.setByKey(option, input, { suppress: suppress });
            } else if (method === "value") {
                return this.setByValue(option, input, { suppress: suppress });
            }

            return false;
        }
    }, {
        key: "setByKey",
        value: function setByKey(option, key) {
            var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref3$suppress = _ref3.suppress,
                suppress = _ref3$suppress === undefined ? false : _ref3$suppress;

            var entries = this.options[option];

            if (entries) {
                var choice = entries[key];

                if (choice !== void 0) {
                    var oldValue = this.state[option];

                    this.state[option] = [key, choice];

                    if (!suppress) {
                        this.emit(EnumEventType.UPDATE, {
                            method: "key",
                            args: [].concat(Array.prototype.slice.call(arguments)),
                            previous: oldValue,
                            current: this.state[option]
                        });
                    }

                    return true;
                }
            }

            return false;
        }
    }, {
        key: "setByValue",
        value: function setByValue(option, value) {
            var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref4$suppress = _ref4.suppress,
                suppress = _ref4$suppress === undefined ? false : _ref4$suppress;

            var entries = this.options[option];

            if (entries) {
                var key = void 0,
                    choice = void 0;
                if (Array.isArray(entries)) {
                    key = entries.indexOf(value);

                    if (key >= 0) {
                        choice = entries[key];
                    }
                } else {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = Object.entries(entries)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _step2$value = _slicedToArray(_step2.value, 2),
                                k = _step2$value[0],
                                v = _step2$value[1];

                            if (v === value) {
                                key = k;
                                choice = entries[k];
                                break;
                            }
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
                }

                if (choice !== void 0 && key !== void 0) {
                    var oldValue = this.state[option];

                    this.state[option] = [key, choice];

                    if (!suppress) {
                        this.emit(EnumEventType.UPDATE, {
                            method: "value",
                            args: [].concat(Array.prototype.slice.call(arguments)),
                            previous: oldValue,
                            current: this.state[option]
                        });
                    }

                    return true;
                }
            }

            return false;
        }
    }, {
        key: "toObject",
        value: function toObject() {
            return JSON.parse(JSON.stringify(this));
        }
    }, {
        key: "toJson",
        value: function toJson() {
            var beautify = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (beautify === true) {
                return JSON.stringify(this, null, 2);
            }

            return JSON.stringify(this);
        }
    }, {
        key: "toData",
        value: function toData() {
            var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref5$flag = _ref5.flag,
                flag = _ref5$flag === undefined ? "both" : _ref5$flag;

            if (flag === "both") {
                return this.state;
            }

            var obj = {};

            for (var option in this.state) {
                if (flag === "keys") {
                    obj[option] = this.state[option][0];
                } else {
                    obj[option] = this.state[option][1];
                }
            }

            return obj;
        }
    }, {
        key: "toKeys",
        value: function toKeys() {
            return this.toData({ flag: "keys" });
        }
    }, {
        key: "toValues",
        value: function toValues() {
            return this.toData({ flag: "values" });
        }
    }], [{
        key: "FromJson",
        value: function FromJson(json) {
            var obj = json;

            while (typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }

            return new Configuration(obj.options, {
                state: obj.state
            });
        }
    }]);

    return Configuration;
}(_events2.default);

exports.default = Configuration;