"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _package = require("./node/package");

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//* Use this file as a "file variable"
var StateNode = new _package2.default.Node({
    cats: 2
});
StateNode.addReducer("cats", function (state, msg) {
    return _extends({}, state, {
        cats: msg.payload
    });
});

exports.default = StateNode;