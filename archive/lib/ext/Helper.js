"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.GenerateUUID = GenerateUUID;
exports.Clamp = Clamp;
exports.Enumerator = Enumerator;
exports.NormalizeTheta = NormalizeTheta;

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

var DistinctArrayFilter = exports.DistinctArrayFilter = function DistinctArrayFilter(value, index, self) {
    return self.indexOf(value) === index;
};
var ToDistinctArray = exports.ToDistinctArray = function ToDistinctArray(array) {
    return array.filter(DistinctArrayFilter);
};

// Array.prototype.distinct = function() {
//     return this.filter(DistinctArrayFilter);
// };

function GenerateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        // eslint-disable-next-line
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : r & 0x3 | 0x8;

        return v.toString(16);
    });
}

function Clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function Enumerator() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var obj = _extends({}, items);

    obj.flagToName = function (flag) {
        for (var name in obj) {
            if (obj[name] === flag) {
                return name;
            }
        }

        return null;
    };
    obj.maskToNames = function (mask) {
        var names = [];

        for (var name in obj) {
            if (Bitwise.has(mask, obj[name])) {
                names.push(name);
            }
        }

        return names;
    };

    return obj;
};

var ClassEnumerator = exports.ClassEnumerator = function () {
    function ClassEnumerator() {
        var _this = this;

        var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ClassEnumerator);

        this.entries = entries;

        return new Proxy(this, {
            get: function get(target, prop) {
                // console.log(prop, prop in target, target[ prop ]);
                if (prop in target) {
                    return target[prop];
                }

                if (prop in _this.entries) {
                    return _this.entries[prop];
                }

                return target;
            },
            set: function set(target, prop, value) {
                if (prop in _this.entries) {
                    _this.entries[prop] = value;
                } else {
                    target[prop] = value;
                }

                return target;
            }
        });
    }

    _createClass(ClassEnumerator, [{
        key: "flagToName",
        value: function flagToName(flag) {
            for (var name in this.entries) {
                if (this.entries[name] === flag) {
                    return name;
                }
            }

            return null;
        }
    }, {
        key: "maskToNames",
        value: function maskToNames(mask) {
            var names = [];

            for (var name in this.entries) {
                if (Bitwise.has(mask, this.entries[name])) {
                    names.push(name);
                }
            }

            return names;
        }
    }, {
        key: "has",
        value: function has(mask, flag) {
            return Bitwise.has(mask, flag);
        }
    }, {
        key: "add",
        value: function add(mask) {
            for (var _len3 = arguments.length, flags = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                flags[_key3 - 1] = arguments[_key3];
            }

            return Bitwise.add.apply(Bitwise, [mask].concat(flags));
        }
    }, {
        key: "remove",
        value: function remove(mask) {
            for (var _len4 = arguments.length, flags = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                flags[_key4 - 1] = arguments[_key4];
            }

            return Bitwise.remove.apply(Bitwise, [mask].concat(flags));
        }
    }]);

    return ClassEnumerator;
}();

function NormalizeTheta(dx, dy) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$toNearestDegree = _ref.toNearestDegree,
        toNearestDegree = _ref$toNearestDegree === undefined ? false : _ref$toNearestDegree;

    var theta = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if (theta < 0) {
        theta += 360;
    }

    if (typeof toNearestDegree === "number") {
        theta = Math.round(theta / toNearestDegree) * toNearestDegree;
    }

    if (theta % 360 === 0) {
        theta = 0;
    }

    return theta;
}

exports.default = {
    GenerateUUID: GenerateUUID,
    Bitwise: Bitwise,
    Enumerator: Enumerator,
    NormalizeTheta: NormalizeTheta,
    Clamp: Clamp,

    DistinctArrayFilter: DistinctArrayFilter,
    ToDistinctArray: ToDistinctArray
};