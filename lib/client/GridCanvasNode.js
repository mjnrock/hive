"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnumMessageType = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CanvasNode2 = require("./CanvasNode");

var _CanvasNode3 = _interopRequireDefault(_CanvasNode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumMessageType = exports.EnumMessageType = {};

/**
 * If a method is preceded be "g", then arg ∈ { X, Y, Width, Height } should be considered TILE entries
 * For Example: if rect(25,25,50,50) and tiles are 25x25, then gRect(1,1,2,2)
 */

var GridCanvasNode = function (_CanvasNode) {
    _inherits(GridCanvasNode, _CanvasNode);

    function GridCanvasNode() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$state = _ref.state,
            state = _ref$state === undefined ? {} : _ref$state,
            _ref$config = _ref.config,
            config = _ref$config === undefined ? {} : _ref$config,
            width = _ref.width,
            height = _ref.height,
            size = _ref.size;

        _classCallCheck(this, GridCanvasNode);

        var _this = _possibleConstructorReturn(this, (GridCanvasNode.__proto__ || Object.getPrototypeOf(GridCanvasNode)).call(this, { state: state, config: config, width: width, height: height }));

        _this.mergeState({
            tile: {
                width: size[0],
                height: size[1]
            }
        });
        return _this;
    }

    _createClass(GridCanvasNode, [{
        key: "resizeTile",
        value: function resizeTile(tw, th) {
            if (Number.isInteger(tw) && Number.isInteger(th)) {
                this.mergeState({
                    tile: {
                        width: tw,
                        height: th
                    }
                });
            }

            return this;
        }

        /**
         * 
         * @param {string|number} round "floor"|"ceil"|/[0-9]/
         */

    }, {
        key: "pixelToGrid",
        value: function pixelToGrid() {
            var xs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            var _this2 = this;

            var ys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref2$round = _ref2.round,
                round = _ref2$round === undefined ? 0 : _ref2$round,
                _ref2$asArray = _ref2.asArray,
                asArray = _ref2$asArray === undefined ? false : _ref2$asArray;

            if (String(round).match(/[0-9]/)) {
                xs = xs.map(function (x) {
                    return parseFloat(x).toFixed(round);
                });
                ys = ys.map(function (y) {
                    return parseFloat(y).toFixed(round);
                });
            } else if (round in Math) {
                xs = xs.map(function (x) {
                    return Math[round](x);
                });
                ys = ys.map(function (y) {
                    return Math[round](y);
                });
            }

            var tx = xs.map(function (x) {
                return _this2.tw * x;
            });
            var ty = ys.map(function (y) {
                return _this2.th * y;
            });

            if (asArray === true) {
                return [tx, ty];
            }

            return {
                x: tx,
                y: ty
            };
        }
    }, {
        key: "drawGrid",
        value: function drawGrid() {
            var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref3$fillStyle = _ref3.fillStyle,
                fillStyle = _ref3$fillStyle === undefined ? "#000" : _ref3$fillStyle;

            this.prop({ fillStyle: fillStyle });

            for (var x = 0; x < this.xqty; x++) {
                for (var y = 0; y < this.yqty; y++) {
                    this.gRect(x, y, 1, 1, { isFilled: false });
                }
            }
        }
    }, {
        key: "drawTransparency",
        value: function drawTransparency() {
            var iter = 0;
            for (var x = 0; x < this.canvas.width; x += this.tw / 2) {
                for (var y = 0; y < this.canvas.height; y += this.th / 2) {
                    this.ctx.fillStyle = iter % 2 === 0 ? "#fcfcfc" : "#f5f5f5";
                    this.ctx.fillRect(x, y, this.tw, this.th);
                    ++iter;
                }
                ++iter;
            }
        }

        //* Grid ("g") Shape Methods
        /*
         *  All ctx modifications (e.g. color, stroke width, etc.) should be changed via .prop
         */

    }, {
        key: "gErase",
        value: function gErase(x, y, w, h) {
            var _ref4 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
                _ref4$round = _ref4.round,
                round = _ref4$round === undefined ? 0 : _ref4$round;

            var _pixelToGrid = this.pixelToGrid([x, w], [y, h], { round: round, asArray: true }),
                _pixelToGrid2 = _slicedToArray(_pixelToGrid, 2),
                _pixelToGrid2$ = _slicedToArray(_pixelToGrid2[0], 2),
                tx = _pixelToGrid2$[0],
                tw = _pixelToGrid2$[1],
                _pixelToGrid2$2 = _slicedToArray(_pixelToGrid2[1], 2),
                ty = _pixelToGrid2$2[0],
                th = _pixelToGrid2$2[1];

            this.erase(tx, ty, tw, th);

            return this;
        }
    }, {
        key: "gPoint",
        value: function gPoint(x, y) {
            var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                round = _ref5.round;

            return this.gRect(x, y, 1, 1, { isFilled: true, round: round });
        }
    }, {
        key: "gRect",
        value: function gRect(x, y, w, h) {
            var _ref6 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
                _ref6$isFilled = _ref6.isFilled,
                isFilled = _ref6$isFilled === undefined ? false : _ref6$isFilled,
                round = _ref6.round;

            var _pixelToGrid3 = this.pixelToGrid([x, w], [y, h], { round: round, asArray: true }),
                _pixelToGrid4 = _slicedToArray(_pixelToGrid3, 2),
                _pixelToGrid4$ = _slicedToArray(_pixelToGrid4[0], 2),
                tx = _pixelToGrid4$[0],
                tw = _pixelToGrid4$[1],
                _pixelToGrid4$2 = _slicedToArray(_pixelToGrid4[1], 2),
                ty = _pixelToGrid4$2[0],
                th = _pixelToGrid4$2[1];

            this.rect(tx, ty, tw, th, { isFilled: isFilled });

            return this;
        }
    }, {
        key: "gTile",
        value: function gTile(imageOrSrc, sx, sy, dx, dy) {
            var _ref7 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {},
                round = _ref7.round;

            var _pixelToGrid5 = this.pixelToGrid([sx, dx], [sy, dy], { round: round, asArray: true }),
                _pixelToGrid6 = _slicedToArray(_pixelToGrid5, 2),
                _pixelToGrid6$ = _slicedToArray(_pixelToGrid6[0], 2),
                tsx = _pixelToGrid6$[0],
                tdx = _pixelToGrid6$[1],
                _pixelToGrid6$2 = _slicedToArray(_pixelToGrid6[1], 2),
                tsy = _pixelToGrid6$2[0],
                tdy = _pixelToGrid6$2[1];

            this.image(imageOrSrc, tsx, tsy, this.tw, this.th, tdx, tdy, this.tw, this.th);

            return this;
        }
    }, {
        key: "gQuilt",
        value: function gQuilt(x, y, w, h) {
            var _ref8 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
                round = _ref8.round,
                colorFn = _ref8.colorFn;

            this.ctx.save();
            for (var i = 0; i < w; i++) {
                for (var j = 0; j < h; j++) {
                    var color = void 0;

                    if (typeof colorFn === "function") {
                        color = colorFn({ x: x + i, y: y + j, i: i, j: j }, { tx: x, ty: y, w: w, h: h });
                    } else {
                        color = "rgb(" + ~~(Math.random() * 255) + ", " + ~~(Math.random() * 255) + ", " + ~~(Math.random() * 255) + ")";
                    }

                    this.prop({
                        fillStyle: color
                    });

                    this.gPoint(x + i, y + j);
                }
            }
            this.ctx.restore();
        }
    }, {
        key: "tw",
        get: function get() {
            return this.state.tile.width;
        }
    }, {
        key: "th",
        get: function get() {
            return this.state.tile.height;
        }
    }, {
        key: "xqty",
        get: function get() {
            return this.canvas.width / this.tw;
        }
    }, {
        key: "yqty",
        get: function get() {
            return this.canvas.height / this.th;
        }
    }]);

    return GridCanvasNode;
}(_CanvasNode3.default);

exports.default = GridCanvasNode;