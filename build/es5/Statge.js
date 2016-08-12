'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // 舞台类, 就是一块div的 单页面 的管理类，
// 一个 statge 可以看做是一个带router功能的 sence manager
// 一个舞台可一切换不同的场景，但是最多只有一个场景在前台
//
// 除了管 sence 切换，其他的ui相关内容一律不管

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

var _SenceConfManager = require('./SenceConfManager');

var _SenceConfManager2 = _interopRequireDefault(_SenceConfManager);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _observable = require('./observable');

var _observable2 = _interopRequireDefault(_observable);

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _Sence = require('./Sence');

var _Sence2 = _interopRequireDefault(_Sence);

var _StatgeManager = require('./StatgeManager');

var _StatgeManager2 = _interopRequireDefault(_StatgeManager);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConf = {
    name: null,
    mainFlag: false,
    aniType: "fade"
};

// 一个statge的页面切换，只能有一种动画？？
// 暂时只考虑有一种动画的情况吧，fade

var Statge = function () {
    function Statge(rootEle, conf) {
        _classCallCheck(this, Statge);

        //  statgeName, mainFlag
        this.conf = $.extend({}, conf, defaultConf);
        (0, _observable2.default)(this);

        // route 对象的栈
        this.routeStack = [];
        this.rootEle = $(rootEle);
        this.runFlag = true;
        this.id = this.conf.name || _util2.default.uniqID("st_statge_");

        this.isMain = !!this.conf.mainFlag;
        this.activeSence = null;

        this.aniType = this.conf.aniType;

        if (this.rootEle.length === 0) {
            console.warn("no element found for Statge");
        }

        this.init();
    }

    _createClass(Statge, [{
        key: 'init',
        value: function init() {
            this._initDomFrm();
            this._initEvent();
        }

        // 初始化dom框架

    }, {
        key: '_initDomFrm',
        value: function _initDomFrm() {
            this.rootEle.addClass("st-statge " + this.id).attr("data-statgeid", this.id);
            this.isMain && this.rootEle.addClass("st-statge-main");
            this.rootEle.append("<div class='st-sences'></div>");
            this.sencesEle = this.rootEle.children(".st-sences");
        }
    }, {
        key: '_initEvent',
        value: function _initEvent() {
            /// 拦截a标签的点击。。
            this.rootEle.on("click", "a", this._listenLink.bind(this));
        }
    }, {
        key: '_listenLink',
        value: function _listenLink(e) {
            if (!this.runFlag) return;

            var jt = $(e.target),
                href = jt.attr("href"),
                conf = _util2.default.parseHash(href);
            if (conf.isSence && !conf.senceID) {
                // 吃掉事件
                e.stopPropogation();
                e.preventDefault();
                conf.senceID = this.id;
            }
        }
    }, {
        key: 'loadSenceById',
        value: function loadSenceById(senceID, options) {
            // 是否需要触发hashchange ?
            var res = _SenceConfManager2.default.getSenceConf(senceID);
            if (res) {
                var hashConf = {
                    isSence: true,
                    senceID: senceID,
                    statgeID: this.id
                };
                this.loadSence(options, hashConf);
            } else {
                console.warn("no sence found: " + senceID);
            }
        }
    }, {
        key: 'loadSence',
        value: function loadSence(options, hashConf) {
            var _this = this;

            hashConf = hashConf || _util2.default.parseHash(location.hash);
            if (!hashConf.isSence) return;

            var senceConf = _SenceConfManager2.default.getSenceConf(hashConf.senceID);
            if (!senceConf) {
                return console.warn("no sence found: " + hashConf.senceID);
            }

            // TODO senceID 和 当前route 查重对比
            /// begin
            var promise = _Loader2.default.loadSenceRes(senceConf, function (resArr) {
                // start change sence
                _this._changeSecne(hashConf, senceConf, resArr, options);
            }, function () {
                /// TODO alert load error
                console.error("load sence resource error: " + hashConf.senceID);
            });
        }
    }, {
        key: '_changeSecne',
        value: function _changeSecne(hashConf, senceConf, resArr, options, isBack) {
            var oldSence = this.activeSence;
            options = options || {};
            var aniType = options.aniType || "fade";

            // 创建新的 sence root dom
            var senceRoot = createSenceRoot(this.id, hashConf.senceID, aniType);
            senceRoot.appendTo(this.sencesEle);

            // 要考虑到有的sence，并没有对应的class，使用一个通用的common class？？
            // 创建新的 sence instance
            var SenceClass = _Sence2.default.getSence(senceConf.className) || _Sence2.default.Sence;
            var newSence = new SenceClass(senceRoot, this.id, route);
            var route = new _Route2.default(hashConf, options.data, options, newSence, this.id);

            resArr = _util2.default.safeRun(newSence.beforeInit, newSence, [resArr]) || resArr; /// ???

            // 初始化新的 sence instance
            senceRoot.append(resArr.join(""));
            _util2.default.safeRun(newSence.init, newSence, [hashConf, options.data, senceConf], 'sence init error: ');
            _util2.default.safeRun(newSence.beforeAnimation, newSence, [isBack, false], 'sence beforeAnimation error: ');

            // 更新状态
            this.activeSence = newSence;
            this.routeStack.push(route);

            // 开启动画
            this._runAni(oldSence, newSence, isBack);
        }
    }, {
        key: '_runAni',
        value: function _runAni(oldSence, newSence, isBack) {
            // TODO 动画顺序如何配置，旧的动画结束了，新的才开始？
            if (oldSence) {
                _util2.default.safeRun(oldSence.beforeAnimation, oldSence, [isBack, true], "oldSence.beforeAnimation");
                showOut(oldSence.$root, function () {
                    _util2.default.safeRun(oldSence.afterAnimation, oldSence, [isBack, true], "oldSence.afterAnimation");
                    // util.safeRun(oldSence.destroy, oldSence, null, "oldSence.destroy");
                    destroyOldSence(oldSence);
                    showNewSence(newSence, isBack);
                });
            } else {
                showNewSence(newSence, isBack);
            }
        }

        // 返回

    }, {
        key: 'back',
        value: function back(index, options) {}

        // 开始监听事件，默认为开始

    }, {
        key: 'start',
        value: function start() {}

        // 停止监听事件

    }, {
        key: 'stop',
        value: function stop() {}
    }, {
        key: 'destroy',
        value: function destroy() {
            this.off();
            this.rootEle.off().empty().remove();
            try {
                // TODO 通知所有的statge下sence destroy
            } catch (e) {}
            this.rootEle = this.sencesEle = this.routeStack = this.activeSence = null;
            _StatgeManager2.default.unRegister(this.id);
        }
    }]);

    return Statge;
}();

function showIn($dom, after) {
    return $dom.removeClass("sts-before").addClass("sts-now").one(_ui2.default.transitionEndEvent, after);
}

function showOut($dom, after) {
    return $dom.removeClass("sts-now").addClass("sts-after").one(_ui2.default.transitionEndEvent, after);
}

function showNewSence(newSence, isBack) {
    showIn(newSence.$root, function () {
        _util2.default.safeRun(newSence.afterAnimation, newSence, [isBack, false], "newSence.afterAnimation: ");
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
    return $('<div class="st-sence sts-before"></div>') // before show
    // .addClass("st-statge-" + statgeID)  // 打上 view id
    .addClass("sts-" + aniType).addClass("st-id-" + senceID).attr("data-senceid", senceID);
}

exports.default = Statge;