"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnumMessageType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GridCanvasNode2 = require("./GridCanvasNode");

var _GridCanvasNode3 = _interopRequireDefault(_GridCanvasNode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        _this.mergeState({
            stack: stack
        });

        if (Number.isInteger(stack)) {
            for (var i = 0; i < stack; i++) {
                _this.addLayer({ width: width, height: height, size: size });
            }
        }
        return _this;
    }

    _createClass(LayeredCanvasNode, [{
        key: "addLayer",
        value: function addLayer(_ref2) {
            var _ref2$state = _ref2.state,
                state = _ref2$state === undefined ? {} : _ref2$state,
                _ref2$config = _ref2.config,
                config = _ref2$config === undefined ? {} : _ref2$config,
                width = _ref2.width,
                height = _ref2.height,
                size = _ref2.size;

            this.stack.push(new _GridCanvasNode3.default({ state: state, config: config, width: width, height: height, size: size }));

            return this;
        }
    }, {
        key: "removeLayer",
        value: function removeLayer(index) {
            this.stack.splice(index, 1);

            return this;
        }
    }, {
        key: "getLayer",
        value: function getLayer() {
            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            return this.stack[index];
        }
    }, {
        key: "swapLayers",
        value: function swapLayers(first, second) {
            var temp = this.stack[first];
            this.stack[first] = this.stack[second];
            this.stack[second] = temp;

            return this;
        }
    }, {
        key: "paint",
        value: function paint() {
            var _this2 = this;

            this.stack.forEach(function (cnode) {
                return _this2.ctx.drawImage(cnode.canvas, 0, 0);
            });

            this.dispatch(EnumMessageType.PAINT);

            return this;
        }
    }, {
        key: "stack",
        get: function get() {
            return this.state.stack;
        },
        set: function set(stack) {
            this.mergeState({
                stack: stack
            });
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