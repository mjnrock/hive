"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dice = function () {
	function Dice() {
		_classCallCheck(this, Dice);
	}

	_createClass(Dice, null, [{
		key: "random",
		value: function random(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	}, {
		key: "roll",
		value: function roll(x, y) {
			var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

			var value = 0;
			for (var i = 0; i < x; i++) {
				value += Dice.random(1, y);
			}

			return value + z;
		}
	}, {
		key: "coin",
		value: function coin() {
			return Dice.roll(1, 2) === 1 ? true : false;
		}
	}, {
		key: "d2",
		value: function d2() {
			var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return Dice.roll(1, 2) + z;
		}
	}, {
		key: "d3",
		value: function d3() {
			var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return Dice.roll(1, 3) + z;
		}
	}, {
		key: "d4",
		value: function d4() {
			var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return Dice.roll(1, 4) + z;
		}
	}, {
		key: "d6",
		value: function d6() {
			var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return Dice.roll(1, 6) + z;
		}
	}, {
		key: "d10",
		value: function d10() {
			var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return Dice.roll(1, 10) + z;
		}
	}, {
		key: "d12",
		value: function d12() {
			var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return Dice.roll(1, 12) + z;
		}
	}, {
		key: "d20",
		value: function d20() {
			var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return Dice.roll(1, 20) + z;
		}
	}, {
		key: "d25",
		value: function d25() {
			var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return Dice.roll(1, 25) + z;
		}
	}, {
		key: "d50",
		value: function d50() {
			var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return Dice.roll(1, 50) + z;
		}
	}, {
		key: "d100",
		value: function d100() {
			var z = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return Dice.roll(1, 100) + z;
		}
	}, {
		key: "weighted",
		value: function weighted(weights, values) {
			var total = weights.agg(function (a, v) {
				return a + v;
			}, 0);
			var roll = Dice.random(1, total);

			var count = 0;
			for (var i = 0; i < weights.length; i++) {
				count += weights[i];

				if (roll <= count) {
					return values[i];
				}
			}

			return values[values.length - 1];
		}
	}]);

	return Dice;
}();

exports.default = Dice;
;