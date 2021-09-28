"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _uuid = require("uuid");

var _Channel = require("./Channel");

var _Channel2 = _interopRequireDefault(_Channel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Station = function (_EventEmitter) {
    _inherits(Station, _EventEmitter);

    function Station() {
        var channels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, Station);

        var _this = _possibleConstructorReturn(this, (Station.__proto__ || Object.getPrototypeOf(Station)).call(this));

        _this.id = (0, _uuid.v4)();

        _this.channels = new Map();

        if (channels.length) {
            if (Array.isArray(channels[0])) {
                _this.channels = new Map(channels);
            } else if (typeof channels[0] === "string" || channels[0] instanceof String) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = channels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var name = _step.value;

                        _this.newChannel(name);
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
        return _this;
    }

    _createClass(Station, [{
        key: "newChannel",
        value: function newChannel(name) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref$subscribors = _ref.subscribors,
                subscribors = _ref$subscribors === undefined ? [] : _ref$subscribors;

            var channel = new _Channel2.default(subscribors);

            this.channels.set(name, channel);
        }
    }, {
        key: "getChannel",
        value: function getChannel(name) {
            return this.channels.get(name);
        }
    }, {
        key: "setChannel",
        value: function setChannel(name, channel) {
            if (channel instanceof _Channel2.default) {
                return this.channels.set(name, channel);
            }
        }
    }, {
        key: "broadcast",
        value: function broadcast(thisArg) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.channels.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var channel = _step2.value;

                    channel.invoke.apply(channel, [thisArg].concat(args));
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
        key: "invoke",
        value: function invoke(thisArg, channelName, type) {
            var channel = this.channels.get(channelName);

            if (channel instanceof _Channel2.default) {
                for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
                    args[_key2 - 3] = arguments[_key2];
                }

                channel.invoke.apply(channel, [thisArg, type].concat(args));
            }

            return this;
        }
    }, {
        key: "subscribors",
        value: function subscribors(channelName) {
            var channel = this.channels.get(channelName);

            if (channel instanceof _Channel2.default) {
                return channel.subscribors;
            }

            return [];
        }
    }, {
        key: "join",
        value: function join(channel, fn) {
            if (typeof fn === "function") {
                this.channels.get(channel).add(fn);
            }
        }
    }, {
        key: "leave",
        value: function leave(channel, fn) {
            this.channels.get(channel).delete(fn);
        }
    }]);

    return Station;
}(_events2.default);

exports.default = Station;