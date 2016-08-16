// 舞台类, 就是一块div的 单页面 的管理类，
// 一个 statge 可以看做是一个带router功能的 sence manager
// 一个舞台可一切换不同的场景，但是最多只有一个场景在前台
// 
// 除了管 sence 切换，其他的ui相关内容一律不管

import Route from './Route'
import ResManager from './ResManager'
import util from './util'
import observable from './observable'
import Loader from './Loader'
import Sence from './Sence'
import StatgeManager from './StatgeManager'
import ui from './ui'

var defaultConf = {
    id: null,            // statge 的 id
    mainFlag: false,     // 是否是主statge
    aniType: "fade",     // 动画类型
    uniqueHistory: true,  // 是否允许一个statge中，加载多个同样的sence
    defaultDOMCache: false // 默认是否开启 dom cache
}

// 一个statge的页面切换，只能有一种动画？？
// 暂时只考虑有一种动画的情况吧，fade
class Statge {

    constructor(rootEle, conf) {
        this.conf = $.extend({}, defaultConf, conf);
        observable(this);

        // route 对象的栈
        this.routeStack = [];
        this.rootEle = $(rootEle);
        if (this.rootEle.length !== 1) {
            console.log("not a valid root ele for statge", rootEle);
            return null;
        }
        this.runFlag = true;
        this.id = this.conf.id || this.rootEle.attr("id") || util.uniqID("st_statge_");

        this.isMain = !!this.conf.mainFlag;
        this.activeSence = null;

        this.aniType = this.conf.aniType;

        if (this.rootEle.length === 0) {
            console.warn("no element found for Statge");
        }

        this.init();
    }

    init() {
        this._initDomFrm();
        this._initEvent();
    }

    // 初始化dom框架
    _initDomFrm() {
        this.rootEle.addClass("st-statge " + this.id).attr("data-statgeid", this.id);
        this.isMain && this.rootEle.addClass("st-statge-main");
        this.rootEle.append("<div class='st-sences'></div>");
        this.sencesEle = this.rootEle.children(".st-sences");
    }

    _initEvent() {
        /// 拦截a标签的点击。。
        this.rootEle.on("click", "a", this._listenLink.bind(this));
    }

    _listenLink(e) {
        if (!this.runFlag) return;

        var jt = $(e.target),
            href = jt.attr("href"),
            conf = util.parseHash(href);
        if (conf.isSence && !conf.statgeID) {
            // 吃掉事件
            e.stopPropogation();
            e.preventDefault();
            conf.statgeID = this.id;
        }
    }

    loadSenceById(resID, options) {  // 是否需要触发hashchange ?
        var res = ResManager.getResConf(resID);
        if (res) {
            var hashConf = {
                isSence: true
                , resID: resID
                , statgeID: this.id
            }
            this.loadSence(options, hashConf, true);
        } else {
            console.warn("no sence found: " + resID);
        }
    }

    loadSence(options, hashConf, slientChangeFlag) {
        hashConf = hashConf || util.parseHash(location.hash);
        if (!hashConf.isSence) return;

        var resConf = ResManager.getResConf(hashConf.resID);
        if (!resConf) {
            return console.warn("no sence found: " + hashConf.resID);
        }

        // TODO resID 和 当前route 查重对比
        if (slientChangeFlag) {
            if (hashConf.hash) StatgeManager.slientChangeHash(hashConf.hash);
            else StatgeManager.slientChangeHash("!" + (hashConf.statgeID || this.id) + "/" + hashConf.resID);
        }
        /// begin
        var promise = Loader.loadSenceRes(resConf, (resArr) => {
            // start change sence
            this._changeSecne(hashConf, resConf, resArr, options);
        }, () => {
            /// TODO alert load error
            console.error("load sence resource error: " + hashConf.resID);
        });
    }

    _checkSenceDuplicate() {

    }

    _changeSecne(hashConf, resConf, resArr, options, isBack) {
        options = options || {};
        var oldSence = this.activeSence
            , defaultDOMCache = this.defaultDOMCache
            , aniType = options.aniType || "fade";

        oldSence && util.safeRun(oldSence.beforeNextSence, oldSence, [isBack, false], 'oldSence.beforeNextSence error: ');

        var ret = this._createSence(hashConf, resConf, resArr, options, isBack, aniType);

        // 更新statge状态
        this.activeSence = ret.sence;
        this.routeStack.push(ret.route);

        // 开启动画，在 old hide之后，destroy
        requestAnimationFrame(() => { _runAni(oldSence, ret.sence, isBack, this.defaultDOMCache, hashConf); });
    }

    _createSence(hashConf, resConf, resArr, options, isBack, aniType) {
        // 创建新的 sence root dom
        var senceRoot = createSenceRoot(this.id, hashConf.resID, aniType);
        senceRoot.appendTo(this.sencesEle);

        // 要考虑到有的sence，并没有对应的class，使用一个通用的common class
        // 创建新的 sence instance
        var SenceClass = Sence.getSence(resConf.className) || Sence.Sence;
        var route = new Route(hashConf, options.data, options, null, this.id);
        var newSence = new SenceClass(senceRoot, this.id, route);
        route.sence = newSence;

        resArr = util.safeRun(newSence.beforeInit, newSence, [resArr]) || resArr;  /// ???

        // 初始化新的 sence instance
        senceRoot.append(resArr.join(""));
        util.safeRun(newSence.init, newSence, [options.data, hashConf, resConf], 'sence init error: ');
        util.safeRun(newSence.beforeAnimation, newSence, [isBack, false], 'sence beforeAnimation error: ');

        return { sence: newSence, route: route };
    }


    // reload active sence
    reload() {

    }

    // 返回
    back(num, options) {
        var len = this.routeStack.length, route, index, currentRoute;
        if (len <= 1) return false;  // 至少保留一项
        num = num || 1;
        if (num > len - 1) {
            num = len - 1;
        }
        var dropArr = this.routeStack.splice(len - num);  // 这一段要丢弃的

        // 一路销毁
        dropArr.forEach((item) => {
            if (this.activeSence !== item.sence) {
                destroyOldRoute(item, null, 0, true);
            }
        });

        var oldSence = this.activeSence;
        // 要重新加载的 route 
        route = this.routeStack[this.routeStack.length - 1];
        if (route.sence && route.cached) { // resume
            route.cached = false;
            this.activeSence = r.sence;
            // 直接切换动画，不再启动加载流程
            _runAni(oldSence, route.sence, true, "forceClean", null);
        } else {
            // 启动加载流程，重新加载
            this.activeSence = null;
            this.routeStack.pop();
            aniHideSence(oldSence, true, () => {
                cleanOldSence(oldSence, "forceClean", true, null);
                this.loadSence(route.options, route.hashConf);
            });
        }
        return true;
    }

    // 重新加载 activeSence
    reload() {

    }

    backTo() {

    }

    // 开始监听事件，默认为开始
    start() {

    }

    // 停止监听事件
    stop() {

    }

    destroy() {
        this.off();
        try {
            // TODO 通知statge下所有的sence destroy
        } catch (e) {

        }
        this.rootEle.off().empty().remove();
        this.rootEle = this.sencesEle = this.routeStack = this.activeSence = null;
        StatgeManager.unRegister(this.id);
    }
}


// 动画结束的干活
function _runAni(oldSence, newSence, isBack, defaultDOMCache, hashConf) {
    // TODO 动画顺序如何配置，旧的动画结束了，新的才开始？
    if (oldSence) {
        aniHideSence(oldSence, isBack, () => {
            util.safeRun(oldSence.afterAnimation, oldSence, [isBack, true], "oldSence.afterAnimation");
            // util.safeRun(oldSence.destroy, oldSence, null, "oldSence.destroy");
            cleanOldSence(oldSence, defaultDOMCache, isBack, hashConf);
            aniShowSence(newSence, isBack);
        });
    } else {
        aniShowSence(newSence, isBack);
    }
}

function aniHideSence(oldSence, isBack, cb) {
    requestAnimationFrame(() => {
        util.safeRun(oldSence.beforeAnimation, oldSence, [isBack, true], "oldSence.beforeAnimation");
        showOut(oldSence.$root, cb);
    });
}
function aniShowSence(newSence, isBack) {
    requestAnimationFrame(() => {
        showIn(newSence.$root, () => {
            util.safeRun(newSence.afterAnimation, newSence, [isBack, false], "newSence.afterAnimation: ");
        });
    });
}

function showIn($dom, after) {
    return $dom.removeClass("sts-before")
        .addClass("sts-now")
        .one(ui.transitionEndEvent, after);
}

function showOut($dom, after) {
    return $dom.removeClass("sts-now")
        .addClass("sts-after")
        .one(ui.transitionEndEvent, after);
}


// 从 routeStack 中 移除
function destroyOldRoute(route, routeStack, index, isBack) {
    if (route.sence) {
        destroySence(oldSence);
    }
    route.sence = route.options = null;
    routeStack && routeStack.splice(index, 1);
}

function cleanOldSence(oldSence, defaultDOMCache, isBack, hashConf) {
    // hide
    oldSence.$root && oldSence.$root.hide();

    var domCache;
    if (defaultDOMCache === "forceClean") {
        domCache = false;
    } else {
        domCache = oldSence.shouldDOMCache(hashConf) || defaultDOMCache;
    }
    if (!isBack && domCache) {  // 缓存，不清理
        oldSence.$route.cached = true;
        util.safeRun(oldSence.pause, oldSence, null, "oldSence.pause: ");
        return;
    }

    destroySence(oldSence);
}

function destroySence(oldSence) {
    // destroy
    util.safeRun(oldSence.destroy, oldSence, null, "oldSence.destroy: ");
    if (oldSence.$route) oldSence.$route.sence = null;
    // clean
    if (oldSence.$root) {
        oldSence.$root.off().empty().remove();
        oldSence.$root = null;
    }
}


function createSenceRoot(statgeID, resID, aniType) {
    return $('<div class="st-sence sts-before"></div>')  // before show
        // .addClass("st-statge-" + statgeID)  // 打上 view id
        .addClass("sts-" + aniType)
        .addClass("st-id-" + resID)
        .attr("data-resID", resID);
}

export default Statge;