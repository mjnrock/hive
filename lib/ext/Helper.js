"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.GenerateUUID = GenerateUUID;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bitwise = exports.Bitwise = {
	add: function add(base) {
		for (var _len = arguments.length, flags = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			flags[_key - 1] = arguments[_key];
		}

		flags.forEach(function (flag) {
			base |= flag;
		});

		return base;
	},
	remove: function remove(base) {
		for (var _len2 = arguments.length, flags = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
			flags[_key2 - 1] = arguments[_key2];
		}

		flags.forEach(function (flag) {
			base &= ~flag;
		});

		return base;
	},
	has: function has(base, flag) {
		return !!(base & flag);
	}
};

var Dice = exports.Dice = {
	random: function random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	roll: function roll(X, Y) {
		var Z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		var value = 0;
		for (var i = 0; i < X; i++) {
			value += Dice.random(1, Y);
		}

		return value + Z;
	},

	coin: function coin() {
		return Dice.roll(1, 2) === 1 ? true : false;
	},

	d2: function d2() {
		var Z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		return Dice.roll(1, 2) + Z;
	},
	d3: function d3() {
		var Z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		return Dice.roll(1, 3) + Z;
	},
	d4: function d4() {
		var Z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		return Dice.roll(1, 4) + Z;
	},
	d6: function d6() {
		var Z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		return Dice.roll(1, 6) + Z;
	},
	d10: function d10() {
		var Z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		return Dice.roll(1, 10) + Z;
	},
	d12: function d12() {
		var Z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		return Dice.roll(1, 12) + Z;
	},
	d20: function d20() {
		var Z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		return Dice.roll(1, 20) + Z;
	},
	d25: function d25() {
		var Z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		return Dice.roll(1, 25) + Z;
	},
	d50: function d50() {
		var Z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		return Dice.roll(1, 50) + Z;
	},
	d100: function d100() {
		var Z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		return Dice.roll(1, 100) + Z;
	},

	weighted: function weighted(weights, values) {
		var total = 0;
		for (var i in weights) {
			total += weights[i];
		}

		var roll = Dice.random(1, total);

		var count = 0;
		for (var _i = 0; _i < weights.length; _i++) {
			count += weights[_i];

			if (roll <= count) {
				return values[_i];
			}
		}

		return values[values.length - 1];
	}
};

function GenerateUUID() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		// eslint-disable-next-line
		var r = Math.random() * 16 | 0,
		    v = c == "x" ? r : r & 0x3 | 0x8;

		return v.toString(16);
	});
}

var LinkedListNode = exports.LinkedListNode = function LinkedListNode(data) {
	_classCallCheck(this, LinkedListNode);

	this._data = data;
	this._previous = null;
	this._next = null;
};

var LinkedList = exports.LinkedList = function () {
	function LinkedList() {
		_classCallCheck(this, LinkedList);

		this._length = 0;
		this._head = null;
		this._tail = null;
	}

	_createClass(LinkedList, [{
		key: "size",
		value: function size() {
			return this._length;
		}
	}, {
		key: "get",
		value: function get(index) {
			var curr = this._head,
			    i = 0;

			if (this._length === 0 || index < 0 || index > this._length - 1) {
				return false;
			}

			while (i < index) {
				curr = curr._next;
				i++;
			}

			return curr;
		}
	}, {
		key: "add",
		value: function add(value) {
			var node = new LinkedListNode(value);

			if (this._length > 0) {
				this._tail._next = node;
				node._previous = this._tail;
				this._tail = node;
			} else {
				this._head = node;
				this._tail = node;
			}

			this._length++;

			return this;
		}
	}, {
		key: "remove",
		value: function remove(index) {
			if (this._length === 0 || index < 0 || index > this._length - 1) {
				return false;
			}

			if (index === 0) {
				if (!this._head._next) {
					this._head = null;
					this._tail = null;
				} else {
					this._head = this._head._next;
				}
			} else if (index === this._length - 1) {
				this._tail = this._tail._previous;
			} else {
				var i = 0,
				    curr = this._head;
				while (i < index) {
					curr = curr._next;
					i++;
				}

				curr._previous._next = curr._next;
				curr._next._previous = curr._previous;
			}

			this._length--;
			if (this._length === 1) {
				this._tail = this._head;
			}
			if (this._length > 0) {
				this._head._previous = null;
				this._tail._next = null;
			}

			return this;
		}
	}]);

	return LinkedList;
}();

exports.default = {
	GenerateUUID: GenerateUUID,
	Bitwise: Bitwise,
	Dice: Dice,
	LinkedListNode: LinkedListNode,
	LinkedList: LinkedList
};