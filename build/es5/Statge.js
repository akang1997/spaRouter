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

var _ResManager = require('./ResManager');

var _ResManager2 = _interopRequireDefault(_ResManager);

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
    id: null, // statge 的 id
    mainFlag: false, // 是否是主statge
    aniType: "fade", // 动画类型
    uniqueHistory: true, // 是否允许一个statge中，加载多个同样的sence
    defaultDOMCache: false // 默认是否开启 dom cache
};

// 一个statge的页面切换，只能有一种动画？？
// 暂时只考虑有一种动画的情况吧，fade

var Statge = function () {
    function Statge(rootEle, conf) {
        _classCallCheck(this, Statge);

        this.conf = $.extend({}, defaultConf, conf);
        (0, _observable2.default)(this);

        // route 对象的栈
        this.routeStack = [];
        this.rootEle = $(rootEle);
        if (this.rootEle.length !== 1) {
            console.log("not a valid root ele for statge", rootEle);
            return null;
        }
        this.runFlag = true;
        this.id = this.conf.id || this.rootEle.attr("id") || _util2.default.uniqID("st_statge_");

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
            if (conf.isSence && !conf.statgeID) {
                // 吃掉事件
                e.stopPropogation();
                e.preventDefault();
                conf.statgeID = this.id;
            }
        }
    }, {
        key: 'loadSenceById',
        value: function loadSenceById(resID, options) {
            // 是否需要触发hashchange ?
            var res = _ResManager2.default.getResConf(resID);
            if (res) {
                var hashConf = {
                    isSence: true,
                    resID: resID,
                    statgeID: this.id
                };
                this.loadSence(options, hashConf, true);
            } else {
                console.warn("no sence found: " + resID);
            }
        }
    }, {
        key: 'loadSence',
        value: function loadSence(options, hashConf, slientChangeFlag) {
            var _this = this;

            hashConf = hashConf || _util2.default.parseHash(location.hash);
            if (!hashConf.isSence) return;

            var resConf = _ResManager2.default.getResConf(hashConf.resID);
            if (!resConf) {
                return console.warn("no sence found: " + hashConf.resID);
            }

            // TODO resID 和 当前route 查重对比
            if (slientChangeFlag) {
                if (hashConf.hash) _StatgeManager2.default.slientChangeHash(hashConf.hash);else _StatgeManager2.default.slientChangeHash("!" + (hashConf.statgeID || this.id) + "/" + hashConf.resID);
            }
            /// begin
            var promise = _Loader2.default.loadSenceRes(resConf, function (resArr) {
                // start change sence
                _this._changeSecne(hashConf, resConf, resArr, options);
            }, function () {
                /// TODO alert load error
                console.error("load sence resource error: " + hashConf.resID);
            });
        }
    }, {
        key: '_checkSenceDuplicate',
        value: function _checkSenceDuplicate() {}
    }, {
        key: '_changeSecne',
        value: function _changeSecne(hashConf, resConf, resArr, options, isBack) {
            var _this2 = this;

            options = options || {};
            var oldSence = this.activeSence,
                defaultDOMCache = this.defaultDOMCache,
                aniType = options.aniType || "fade";

            oldSence && _util2.default.safeRun(oldSence.beforeNextSence, oldSence, [isBack, false], 'oldSence.beforeNextSence error: ');

            var ret = this._createSence(hashConf, resConf, resArr, options, isBack, aniType);

            // 更新statge状态
            this.activeSence = ret.sence;
            this.routeStack.push(ret.route);

            // 开启动画，在 old hide之后，destroy
            requestAnimationFrame(function () {
                _runAni(oldSence, ret.sence, isBack, _this2.defaultDOMCache, hashConf);
            });
        }
    }, {
        key: '_createSence',
        value: function _createSence(hashConf, resConf, resArr, options, isBack, aniType) {
            // 创建新的 sence root dom
            var senceRoot = createSenceRoot(this.id, hashConf.resID, aniType);
            senceRoot.appendTo(this.sencesEle);

            // 要考虑到有的sence，并没有对应的class，使用一个通用的common class
            // 创建新的 sence instance
            var SenceClass = _Sence2.default.getSence(resConf.className) || _Sence2.default.Sence;
            var route = new _Route2.default(hashConf, options.data, options, null, this.id);
            var newSence = new SenceClass(senceRoot, this.id, route);
            route.sence = newSence;

            resArr = _util2.default.safeRun(newSence.beforeInit, newSence, [resArr]) || resArr; /// ???

            // 初始化新的 sence instance
            senceRoot.append(resArr.join(""));
            _util2.default.safeRun(newSence.init, newSence, [options.data, hashConf, resConf], 'sence init error: ');
            _util2.default.safeRun(newSence.beforeAnimation, newSence, [isBack, false], 'sence beforeAnimation error: ');

            return { sence: newSence, route: route };
        }

        // reload active sence

    }, {
        key: 'reload',
        value: function reload() {}

        // 返回

    }, {
        key: 'back',
        value: function back(num, options) {
            var _this3 = this;

            var len = this.routeStack.length,
                route,
                index,
                currentRoute;
            if (len <= 1) return false; // 至少保留一项
            num = num || 1;
            if (num > len - 1) {
                num = len - 1;
            }
            var dropArr = this.routeStack.splice(len - num); // 这一段要丢弃的

            // 一路销毁
            dropArr.forEach(function (item) {
                if (_this3.activeSence !== item.sence) {
                    destroyOldRoute(item, null, 0, true);
                }
            });

            var oldSence = this.activeSence;
            // 要重新加载的 route
            route = this.routeStack[this.routeStack.length - 1];
            if (route.sence && route.cached) {
                // resume
                route.cached = false;
                this.activeSence = r.sence;
                // 直接切换动画，不再启动加载流程
                _runAni(oldSence, route.sence, true, "forceClean", null);
            } else {
                // 启动加载流程，重新加载
                this.activeSence = null;
                this.routeStack.pop();
                aniHideSence(oldSence, true, function () {
                    cleanOldSence(oldSence, "forceClean", true, null);
                    _this3.loadSence(route.options, route.hashConf);
                });
            }
            return true;
        }

        // 重新加载 activeSence

    }, {
        key: 'reload',
        value: function reload() {}
    }, {
        key: 'backTo',
        value: function backTo() {}

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
            try {
                // TODO 通知statge下所有的sence destroy
            } catch (e) {}
            this.rootEle.off().empty().remove();
            this.rootEle = this.sencesEle = this.routeStack = this.activeSence = null;
            _StatgeManager2.default.unRegister(this.id);
        }
    }]);

    return Statge;
}();

// 动画结束的干活


function _runAni(oldSence, newSence, isBack, defaultDOMCache, hashConf) {
    // TODO 动画顺序如何配置，旧的动画结束了，新的才开始？
    if (oldSence) {
        aniHideSence(oldSence, isBack, function () {
            _util2.default.safeRun(oldSence.afterAnimation, oldSence, [isBack, true], "oldSence.afterAnimation");
            // util.safeRun(oldSence.destroy, oldSence, null, "oldSence.destroy");
            cleanOldSence(oldSence, defaultDOMCache, isBack, hashConf);
            aniShowSence(newSence, isBack);
        });
    } else {
        aniShowSence(newSence, isBack);
    }
}

function aniHideSence(oldSence, isBack, cb) {
    requestAnimationFrame(function () {
        _util2.default.safeRun(oldSence.beforeAnimation, oldSence, [isBack, true], "oldSence.beforeAnimation");
        showOut(oldSence.$root, cb);
    });
}
function aniShowSence(newSence, isBack) {
    requestAnimationFrame(function () {
        showIn(newSence.$root, function () {
            _util2.default.safeRun(newSence.afterAnimation, newSence, [isBack, false], "newSence.afterAnimation: ");
        });
    });
}

function showIn($dom, after) {
    return $dom.removeClass("sts-before").addClass("sts-now").one(_ui2.default.transitionEndEvent, after);
}

function showOut($dom, after) {
    return $dom.removeClass("sts-now").addClass("sts-after").one(_ui2.default.transitionEndEvent, after);
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
    if (!isBack && domCache) {
        // 缓存，不清理
        oldSence.$route.cached = true;
        _util2.default.safeRun(oldSence.pause, oldSence, null, "oldSence.pause: ");
        return;
    }

    destroySence(oldSence);
}

function destroySence(oldSence) {
    // destroy
    _util2.default.safeRun(oldSence.destroy, oldSence, null, "oldSence.destroy: ");
    if (oldSence.$route) oldSence.$route.sence = null;
    // clean
    if (oldSence.$root) {
        oldSence.$root.off().empty().remove();
        oldSence.$root = null;
    }
}

function createSenceRoot(statgeID, resID, aniType) {
    return $('<div class="st-sence sts-before"></div>') // before show
    // .addClass("st-statge-" + statgeID)  // 打上 view id
    .addClass("sts-" + aniType).addClass("st-id-" + resID).attr("data-resID", resID);
}

exports.default = Statge;