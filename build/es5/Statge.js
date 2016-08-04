"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 舞台类, 就是一块div的 单页面 的管理类，
// 一个舞台可一切换不同的场景，但是最多只有一个场景在前台

// 存放所有的资源配置
var pageConfMap = {};
// PageConf {
//     pageId: string;
//     managerId: string;
//     script?: string | string[];
//     html?: string | string[];
//     htmlContent: string;
// }

var Statge = function () {
    _createClass(Statge, null, [{
        key: "addPageConf",

        /**
         * @param  pc : page config or page config map
         */
        value: function addPageConf(pc) {
            // not check duplicate
            if (typeof pc.pageId === "string") {
                pageConfMap[pc.pageId] = pc;
            } else {
                $.extends(pageConfMap, pc); // page config map
            }
        }
    }]);

    function Statge(rootEle) {
        _classCallCheck(this, Statge);

        // route 对象的栈
        this.routeStack = [];
        this.rootEle = rootEle;
    }

    // 开始监听事件


    _createClass(Statge, [{
        key: "start",
        value: function start() {}

        // 停止监听事件

    }, {
        key: "stop",
        value: function stop() {}
    }]);

    return Statge;
}();

exports.default = Statge;