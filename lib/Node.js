"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnumEventType = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _uuid = require("uuid");

var _functions = require("./functions");

var _Message = require("./Message");

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumEventType = exports.EnumEventType = {
    STATE: "Node.state",
    MESSAGE: "Node.message",
    PING: "Node.ping"
};

var Node = function (_EventEmitter) {
    _inherits(Node, _EventEmitter);

    function Node() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Node);

        var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

        _this.id = (0, _uuid.v4)();
        _this._state = (0, _functions.freeze)(state);
        _this._reducers = [];
        _this._config = {
            isSelfMessaging: true
        };

        _this.watchMessages(_this);
        _this.watchState(_this);

        _this.setMaxListeners(1000);
        return _this;
    }

    _createClass(Node, [{
        key: "flagOn",
        value: function flagOn(configEntry) {
            if (configEntry in this._config) {
                this._config[configEntry] = true;
            }

            return this;
        }
    }, {
        key: "flagOff",
        value: function flagOff(configEntry) {
            if (configEntry in this._config) {
                this._config[configEntry] = false;
            }

            return this;
        }
    }, {
        key: "flagToggle",
        value: function flagToggle(configEntry) {
            if (configEntry in this._config) {
                this._config[configEntry] = !this._config[configEntry];
            }

            return this;
        }
    }, {
        key: "dispatch",
        value: function dispatch(type, payload) {
            this.emit(EnumEventType.MESSAGE, new _Message2.default(type, payload, this));
        }
    }, {
        key: "onMessage",
        value: function onMessage(msg) {
            if (!_Message2.default.Conforms(msg)) {
                return;
            }

            if (this.config.isSelfMessaging && msg.emitter.id === this.id || msg.emitter.id !== this.id) {
                var state = Object.assign({}, this.state);

                if (typeof this.before === "function") {
                    this.before(state, msg, this);
                }

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this._reducers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var reducer = _step.value;

                        if (typeof reducer === "function") {
                            var newState = reducer(state, msg, this) || state;

                            if (!((typeof newState === "undefined" ? "undefined" : _typeof(newState)) === "object" || Array.isArray(newState))) {
                                newState = [newState];
                            }

                            state = newState;
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

                this.state = state;

                if (typeof this.after === "function") {
                    this.after(this.state, msg, this);
                }
            }
        }
    }, {
        key: "watchMessages",
        value: function watchMessages(node) {
            var twoWay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (node instanceof _events2.default) {
                node.on(EnumEventType.MESSAGE, this.onMessage.bind(this));

                if (twoWay) {
                    this.on(EnumEventType.MESSAGE, node.onMessage.bind(node));
                }
            }

            return this;
        }
    }, {
        key: "unwatchMessages",
        value: function unwatchMessages(node) {
            var twoWay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (node instanceof _events2.default) {
                node.off(EnumEventType.MESSAGE, this.onMessage.bind(this));

                if (twoWay) {
                    this.off(EnumEventType.MESSAGE, node.onMessage.bind(node));
                }
            }

            return this;
        }
    }, {
        key: "onState",
        value: function onState(stateObj) {}
    }, {
        key: "watchState",
        value: function watchState(node) {
            var _this2 = this;

            var twoWay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (node instanceof _events2.default) {
                node.on(EnumEventType.STATE, function (stateObj) {
                    _this2.onState(stateObj, _this2);
                });

                if (twoWay) {
                    this.on(EnumEventType.STATE, function (stateObj) {
                        node.onState(stateObj, _this2);
                    });
                }
            }

            return this;
        }
    }, {
        key: "unwatchState",
        value: function unwatchState(node) {
            var _this3 = this;

            var twoWay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (node instanceof _events2.default) {
                node.off(EnumEventType.STATE, function (stateObj) {
                    _this3.onState(stateObj);
                });

                if (twoWay) {
                    this.off(EnumEventType.STATE, function (stateObj) {
                        node.onState(stateObj);
                    });
                }
            }

            return this;
        }

        // Emit a direct event and a Message-driven event

    }, {
        key: "ping",
        value: function ping() {
            this.emit(EnumEventType.PING, this.state);
            this.dispatch(EnumEventType.PING, this.state);
        }
    }, {
        key: "addReducer",
        value: function addReducer() {
            var _this4 = this;

            if (arguments.length === 1) {
                var _arguments = Array.prototype.slice.call(arguments),
                    reducer = _arguments[0];

                if (typeof reducer === "function") {
                    this._reducers.push(reducer);
                }
            } else if (arguments.length === 2) {
                var _arguments2 = Array.prototype.slice.call(arguments),
                    type = _arguments2[0],
                    _reducer = _arguments2[1];

                if (typeof _reducer === "function") {
                    this._reducers.push(function (state, msg) {
                        if (msg.type === type) {
                            return _reducer(state, msg, _this4);
                        }

                        return state;
                    });
                }
            }

            return this;
        }
    }, {
        key: "clearReducers",
        value: function clearReducers() {
            this._reducers = [];

            return this;
        }
    }, {
        key: "flatten",
        value: function flatten() {
            var recurse = function recurse(state) {
                var ancestry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

                var arr = [];

                for (var key in state) {
                    var element = state[key];

                    if ((typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && !Array.isArray(element)) {
                        arr.push.apply(arr, _toConsumableArray(recurse(element, [].concat(_toConsumableArray(ancestry), [key]))));
                    } else {
                        arr.push([[].concat(_toConsumableArray(ancestry), [key]).join("."), element]);
                    }
                }

                return arr;
            };

            return recurse(this.state, []);
        }
    }, {
        key: "unflatten",
        value: function unflatten(input) {
            var state = {};

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = input[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _step2$value = _slicedToArray(_step2.value, 2),
                        key = _step2$value[0],
                        value = _step2$value[1];

                    if (key.includes(".")) {
                        var ancestry = key.split(".");
                        var obj = state,
                            pointer = obj;

                        for (var i = 0; i < ancestry.length; i++) {
                            var k = ancestry[i];

                            if (!pointer[k]) {
                                pointer[k] = {};
                            }

                            if (i < ancestry.length - 1) {
                                pointer = pointer[k];
                            }
                        }

                        pointer[ancestry[ancestry.length - 1]] = value;

                        state = _extends({}, state, obj);
                    } else {
                        state[key] = value;
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

            this._state = state;

            return this.state;
        }
    }, {
        key: "state",
        get: function get() {
            return this._state;
        },
        set: function set(newState) {
            var oldState = this._state;

            this._state = newState;

            this.emit(EnumEventType.STATE, (0, _functions.freezeCopy)({
                previous: oldState,
                current: newState
            }));
        }
    }, {
        key: "config",
        get: function get() {
            return this._config;
        }
    }]);

    return Node;
}(_events2.default);

exports.default = Node;
;