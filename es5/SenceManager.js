"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 

/**
 * SenceManager 场景管理类
 */
var SenceManager = function () {
    function SenceManager(parameters) {
        _classCallCheck(this, SenceManager);

        this.init(parameters);
    }

    _createClass(SenceManager, [{
        key: "beforeInit",
        value: function beforeInit() {}

        // 类初始化时调用

    }, {
        key: "init",
        value: function init(param) {}

        // 当页面可以做动画的时候触发

    }, {
        key: "beforeShow",
        value: function beforeShow() {}

        // 	在页面动画完成之后触发

    }, {
        key: "afterShow",
        value: function afterShow() {}

        // 重新被切换到前台

    }, {
        key: "resume",
        value: function resume() {}
    }, {
        key: "afterBack",
        value: function afterBack() {}

        // 被切换到后台

    }, {
        key: "pause",
        value: function pause() {}

        // 移除动画

    }, {
        key: "beforeRemove",
        value: function beforeRemove() {}

        // 页面销毁

    }, {
        key: "destroy",
        value: function destroy() {}
    }]);

    return SenceManager;
}();