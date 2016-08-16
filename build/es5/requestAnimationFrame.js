'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
(function (global) {
    if (global.requestAnimationFrame) {
        return;
    }

    if (global.webkitRequestAnimationFrame) {
        // Chrome <= 23, Safari <= 6.1, Blackberry 10
        global.requestAnimationFrame = global['webkitRequestAnimationFrame'];
        global.cancelAnimationFrame = global['webkitCancelAnimationFrame'] || global['webkitCancelRequestAnimationFrame'];
        return;
    }

    // IE <= 9, Android <= 4.3, very old/rare browsers
    global.requestAnimationFrame = function (callback) {
        return global.setTimeout(callback, 0);
    };

    global.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
})(window);

exports.default = 1;