"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.spawnStateNode = spawnStateNode;

var _Node = require("./Node");

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//* Use this file as a "file variable"
var StateNode = new _Node2.default({
    cats: 2
});
StateNode.addReducer("cats", function (state, msg) {
    return _extends({}, state, {
        cats: msg.payload
    });
});

function spawnStateNode(state) {
    var stateNode = new _Node2.default(state);

    for (var _len = arguments.length, reducers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        reducers[_key - 1] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = reducers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var reducer = _step.value;

            if (Array.isArray(reducer)) {
                stateNode.addReducer.apply(stateNode, _toConsumableArray(reducer));
            } else if (typeof reducer === "function") {
                state.addReducer(reducer);
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

    return stateNode;
}

exports.default = StateNode;