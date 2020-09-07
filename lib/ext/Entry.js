"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entry = function () {
    function Entry() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$key = _ref.key,
            key = _ref$key === undefined ? [] : _ref$key,
            value = _ref.value,
            _ref$choices = _ref.choices,
            choices = _ref$choices === undefined ? [] : _ref$choices,
            _ref$readonly = _ref.readonly,
            readonly = _ref$readonly === undefined ? false : _ref$readonly,
            parent = _ref.parent,
            _ref$meta = _ref.meta,
            meta = _ref$meta === undefined ? {} : _ref$meta,
            _ref$nometa = _ref.nometa,
            nometa = _ref$nometa === undefined ? false : _ref$nometa,
            id = _ref.id;

        _classCallCheck(this, Entry);

        this.id = id || (0, _uuid.v4)();

        this.keys = key;
        this._value = value;

        if (nometa === false) {
            this._meta = _extends({
                readonly: readonly,
                choices: choices,
                parent: parent

            }, meta);
        }
    }

    _createClass(Entry, [{
        key: "nometa",
        value: function nometa() {
            delete this._meta;

            return this;
        }
    }, {
        key: "add",
        value: function add() {
            for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
                keys[_key] = arguments[_key];
            }

            this._keys = [].concat(_toConsumableArray(new Set([].concat(_toConsumableArray(this.keys), keys))));

            return this;
        }
    }, {
        key: "delete",
        value: function _delete() {
            for (var _len2 = arguments.length, keys = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                keys[_key2] = arguments[_key2];
            }

            this._keys = this.keys.filter(function (key) {
                return !keys.includes(key);
            });

            return this;
        }
    }, {
        key: "prop",
        value: function prop(key, value) {
            if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") {
                this._meta = _extends({}, this._meta, key);
            } else if (value !== void 0) {
                this._meta = this._meta || {};

                this._meta[key] = value;
            }

            return this._meta ? this._meta[key] : void 0;
        }
    }, {
        key: "meta",
        get: function get() {
            return this._meta;
        }
    }, {
        key: "choices",
        get: function get() {
            return this._meta ? this._meta.choices : void 0;
        }
    }, {
        key: "parent",
        get: function get() {
            return this._meta ? this._meta.parent : void 0;
        }
    }, {
        key: "isReadOnly",
        get: function get() {
            return this._meta ? this._meta.readonly : void 0;
        }
    }, {
        key: "keys",
        get: function get() {
            return this._keys;
        },
        set: function set(keys) {
            if (Array.isArray(keys)) {
                this._keys = keys;
            } else {
                this._keys = [keys];
            }
        }
    }, {
        key: "value",
        get: function get() {
            return this._value;
        },
        set: function set(value) {
            if (this.isReadOnly === true) {
                return this;
            }

            if (this.choices.length) {
                if (this.choices.includes(value)) {
                    this._value = value;
                }
            } else {
                this._value = value;
            }

            return this;
        }
    }, {
        key: "key",
        get: function get() {
            return this.keys[0];
        }
    }, {
        key: "synonyms",
        get: function get() {
            return this.keys.slice(1);
        }
    }]);

    return Entry;
}();

exports.default = Entry;