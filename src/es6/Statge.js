// 舞台类, 就是一块div的 单页面 的管理类，
// 一个 statge 可以看做是一个带router功能的 sence manager
// 一个舞台可一切换不同的场景，但是最多只有一个场景在前台
// 
// 除了管 sence 切换，其他的ui相关内容一律不管

import Route from './Route'
import SenceConfManager from './SenceConfManager'
import util from './util'
import observable from './observable'
import Loader from './Loader'
import Sence from './Sence'
import StatgeManager from './StatgeManager'
import ui from './ui'

var defaultConf = {
    name: null,
    mainFlag: false,
    aniType: "fade",
}

// 一个statge的页面切换，只能有一种动画？？
// 暂时只考虑有一种动画的情况吧，fade
class Statge {

    constructor(rootEle, conf) {  //  statgeName, mainFlag
        this.conf = $.extend({}, conf, defaultConf);
        observable(this);

        // route 对象的栈
        this.routeStack = [];
        this.rootEle = $(rootEle);
        this.runFlag = true;
        this.id = this.conf.name || util.uniqID("st_statge_");

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
        if (conf.isSence && !conf.senceID) {
            // 吃掉事件
            e.stopPropogation();
            e.preventDefault();
            conf.senceID = this.id;
        }
    }

    loadSenceById(senceID, options) {  // 是否需要触发hashchange ?
        var res = SenceConfManager.getSenceConf(senceID);
        if (res) {
            var hashConf = {
                isSence: true
                , senceID: senceID
                , statgeID: this.id
            }
            this.loadSence(options, hashConf);
        } else {
            console.warn("no sence found: " + senceID);
        }
    }

    loadSence(options, hashConf) {
        hashConf = hashConf || util.parseHash(location.hash);
        if (!hashConf.isSence) return;

        var senceConf = SenceConfManager.getSenceConf(hashConf.senceID);
        if (!senceConf) {
            return console.warn("no sence found: " + hashConf.senceID);
        }

        // TODO senceID 和 当前route 查重对比
        /// begin
        var promise = Loader.loadSenceRes(senceConf, (resArr) => {
            // start change sence
            this._changeSecne(hashConf, senceConf, resArr, options);
        }, () => {
            /// TODO alert load error
            console.error("load sence resource error: " + hashConf.senceID);
        });
    }

    _changeSecne(hashConf, senceConf, resArr, options, isBack) {
        var oldSence = this.activeSence;
        options = options || {};
        var aniType = options.aniType || "fade";

        // 创建新的 sence root dom
        var senceRoot = createSenceRoot(this.id, hashConf.senceID, aniType);
        senceRoot.appendTo(this.sencesEle);

        // 要考虑到有的sence，并没有对应的class，使用一个通用的common class？？
        // 创建新的 sence instance
        var SenceClass = Sence.getSence(senceConf.className) || Sence.Sence;
        var newSence = new SenceClass(senceRoot, this.id, route);
        var route = new Route(hashConf, options.data, options, newSence, this.id);

        resArr = util.safeRun(newSence.beforeInit, newSence, [resArr]) || resArr;  /// ???

        // 初始化新的 sence instance
        senceRoot.append(resArr.join(""));
        util.safeRun(newSence.init, newSence, [hashConf, options.data, senceConf], 'sence init error: ');
        util.safeRun(newSence.beforeAnimation, newSence, [isBack, false], 'sence beforeAnimation error: ');

        // 更新状态
        this.activeSence = newSence;
        this.routeStack.push(route);

        // 开启动画
        this._runAni(oldSence, newSence, isBack);
    }


    _runAni(oldSence, newSence, isBack) {
        // TODO 动画顺序如何配置，旧的动画结束了，新的才开始？
        if (oldSence) {
            util.safeRun(oldSence.beforeAnimation, oldSence, [isBack, true], "oldSence.beforeAnimation");
            showOut(oldSence.$root, () => {
                util.safeRun(oldSence.afterAnimation, oldSence, [isBack, true], "oldSence.afterAnimation");
                // util.safeRun(oldSence.destroy, oldSence, null, "oldSence.destroy");
                destroyOldSence(oldSence);
                showNewSence(newSence, isBack);
            });
        } else {
            showNewSence(newSence, isBack);
        }
    }


    // 返回
    back(index, options) {

    }

    // 开始监听事件，默认为开始
    start() {

    }

    // 停止监听事件
    stop() {

    }

    destroy() {
        this.off();
        this.rootEle.off().empty().remove();
        try {
            // TODO 通知所有的statge下sence destroy
        } catch (e) {

        }
        this.rootEle = this.sencesEle = this.routeStack = this.activeSence = null;
        StatgeManager.unRegister(this.id);
    }
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

function showNewSence(newSence, isBack) {
    showIn(newSence.$root, () => {
        util.safeRun(newSence.afterAnimation, newSence, [isBack, false], "newSence.afterAnimation: ");
    });
}


function destroyOldSence(oldSence) {
    try {
        // hide
        oldSence.$root.hide();
        // destroy
        oldSence.destroy();
        if (oldSence.$root) {
            oldSence.$root.off().empty().remove();
            oldSence.$root = null;
        }
    } catch (e) {
        console.warn("error when destroy old sence: ", e);
    }
}


function createSenceRoot(statgeID, senceID, aniType) {
    return $('<div class="st-sence sts-before"></div>')  // before show
        // .addClass("st-statge-" + statgeID)  // 打上 view id
        .addClass("sts-" + aniType)
        .addClass("st-id-" + senceID)
        .attr("data-senceid", senceID);
}

export default Statge;