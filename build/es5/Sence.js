'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Sence = Sence;
exports.extendSence = extendSence;
exports.getSence = getSence;

var _observable = require('./observable');

var _observable2 = _interopRequireDefault(_observable);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sence 场景基类 ， 类似android的 activity ， 一个通用的sence class
 * 
 * 场景范围，只管Sence的生命周期
 * 不管ajax组件的销毁，由其他模块来玩
 * header 和 bottombar 先不管吧
 * 
 * 要不要弄一个唯一 sence id ？
 */
function Sence(container, statgeID, route) {
    // 公共的构造函数，不会被覆盖
    (0, _observable2.default)(this);
    this.$root = $(container);
    this.statgeID = statgeID;
    this.id = _util2.default.uniqID("sence_00");
    this.$route = route;
    this.resID = route.hashConf.resID;
    // this.init.apply(this, arguments);
}

$.extend(Sence.prototype, {
    // 新页面(必须带有data-page属性)插入到DOM的时候，在资源加载进去之前会触发

    beforeInit: function beforeInit(resArr) {
        return resArr;
    },
    // 给一个修改的机会？？

    // 类初始化时调用，在动画之前
    init: function init(data, hashConf, senceConf) {},


    /// 动画类型
    // 1. 首次载入入场动画
    // 2. resume入场动画
    // 3. 出场动画

    // 当页面开始做动画的时候触发
    beforeAnimation: function beforeAnimation(isBack, isHide) {},


    // 	在页面动画完成之后触发
    afterAnimation: function afterAnimation(isBack, isHide) {},


    // 重新被切换到前台
    resume: function resume() {},


    // 被切换到后台
    pause: function pause() {},


    // return true / false ，来实现cache
    shouldDOMCache: function shouldDOMCache(conf) {
        return false;
    },


    // 移除动画
    // beforeRemove() { },

    beforeNextSence: function beforeNextSence() {},
    // 在下一个场景实例创建之前执行

    // 页面销毁
    destroy: function destroy() {
        this.off();
        this.$root.off().empty().remove();
        this.$root = null;
    }
});

var senceClasses = {};
function extendSence(senceName, instanceProps, staticProps) {
    // duplicate check
    if (getSence(senceName)) {
        console.warn("duplicate senceName " + senceName);
    }

    // inherit
    function SubSence() {
        Sence.apply(this, arguments); // === super(arguments)
    }
    SubSence.prototype = Object.create(Sence.prototype);
    $.extend(SubSence.prototype, instanceProps);
    SubSence.prototype.constructor = SubSence;

    $.extend(SubSence, staticProps);

    senceClasses[senceName] = SubSence;
}

function getSence(senceName) {
    return senceClasses[senceName];
}

exports.default = $.extend({}, exports);