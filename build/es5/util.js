"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.uniqID = uniqID;
exports.startsWith = startsWith;
exports.parseHash = parseHash;
exports.makeArr = makeArr;
exports.arrFlat = arrFlat;
exports.argsArr = argsArr;
exports.safeRun = safeRun;

var _requestAnimationFrame = require("./requestAnimationFrame");

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var counter = 0;
function uniqID(prefix) {
    return (prefix || "") + counter++;
}

// string startsWith
function startsWith(s, prefix) {
    if (s.length < prefix.length) return false;
    for (var i = 0, len = prefix.length; i < len; i++) {
        if (s[i] !== prefix[i]) return false;
    }
    return true;
}

// 解析hash的各个部件
function parseHash(hash) {
    var ret = { isSence: false, hash: hash };
    if (startsWith(hash, "#!")) {
        ret.isSence = true;
    } else {
        return ret;
    }

    hash = hash.substr(2);
    var arr = hash.split("?");
    var sence = arr[0];
    var query = arr[1];

    var sencePath = sence.split("/");
    if (sencePath.length == 2) {
        ret.resID = sencePath[1];
        ret.statgeID = sencePath[0];
    } else {
        ret.resID = sencePath[0];
    }

    if (query) {
        (function () {
            var queryArr = query.split("&");
            var params = {};
            queryArr.forEach(function (pair) {
                var a = pair.split("&");
                params[a[0]] = a[1];
            });
            ret.params = params;
        })();
    }

    return ret;
}

function makeArr(obj) {
    return $.isArray(obj) ? obj : [obj];
}

function arrFlat(arr) {
    var ret = [];
    arr.forEach(function (item) {
        if ($.isArray(item)) ret = ret.concat(item);else ret.push(item);
    });
    return ret;
}

var _tmpArr = [];
// make arguments to array
function argsArr(args, start, end) {
    return _tmpArr.slice.call(args, start, end);
}

// 错了打个日志继续往前走的类型。。。
function safeRun(fn, thisObj, argsArr, info) {
    try {
        return fn && fn.apply(thisObj, argsArr);
    } catch (e) {
        console.warn(info, e);
        return false;
    }
}

exports.default = $.extend({}, exports); // 导出默认 模块。。。