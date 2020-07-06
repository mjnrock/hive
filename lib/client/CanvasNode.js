"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnumMessageType = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Node2 = require("./../Node");

var _Node3 = _interopRequireDefault(_Node2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EnumMessageType = exports.EnumMessageType = {
    RENDER: "CanvasNode.Render"
};

var CanvasNode = function (_Node) {
    _inherits(CanvasNode, _Node);

    function CanvasNode() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$state = _ref.state,
            state = _ref$state === undefined ? {} : _ref$state,
            _ref$config = _ref.config,
            config = _ref$config === undefined ? {} : _ref$config,
            width = _ref.width,
            height = _ref.height;

        _classCallCheck(this, CanvasNode);

        var _this = _possibleConstructorReturn(this, (CanvasNode.__proto__ || Object.getPrototypeOf(CanvasNode)).call(this, _extends({
            canvas: document.createElement("canvas"),
            images: {}

        }, state)));

        _this.mergeConfig(_extends({
            isPlaying: false,
            lastTimestamp: 0,
            fps: 0

        }, config));

        _this.resize(width, height);
        return _this;
    }

    _createClass(CanvasNode, [{
        key: "img",
        value: function img(key) {
            return this.images[key];
        }
    }, {
        key: "resize",
        value: function resize(width, height) {
            if (Number.isInteger(width) && Number.isInteger(height)) {
                this.canvas.width = width;
                this.canvas.height = height;
            }

            return this;
        }

        //* "Chainable" abstractions to allow a series of calls to be made before a context reset

    }, {
        key: "begin",
        value: function begin() {
            this.ctx.save();

            return this;
        }
    }, {
        key: "end",
        value: function end() {
            this.ctx.restore();

            return this;
        }

        //* Context meta methods

    }, {
        key: "prop",
        value: function prop() {
            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        key = _step$value[0],
                        value = _step$value[1];

                    this.ctx[key] = value;
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

            return this;
        }
    }, {
        key: "loadImage",
        value: function loadImage(name, imageOrSrc) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                if (imageOrSrc instanceof HTMLImageElement) {
                    _this2.state.images[name] = imageOrSrc;

                    resolve(_this2);
                } else if (typeof imageOrSrc === "string" || imageOrSrc instanceof String) {
                    var img = new Image();
                    img.onload = function (e) {
                        _this2.state.images[name] = img;

                        resolve(_this2);
                    };
                    img.src = imageOrSrc;
                } else {
                    reject(_this2);
                }

                return _this2;
            });
        }
    }, {
        key: "loadImages",
        value: function loadImages() {
            var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = arr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var imgArr = _step2.value;

                    this.loadImage.apply(this, _toConsumableArray(imgArr || []));
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
        }
    }, {
        key: "play",
        value: function play() {
            this.config.isActive = true;
            this.render();
        }
    }, {
        key: "pause",
        value: function pause() {
            this.config.isActive = false;
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            if (this.config.isActive === true) {
                window.requestAnimationFrame(function (ts) {
                    _this3.onRender(ts);

                    _this3.render();
                });
            }
        }
    }, {
        key: "onRender",
        value: function onRender(ts) {
            var dt = ts - this.config.lastTimestamp;

            this.dispatch(EnumMessageType.RENDER, {
                timestamp: ts,
                delta: dt,
                canvas: this.canvas,
                ctx: this.ctx
            });

            this.config.fps = 1000 / dt;
            this.config.lastTimestamp = ts;
        }

        // Get a stream of the current canvas

    }, {
        key: "getStream",
        value: function getStream() {
            var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

            return this.canvas.captureStream(fps);
        }
    }, {
        key: "copyTo",
        value: function copyTo(canvas) {
            this.ctx.drawImage(this.canvas, 0, 0);

            return canvas;
        }

        //* HTML Element Drawing

    }, {
        key: "drawCanvas",
        value: function drawCanvas(canvas) {
            this.ctx.drawImage(canvas, 0, 0);

            return this;
        }
    }, {
        key: "drawVideo",
        value: function drawVideo(video) {
            this.ctx.drawImage(video, 0, 0);

            return this;
        }
    }, {
        key: "drawImage",
        value: function drawImage(video) {
            this.ctx.drawImage(video, 0, 0);

            return this;
        }

        //* Erasure methods

    }, {
        key: "clear",
        value: function clear() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            return this;
        }
    }, {
        key: "erase",
        value: function erase(x, y, w, h) {
            this.ctx.clearRect(x, y, w, h);

            return this;
        }
    }, {
        key: "eraseNgon",
        value: function eraseNgon(n, x, y, r) {
            var _ref2 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
                _ref2$rotation = _ref2.rotation,
                rotation = _ref2$rotation === undefined ? 0 : _ref2$rotation;

            var pColor = this.ctx.strokeStyle;
            var pBgColor = this.ctx.fillStyle;

            this.ctx.globalCompositeOperation = "destination-out";
            this.ctx.fillStyle = "#fff";
            this.ngon(n, x, y, r, { rotation: rotation, isFilled: true });

            // Reset the composite and revert color
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.strokeStyle = pColor;
            this.ctx.fillStyle = pBgColor;
        }

        //* Shape methods

    }, {
        key: "circle",
        value: function circle(x, y, r) {
            var _ref3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
                _ref3$isFilled = _ref3.isFilled,
                isFilled = _ref3$isFilled === undefined ? false : _ref3$isFilled;

            if (isFilled) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, r, 0, 2 * Math.PI);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(x, y, r, 0, 2 * Math.PI);
                this.ctx.closePath();
                this.ctx.stroke();
            }

            return this;
        }
    }, {
        key: "point",
        value: function point(x, y) {
            return this.rect(x, y, 1, 1);
        }
    }, {
        key: "line",
        value: function line(x0, y0, x1, y1) {
            this.ctx.beginPath();
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x1, y1);
            this.ctx.closePath();
            this.ctx.stroke();

            return this;
        }
    }, {
        key: "rect",
        value: function rect(x, y, w, h) {
            var _ref4 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
                _ref4$isFilled = _ref4.isFilled,
                isFilled = _ref4$isFilled === undefined ? false : _ref4$isFilled;

            this.ctx.beginPath();
            if (isFilled) {
                this.ctx.fillRect(x, y, w, h);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            } else {
                this.ctx.rect(x, y, w, h);
                this.ctx.closePath();
                this.ctx.stroke();
            }

            return this;
        }
    }, {
        key: "square",
        value: function square(x, y) {
            var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref5$rc = _ref5.rc,
                rc = _ref5$rc === undefined ? null : _ref5$rc,
                _ref5$rw = _ref5.rw,
                rw = _ref5$rw === undefined ? null : _ref5$rw,
                _ref5$isFilled = _ref5.isFilled,
                isFilled = _ref5$isFilled === undefined ? false : _ref5$isFilled;

            if (rc !== null) {
                this.rect(x, y, 2 * rc * Math.cos(Math.PI / 4), 2 * rc * Math.sin(Math.PI / 4), { isFilled: isFilled });
            } else if (rw !== null) {
                this.rect(x, y, 2 * rw, 2 * rw, { isFilled: isFilled });
            }
        }
    }, {
        key: "_getNgonCorner",
        value: function _getNgonCorner(x, y, r, i, v) {
            var rot = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

            var deg = 360 / v * i + rot;
            var rad = Math.PI / 180 * deg;

            return [x + r * Math.cos(rad), y + r * Math.sin(rad)];
        }
    }, {
        key: "ngon",
        value: function ngon(n, x, y, r) {
            var _ctx,
                _this4 = this,
                _ctx3;

            var _ref6 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
                _ref6$isFilled = _ref6.isFilled,
                isFilled = _ref6$isFilled === undefined ? false : _ref6$isFilled,
                _ref6$rotation = _ref6.rotation,
                rotation = _ref6$rotation === undefined ? 0 : _ref6$rotation;

            var corners = [];
            for (var i = 0; i < n; i++) {
                corners.push(this._getNgonCorner(x, y, r, i, n, rotation));
            }

            this.ctx.beginPath();
            (_ctx = this.ctx).moveTo.apply(_ctx, _toConsumableArray(corners[0]));
            corners.forEach(function (c, i) {
                if (i < corners.length - 1) {
                    var _ctx2;

                    (_ctx2 = _this4.ctx).lineTo.apply(_ctx2, _toConsumableArray(corners[i + 1]));
                }
            });
            (_ctx3 = this.ctx).lineTo.apply(_ctx3, _toConsumableArray(corners[0]));
            this.ctx.closePath();

            if (isFilled) {
                // this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            } else {
                this.ctx.stroke();
            }

            return this;
        }
    }, {
        key: "text",
        value: function text(txt, x, y) {
            var _ref7 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
                _ref7$align = _ref7.align,
                align = _ref7$align === undefined ? "center" : _ref7$align,
                _ref7$color = _ref7.color,
                color = _ref7$color === undefined ? "#000" : _ref7$color,
                _ref7$font = _ref7.font,
                font = _ref7$font === undefined ? "10pt mono" : _ref7$font;

            var xn = x,
                yn = y;

            if (align) {
                this.ctx.textAlign = align;
                this.ctx.textBaseline = "middle";
            }

            var pColor = this.ctx.fillStyle;
            this.ctx.fillStyle = color;
            this.ctx.font = font;
            this.ctx.fillText(txt, xn, yn);
            this.ctx.fillStyle = pColor;

            return this;
        }
    }, {
        key: "image",
        value: function image(imageOrSrc) {
            var _this5 = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return new Promise(function (resolve, reject) {
                if (imageOrSrc instanceof HTMLImageElement || imageOrSrc instanceof HTMLCanvasElement) {
                    var _ctx4;

                    // Synchronously draw if <img> or <canvas>
                    (_ctx4 = _this5.ctx).drawImage.apply(_ctx4, [imageOrSrc].concat(args));

                    resolve(_this5);
                } else if (typeof imageOrSrc === "string" || imageOrSrc instanceof String) {
                    if (imageOrSrc in _this5.images) {
                        var _ctx5;

                        // Synchronously draw if @imageOrSrc is a key in this.images (i.e. a cached image)

                        (_ctx5 = _this5.ctx).drawImage.apply(_ctx5, [_this5.images[imageOrSrc]].concat(args));
                    } else {
                        // Asynchronously draw if @imageOrSrc is a "src" string
                        var img = new Image();
                        img.onload = function (e) {
                            var _ctx6;

                            (_ctx6 = _this5.ctx).drawImage.apply(_ctx6, [img].concat(args));

                            resolve(_this5);
                        };
                        img.src = imageOrSrc;
                    }
                } else {
                    reject(_this5);
                }

                return _this5;
            });
        }
    }, {
        key: "tile",
        value: function tile(imageOrSrc, size, sx, sy, dx, dy) {
            this.image(imageOrSrc, sx, sy, size, size, dx, dy, size, size);

            return this;
        }
    }, {
        key: "canvas",
        get: function get() {
            return this.state.canvas;
        }
    }, {
        key: "ctx",
        get: function get() {
            return this.state.canvas.getContext("2d");
        }
    }, {
        key: "width",
        get: function get() {
            return this.canvas.width;
        }
    }, {
        key: "height",
        get: function get() {
            return this.canvas.height;
        }
    }, {
        key: "center",
        get: function get() {
            return [this.width / 2, this.height / 2];
        }
    }, {
        key: "images",
        get: function get() {
            return this.state.images;
        }
    }, {
        key: "fps",
        get: function get() {
            return this.config.fps;
        }
    }]);

    return CanvasNode;
}(_Node3.default);

exports.default = CanvasNode;