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

function spawnStateNode() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var effects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var stateNode = new _Node2.default(state);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = reducers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var reducer = _step.value;

            if (Array.isArray(reducer)) {
                stateNode.addReducer.apply(stateNode, _toConsumableArray(reducer));
            } else if (typeof reducer === "function") {
                stateNode.addReducer(reducer);
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = effects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var effect = _step2.value;

            if (Array.isArray(effect)) {
                stateNode.addEffect.apply(stateNode, _toConsumableArray(effect));
            } else if (typeof effect === "function") {
                stateNode.addEffect(effect);
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

    return stateNode;
}

exports.default = StateNode;