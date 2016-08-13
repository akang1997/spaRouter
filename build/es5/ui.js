'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.alert = alert;
exports.showloading = showloading;
exports.hideloading = hideloading;
function alert(msg, cb) {
    console.log("TODO: alert:" + msg);
}

var loadingCount = 0;
function showloading() {
    console.log('TODO: showloading');
}
function hideloading() {
    console.log('TODO: hideloading');
}

var transitionEndEvent = exports.transitionEndEvent = 'webkitTransitionEnd';

// 检测动画结束事件
setTimeout(function () {
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    };
    var el = document.createElement('div');
    for (var t in transitions) {
        if (el.style[t] !== undefined) {
            exports.transitionEndEvent = transitionEndEvent = transitions[t];
            return;
        }
    }
}, 0);

// 导出默认 模块。。。 
// 在不使用 export default 时， exports 未定义 exports.default 字段
exports.default = $.extend({}, exports);