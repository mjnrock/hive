"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnumMessageType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GridCanvasNode2 = require("./GridCanvasNode");

var _GridCanvasNode3 = _interopRequireDefault(_GridCanvasNode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumMessageType = exports.EnumMessageType = {
    PAINT: "LayeredCanvasNode.Paint"
};

var LayeredCanvasNode = function (_GridCanvasNode) {
    _inherits(LayeredCanvasNode, _GridCanvasNode);

    function LayeredCanvasNode() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$state = _ref.state,
            state = _ref$state === undefined ? {} : _ref$state,
            _ref$config = _ref.config,
            config = _ref$config === undefined ? {} : _ref$config,
            width = _ref.width,
            height = _ref.height,
            size = _ref.size,
            _ref$stack = _ref.stack,
            stack = _ref$stack === undefined ? [] : _ref$stack;

        _classCallCheck(this, LayeredCanvasNode);

        var _this = _possibleConstructorReturn(this, (LayeredCanvasNode.__proto__ || Object.getPrototypeOf(LayeredCanvasNode)).call(this, { state: state, config: config, width: width, height: height, size: size }));

        if (Array.isArray(stack[0]) && stack[0].length === 2) {
            _this.mergeState({
                stack: new Map(stack)
            });
        } else if (Array.isArray(stack)) {
            _this.mergeState({
                stack: new Map(stack.map(function (m, i) {
                    return [i, m];
                }))
            });
        } else if (Number.isInteger(stack)) {
            for (var i = 0; i < stack; i++) {
                _this.addLayer({ width: width, height: height, size: size });
            }
        }
        return _this;
    }

    _createClass(LayeredCanvasNode, [{
        key: "getLayer",
        value: function getLayer() {
            var nameOrIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            return this.stack.get(nameOrIndex);
        }
    }, {
        key: "addLayer",
        value: function addLayer(_ref2) {
            var layer = _ref2.layer,
                name = _ref2.name,
                _ref2$state = _ref2.state,
                state = _ref2$state === undefined ? {} : _ref2$state,
                _ref2$config = _ref2.config,
                config = _ref2$config === undefined ? {} : _ref2$config,
                width = _ref2.width,
                height = _ref2.height,
                size = _ref2.size;

            if (layer instanceof CanvasNode) {
                this.stack.set(name, layer);
            } else {
                this.stack.set(name || this.stackSize, new _GridCanvasNode3.default({ state: state, config: config, width: width, height: height, size: size }));
            }

            return this;
        }
    }, {
        key: "removeLayer",
        value: function removeLayer(nameOrIndex) {
            this.stack.delete(nameOrIndex);

            return this;
        }
    }, {
        key: "swapLayers",
        value: function swapLayers(firstNameOrIndex, secondNameOrIndex) {
            var temp = this.stack.get(firstNameOrIndex);

            this.stack.set(firstNameOrIndex, this.stack.get(secondNameOrIndex));
            this.stack.set(secondNameOrIndex, temp);

            return this;
        }
    }, {
        key: "paint",
        value: function paint() {
            var _this2 = this;

            for (var _len = arguments.length, drawImageArgs = Array(_len), _key = 0; _key < _len; _key++) {
                drawImageArgs[_key] = arguments[_key];
            }

            if (!drawImageArgs.length) {
                drawImageArgs = [0, 0];
            }

            this.stack.forEach(function (cnode) {
                var _ctx;

                return (_ctx = _this2.ctx).drawImage.apply(_ctx, [cnode.canvas].concat(_toConsumableArray(drawImageArgs)));
            });

            this.dispatch(EnumMessageType.PAINT);

            return this;
        }
    }, {
        key: "paintLayer",
        value: function paintLayer() {
            for (var _len2 = arguments.length, drawImageArgs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                drawImageArgs[_key2 - 1] = arguments[_key2];
            }

            var nameOrIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            var layer = this.getLayer(nameOrIndex);

            if (layer) {
                var _ctx2;

                if (!drawImageArgs.length) {
                    drawImageArgs = [0, 0];
                }

                (_ctx2 = this.ctx).drawImage.apply(_ctx2, [layer.canvas].concat(_toConsumableArray(drawImageArgs)));

                this.dispatch(EnumMessageType.PAINT);
            }

            return this;
        }
    }, {
        key: "stack",
        get: function get() {
            return this.state.stack;
        },
        set: function set(stack) {
            if (Array.isArray(stack[0]) && stack[0].length === 2) {
                this.mergeState({
                    stack: new Map(stack)
                });
            } else if (Array.isArray(stack)) {
                this.mergeState({
                    stack: new Map(stack.map(function (m, i) {
                        return [i, m];
                    }))
                });
            }
        }
    }, {
        key: "stackSize",
        get: function get() {
            return this.stack.length;
        }
    }]);

    return LayeredCanvasNode;
}(_GridCanvasNode3.default);

exports.default = LayeredCanvasNode;