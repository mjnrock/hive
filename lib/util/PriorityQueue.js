"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var top = 0;
var parent = function parent(i) {
    return (i + 1 >>> 1) - 1;
};
var left = function left(i) {
    return (i << 1) + 1;
};
var right = function right(i) {
    return i + 1 << 1;
};

var PriorityQueue = function () {
    function PriorityQueue() {
        var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (a, b) {
            return a > b;
        };

        _classCallCheck(this, PriorityQueue);

        this._heap = [];
        this._comparator = comparator;
    }

    _createClass(PriorityQueue, [{
        key: "peek",
        value: function peek() {
            return this._heap[top];
        }
    }, {
        key: "push",
        value: function push() {
            var _this = this;

            for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
                values[_key] = arguments[_key];
            }

            values.forEach(function (value) {
                _this._heap.push(value);
                _this._siftUp();
            });

            return this.size;
        }
    }, {
        key: "pop",
        value: function pop() {
            var poppedValue = this.peek();
            var bottom = this.size - 1;

            if (bottom > top) {
                this._swap(top, bottom);
            }

            this._heap.pop();
            this._siftDown();

            return poppedValue;
        }
    }, {
        key: "replace",
        value: function replace(value) {
            var replacedValue = this.peek();

            this._heap[top] = value;
            this._siftDown();

            return replacedValue;
        }
    }, {
        key: "_greater",
        value: function _greater(i, j) {
            return this._comparator(this._heap[i], this._heap[j]);
        }
    }, {
        key: "_swap",
        value: function _swap(i, j) {
            var _ref = [this._heap[j], this._heap[i]];
            this._heap[i] = _ref[0];
            this._heap[j] = _ref[1];
        }
    }, {
        key: "_siftUp",
        value: function _siftUp() {
            var node = this.size - 1;
            while (node > top && this._greater(node, parent(node))) {
                this._swap(node, parent(node));
                node = parent(node);
            }
        }
    }, {
        key: "_siftDown",
        value: function _siftDown() {
            var node = top;
            while (left(node) < this.size && this._greater(left(node), node) || right(node) < this.size && this._greater(right(node), node)) {
                var maxChild = right(node) < this.size && this._greater(right(node), left(node)) ? right(node) : left(node);

                this._swap(node, maxChild);
                node = maxChild;
            }
        }
    }, {
        key: "size",
        get: function get() {
            return this._heap.length;
        }
    }, {
        key: "isEmpty",
        get: function get() {
            return this.size == 0;
        }
    }]);

    return PriorityQueue;
}();

exports.default = PriorityQueue;