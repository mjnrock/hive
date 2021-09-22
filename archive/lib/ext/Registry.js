"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entry2 = require("./Entry");

var _Entry3 = _interopRequireDefault(_Entry2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//TODO Dualy link Registry to each Entry to facilitate keeping @keys in check

var Registry = function () {
    function Registry() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$entries = _ref.entries,
            entries = _ref$entries === undefined ? [] : _ref$entries,
            _ref$version = _ref.version,
            version = _ref$version === undefined ? "1.0.0" : _ref$version;

        _classCallCheck(this, Registry);

        this.entries = new Map();
        this.version = version;

        this.add.apply(this, _toConsumableArray(entries));
    }

    _createClass(Registry, [{
        key: "get",
        value: function get() {
            for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
                keys[_key] = arguments[_key];
            }

            if (keys.length === 1) {
                var entry = this.entries.get(keys[0]);

                if (entry) {
                    return entry.value;
                }
            }

            var arr = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    var _entry = this.entries.get(key);

                    if (_entry) {
                        arr.push(_entry.value);
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

            return arr;
        }
    }, {
        key: "find",
        value: function find() {
            for (var _len2 = arguments.length, keys = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                keys[_key2] = arguments[_key2];
            }

            if (keys.length === 1) {
                var entry = this.entries.get(keys[0]);

                if (entry) {
                    return entry;
                }
            }

            var arr = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var key = _step2.value;

                    var _entry2 = this.entries.get(key);

                    if (_entry2) {
                        arr.push(_entry2);
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

            return arr;
        }
    }, {
        key: "add",
        value: function add() {
            for (var _len3 = arguments.length, entries = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                entries[_key3] = arguments[_key3];
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = entries[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var entry = _step3.value;

                    if (entry instanceof _Entry3.default) {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = entry.keys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var key = _step4.value;

                                this.entries.set(key, entry);
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

                        this.entries.set(entry.id, entry);
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

            return this;
        }
    }, {
        key: "remove",
        value: function remove() {
            for (var _len4 = arguments.length, keysOrEntries = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                keysOrEntries[_key4] = arguments[_key4];
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = keysOrEntries[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var keyOrEntry = _step5.value;

                    if (keyOrEntry instanceof _Entry3.default) {
                        var _iteratorNormalCompletion6 = true;
                        var _didIteratorError6 = false;
                        var _iteratorError6 = undefined;

                        try {
                            for (var _iterator6 = keyOrEntry.keys[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                var key = _step6.value;

                                this.entries.delete(key);
                            }
                        } catch (err) {
                            _didIteratorError6 = true;
                            _iteratorError6 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                    _iterator6.return();
                                }
                            } finally {
                                if (_didIteratorError6) {
                                    throw _iteratorError6;
                                }
                            }
                        }

                        this.entries.delete(keyOrEntry.id);
                    } else if (typeof keyOrEntry === "string" || keyOrEntry instanceof String) {
                        var entry = this.find(keyOrEntry);

                        this.remove(entry);
                    }
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

            return this;
        }
    }, {
        key: "create",
        value: function create() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if ((typeof opts === "undefined" ? "undefined" : _typeof(opts)) !== "object") {
                var _entry3 = new _Entry3.default({
                    value: opts,
                    nometa: true
                });

                this.add(_entry3);

                return _entry3;
            }

            var entry = new _Entry3.default(opts);

            this.add(entry);

            return entry;
        }
    }, {
        key: "patch",
        value: function patch() {
            var _version$split = this.version.split("."),
                _version$split2 = _slicedToArray(_version$split, 3),
                major = _version$split2[0],
                minor = _version$split2[1],
                patch = _version$split2[2];

            this.version = major + "." + minor + "." + (~~patch + 1);

            return this.version;
        }
    }, {
        key: "minor",
        value: function minor() {
            var _version$split3 = this.version.split("."),
                _version$split4 = _slicedToArray(_version$split3, 3),
                major = _version$split4[0],
                minor = _version$split4[1],
                patch = _version$split4[2];

            this.version = major + "." + (~~minor + 1) + "." + patch;

            return this.version;
        }
    }, {
        key: "major",
        value: function major() {
            var _version$split5 = this.version.split("."),
                _version$split6 = _slicedToArray(_version$split5, 3),
                major = _version$split6[0],
                minor = _version$split6[1],
                patch = _version$split6[2];

            this.version = ~~major + 1 + "." + minor + "." + patch;

            return this.version;
        }
    }], [{
        key: "Entry",
        value: function Entry() {
            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            return new (Function.prototype.bind.apply(_Entry3.default, [null].concat(args)))();
        }
    }]);

    return Registry;
}();

exports.default = Registry;