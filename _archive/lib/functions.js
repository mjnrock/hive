"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.freeze = freeze;
exports.freezeCopy = freezeCopy;
function freeze(obj) {
    var propNames = Object.getOwnPropertyNames(obj);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = propNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            var value = obj[name];

            if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                freeze(value);
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

    return Object.freeze(obj);
};

function freezeCopy(obj) {
    return freeze(Object.assign({}, obj));
};

exports.default = {
    freeze: freeze,
    freezeCopy: freezeCopy
};