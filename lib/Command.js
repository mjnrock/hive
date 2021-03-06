"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require("uuid");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Command = function () {
    function Command(fn, argsArray, emitter) {
        var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
            id = _ref.id,
            timestamp = _ref.timestamp;

        _classCallCheck(this, Command);

        this.id = id || (0, _uuid.v4)();
        this.fn = fn;
        this.args = argsArray;
        this.timestamp = timestamp || Date.now();
        this.emitter = emitter;

        return Object.seal(this);
    }

    _createClass(Command, [{
        key: "toJson",
        value: function toJson() {
            return JSON.stringify(this);
        }
    }, {
        key: "toObject",
        value: function toObject() {
            return JSON.parse(JSON.stringify(this));
        }
    }], [{
        key: "FromJson",
        value: function FromJson(json) {
            var obj = json;

            while (typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }

            return new Command(obj.fn, obj.args, obj.emitter, {
                id: obj.id,
                timestamp: obj.timestamp
            });
        }
    }, {
        key: "Conforms",
        value: function Conforms(obj) {
            if (obj instanceof Command) {
                return true;
            } else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") {
                return false;
            }

            return "id" in obj && "fn" in obj && "args" in obj && "timestamp" in obj && "emitter" in obj;
        }
    }, {
        key: "JsonConforms",
        value: function JsonConforms(json) {
            var obj = json;

            while (typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }

            return Command.Conforms(obj);
        }
    }]);

    return Command;
}();

exports.default = Command;