import observable from './observable';

/**
 * Sence 场景基类 ， 类似android的 activity ， 一个通用的sence class
 * 
 * 场景范围，只管Sence的生命周期
 * 不管ajax组件的销毁，由其他模块来玩
 * header 和 bottombar 先不管吧
 * 
 * 要不要弄一个唯一 sence id ？
 */
export function Sence(container, statgeID, route) { // 公共的构造函数，不会被覆盖
    observable(this);
    this.$root = $(container);
    this.statgeID = statgeID;

    // this.init.apply(this, arguments);
}

$.extend(Sence.prototype, {
    // 新页面(必须带有data-page属性)插入到DOM的时候，在资源加载进去之前会触发
    beforeInit(resArr) { return resArr },  // 给一个修改的机会？？

    // 类初始化时调用，在动画之前
    init(route) { },

    /// 动画类型
    // 1. 首次载入入场动画
    // 2. resume入场动画
    // 3. 出场动画

    // 当页面开始做动画的时候触发
    beforeAnimation(isBack, isHide) { },

    // 	在页面动画完成之后触发
    afterAnimation(isBack, isHide) { },

    // 重新被切换到前台
    resume() { },

    // 被切换到后台
    pause() { },

    // 移除动画
    beforeRemove() { },

    // 页面销毁
    destroy() {
        this.off();
        this.$root.off().empty().remove();
        this.$root = null;
    }
});


var senceClasses = {};
export function extendSence(senceName, instanceProps, staticProps) {
    // duplicate check
    if (getSence(senceName)) {
        console.warn("duplicate senceName " + senceName);
    }

    // inherit
    function SubSence() {
        Sence.apply(this, arguments);  // === super(arguments)
    }
    SubSence.prototype = Object.create(Sence.prototype);
    $.extend(SubSence.prototype, instanceProps);
    SubSence.prototype.constructor = SubSence;

    $.extend(SubSence, staticProps);

    senceClasses[senceName] = SubSence;
}

export function getSence(senceName) {
    return senceClasses[senceName];
}

export default $.extend({}, exports);