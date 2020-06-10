"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-disable */


exports.useNodeContext = useNodeContext;

var _react = require("react");

var _Node = require("./Node");

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//* Only real requirement is that the Context.Provider contains a kvp of { node: <Node> }
function useNodeContext(context) {
    var _useContext = (0, _react.useContext)(context),
        ctxNode = _useContext.node;

    var _useState = (0, _react.useState)({
        node: ctxNode,
        state: ctxNode.state
    }),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        setState = _useState2[1];

    (0, _react.useEffect)(function () {
        var componentNode = new _Node2.default();

        componentNode.watchMessages(ctxNode);
        componentNode.after = function (msg) {
            setState({
                node: ctxNode,
                state: ctxNode.state
            });
        };

        return function () {
            return componentNode.unwatchMessages(ctxNode);
        };
    }, []);

    return state;
};