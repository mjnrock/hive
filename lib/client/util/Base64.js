"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    Encode: function Encode(input) {
        if (input instanceof HTMLCanvasElement) {
            return input.toDataURL("image/png", 1.0);
        } else if (input instanceof HTMLImageElement) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            canvas.width = input.width;
            canvas.height = input.height;

            ctx.drawImage(input, 0, 0);

            return Base64.Encode(canvas);
        }

        return false;
    },

    Decode: async function Decode(input) {
        return new Promise(function (resolve, reject) {
            if (input instanceof HTMLCanvasElement || input instanceof HTMLImageElement) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                canvas.width = input.width;
                canvas.height = input.height;

                ctx.drawImage(input, 0, 0);

                resolve(canvas);
            } else {
                var _canvas = document.createElement("canvas");
                var _ctx = _canvas.getContext("2d");

                var img = new Image();
                img.onload = function () {
                    _canvas.width = img.width;
                    _canvas.height = img.height;

                    _ctx.drawImage(img, 0, 0);

                    resolve(_canvas);
                };
                img.src = input;
            }
        });
    }
};