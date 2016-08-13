/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Loader = __webpack_require__(1);

	var _Loader2 = _interopRequireDefault(_Loader);

	var _Route = __webpack_require__(4);

	var _Route2 = _interopRequireDefault(_Route);

	var _Sence = __webpack_require__(5);

	var _Sence2 = _interopRequireDefault(_Sence);

	var _SenceConfManager = __webpack_require__(7);

	var _SenceConfManager2 = _interopRequireDefault(_SenceConfManager);

	var _observable = __webpack_require__(6);

	var _observable2 = _interopRequireDefault(_observable);

	var _Statge = __webpack_require__(8);

	var _Statge2 = _interopRequireDefault(_Statge);

	var _StatgeManager = __webpack_require__(9);

	var _StatgeManager2 = _interopRequireDefault(_StatgeManager);

	var _ui = __webpack_require__(3);

	var _ui2 = _interopRequireDefault(_ui);

	var _util = __webpack_require__(2);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var st = {
	    Loader: _Loader2.default,
	    Route: _Route2.default,
	    observable: _observable2.default,
	    Statge: _Statge2.default,
	    util: _util2.default
	};

	$.extend(st, _SenceConfManager2.default, _StatgeManager2.default, _ui2.default, _Sence2.default);

	window.st = st;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _util = __webpack_require__(2);

	var _util2 = _interopRequireDefault(_util);

	var _ui = __webpack_require__(3);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// ajax resource loader, base on jquery ajax api
	// include cache
	var CONF = {
	    timeout: 30000
	};

	// 当前页面的路径
	// var pagePath = (function () {
	//     var l = location;
	//     var file = l.origin + l.pathname;
	//     return file.substring(0, file.lastIndexOf("/"));
	// })();

	// function path2Url(path) {
	//     if (path.startsWith("http:") || path.startsWith("https:")) {
	//         return path;
	//     } else {
	//         return pagePath + path;
	//     }
	// }

	// 基于URL全路径的内存缓存？？
	var cache = {};
	function getCache(path) {
	    return cache[path];
	}
	function setCache(path, txt) {
	    cache[path] = txt;
	}

	// 基于jQuery，全局单列
	var loader = {
	    query: function query(path, succ, err, complete) {
	        var txt = getCache(path); /// check cache first
	        if (txt) {
	            var d = $.Deferred();
	            d.resolve([txt, "from cache"]);
	            succ && succ(txt);
	            return d.promise();
	        } else {
	            return $.ajax({
	                url: path,
	                timeout: CONF.timeout,
	                dataType: "text",
	                success: function success(txt) {
	                    setCache(path, txt);
	                    succ && succ;
	                },
	                error: err,
	                complete: complete
	            });
	        }
	    },
	    loadSenceRes: function loadSenceRes(senceConf, succ, err) {
	        var pathArr = [],
	            scriptArr = [];
	        // if(senceConf.css) pathArr.push(senceConf.css);
	        if (senceConf.html) pathArr.push(senceConf.html);
	        pathArr = _util2.default.arrFlat(pathArr);
	        if (senceConf.script) scriptArr = senceConf.script;

	        return this.loadUrls(pathArr, _util2.default.makeArr(scriptArr), succ, err);
	    },
	    loadUrls: function loadUrls(pathArr, scriptArr, succ, err) {
	        showLoading();
	        var arr = pathArr.map(function (path) {
	            return loader.query(path);
	        });
	        var jsArr = scriptArr.map(function (path) {
	            return loader.loadScript(path);
	        });

	        return $.when.apply($, arr.concat(jsArr)).then(function (xhrs) {
	            var retArr = [],
	                ret;
	            for (var i = 0; i < arguments.length; i++) {
	                ret = arguments[i];
	                $.isArray(ret) && retArr.push(ret[0]);
	            }
	            succ && succ.call(null, retArr);
	        }, err).then(hideLoading);
	    }
	    // 使用script标签加载，不保证执行先后顺序
	    ,
	    loadScript: function loadScript(path, succ, err) {
	        var d = $.Deferred();

	        var flag = getCache(path);
	        if (flag) {
	            d.resolve(true);
	            succ && succ(true);
	            return d.promise();
	        }

	        var script = document.createElement("script");
	        script.setAttribute("type", "text/javascript");

	        script.onload = function () {
	            this.onload = this.onerror = null;
	            d.resolve("script load done: " + path);
	            succ && succ();
	            setCache(path, true);
	        };
	        script.onerror = function () {
	            this.onerror = this.onerror = null;
	            d.reject("script load error: " + path);
	            err && err();
	        };
	        script.setAttribute("src", path);
	        document.head.appendChild(script);
	        return d.promise();
	    },
	    _getCache: function _getCache() {
	        return cache;
	    }
	};

	function showLoading() {
	    _ui2.default.showloading();
	}
	function hideLoading() {
	    _ui2.default.hideloading();
	}

	exports.default = loader;

/***/ },
/* 2 */
/***/ function(module, exports) {

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
	        ret.senceID = sencePath[1];
	        ret.statgeID = sencePath[0];
	    } else {
	        ret.senceID = sencePath[0];
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

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// manage route statck

	/**
	 * Route 一个路由对象，存放一个sence的相关信息
	 */

	var Route = function Route(hashConf, data, options, senceInstance, statgeID) {
	    _classCallCheck(this, Route);

	    this.hashConf = hashConf;
	    this.data = data;
	    this.options = options;
	    this.sence = senceInstance;
	    this.statgeID = statgeID;
	};

	exports.default = Route;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Sence = Sence;
	exports.extendSence = extendSence;
	exports.getSence = getSence;

	var _observable = __webpack_require__(6);

	var _observable2 = _interopRequireDefault(_observable);

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

	    // this.init.apply(this, arguments);
	}

	$.extend(Sence.prototype, {
	    // 新页面(必须带有data-page属性)插入到DOM的时候，在资源加载进去之前会触发

	    beforeInit: function beforeInit(resArr) {
	        return resArr;
	    },
	    // 给一个修改的机会？？
	    beforeNextSence: function beforeNextSence() {},
	    // 在下一个场景实例创建之前执行

	    // 类初始化时调用，在动画之前
	    init: function init(route) {},


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


	    // 移除动画
	    beforeRemove: function beforeRemove() {},


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

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * 基于riot 2.3.0 修改而来，无任何依赖
	 * 给任意一个对象，添加注册/触发事件的能力
	 */
	function observable(el) {
	    /**
	     * Extend the original object or create a new empty one
	     * @type { Object }
	     */

	    el = el || {};

	    /**
	     * Private variables and methods
	     */

	    var callbacks = {},
	        onEachEvent = function onEachEvent(e, fn) {
	        e.replace(/\S+/g, fn);
	    },
	        defineProperty = function defineProperty(key, value) {
	        Object.defineProperty(el, key, {
	            value: value,
	            enumerable: false,
	            writable: false,
	            configurable: false
	        });
	    };

	    /**
	     * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
	     * @param  { String } events - events ids
	     * @param  { Function } fn - callback function
	     * @returns { Object } el
	     */

	    defineProperty('on', function (events, fn) {
	        if (typeof fn != 'function') return el;

	        onEachEvent(events, function (name, pos) {
	            (callbacks[name] = callbacks[name] || []).push(fn);
	            fn.typed = pos > 0;
	        });

	        return el;
	    });

	    /**
	     * Removes the given space separated list of `events` listeners
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */

	    defineProperty('off', function (events, fn) {
	        if (events == '*' || events == null) callbacks = {};else {
	            onEachEvent(events, function (name) {
	                if (fn) {
	                    var arr = callbacks[name];
	                    for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	                        if (cb == fn) arr.splice(i--, 1);
	                    }
	                } else delete callbacks[name];
	            });
	        }
	        return el;
	    });

	    /**
	     * Listen to the given space separated list of `events` and execute the `callback` at most once
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */

	    defineProperty('one', function (events, fn) {
	        function on() {
	            el.off(events, on);

	            // V8 performance optimization
	            // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
	            var arglen = arguments.length;
	            var args = new Array(arglen);
	            for (var i = 0; i < arglen; i++) {
	                args[i] = arguments[i];
	            }

	            fn.apply(el, args);
	        }
	        return el.on(events, on);
	    });

	    /**
	     * Execute all callback functions that listen to the given space separated list of `events`
	     * @param   { String } events - events ids
	     * @returns { Object } el
	     */

	    defineProperty('trigger', function (events) {
	        // V8 performance optimization
	        // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
	        var arglen = arguments.length - 1;
	        var args = new Array(arglen);
	        for (var i = 0; i < arglen; i++) {
	            args[i] = arguments[i + 1]; // skip first argument
	        }

	        onEachEvent(events, function (name) {

	            var fns = (callbacks[name] || []).slice(0);

	            for (var i = 0, fn; fn = fns[i]; ++i) {
	                if (fn.busy) return;
	                fn.busy = 1;

	                try {
	                    fn.apply(el, fn.typed ? [name].concat(args) : args);
	                } catch (e) {
	                    console.error(e); /* error */
	                    console.log(arguments);
	                }
	                if (fns[i] !== fn) {
	                    i--;
	                }
	                fn.busy = 0;
	            }

	            if (callbacks.all && name != 'all') el.trigger.apply(el, ['all', name].concat(args));
	        });

	        return el;
	    });

	    // +++++++++++ 添加
	    // 异步触发事件
	    defineProperty('triggerAsync', function (events) {
	        var args = arguments,
	            self = this;
	        setTimeout(function () {
	            self.trigger.apply(self, args);
	        }, 0);
	    });

	    defineProperty("hasEvent", function (event) {
	        return event in callbacks;
	    });

	    return el;
	}

	exports.default = observable;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.addSenceConf = addSenceConf;
	exports.getSenceConf = getSenceConf;
	/// 管理每个sence的资源配置

	// Interface
	// SenceConf {
	//     senceId: string;   /// sence资源id
	//     className: string; /// sence class name
	//     script?: string | string[];
	//     html?: string | string[];
	//     htmlContent: string; 
	//     css?: string;  // TODO ,先不支持 不推荐，建议style写到html里面去
	// }

	// 存放所有的资源配置
	var senceConfMap = {}; /// string --> SenceConf
	/**
	 * @param  pc : sence config or sence config map
	 */
	function addSenceConf(pc) {
	    // not check duplicate
	    if (typeof pc.senceId === "string") {
	        senceConfMap[pc.senceId] = pc;
	    } else {
	        $.extend(senceConfMap, pc); // sence config map
	    }
	}

	function getSenceConf(senceId) {
	    return senceConfMap[senceId];
	}

	exports.default = $.extend({}, exports); // 导出默认 模块。。。

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // 舞台类, 就是一块div的 单页面 的管理类，
	// 一个 statge 可以看做是一个带router功能的 sence manager
	// 一个舞台可一切换不同的场景，但是最多只有一个场景在前台
	//
	// 除了管 sence 切换，其他的ui相关内容一律不管

	var _Route = __webpack_require__(4);

	var _Route2 = _interopRequireDefault(_Route);

	var _SenceConfManager = __webpack_require__(7);

	var _SenceConfManager2 = _interopRequireDefault(_SenceConfManager);

	var _util = __webpack_require__(2);

	var _util2 = _interopRequireDefault(_util);

	var _observable = __webpack_require__(6);

	var _observable2 = _interopRequireDefault(_observable);

	var _Loader = __webpack_require__(1);

	var _Loader2 = _interopRequireDefault(_Loader);

	var _Sence = __webpack_require__(5);

	var _Sence2 = _interopRequireDefault(_Sence);

	var _StatgeManager = __webpack_require__(9);

	var _StatgeManager2 = _interopRequireDefault(_StatgeManager);

	var _ui = __webpack_require__(3);

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
	        if (this.rootEle.length !== 1) {
	            console.log("not a valid root ele for statge", rootEle);
	            return null;
	        }
	        this.runFlag = true;
	        this.id = this.conf.name || this.rootEle.attr("id") || _util2.default.uniqID("st_statge_");

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
	                this.loadSence(options, hashConf, true);
	            } else {
	                console.warn("no sence found: " + senceID);
	            }
	        }
	    }, {
	        key: 'loadSence',
	        value: function loadSence(options, hashConf, slientChangeFlag) {
	            var _this = this;

	            hashConf = hashConf || _util2.default.parseHash(location.hash);
	            if (!hashConf.isSence) return;

	            var senceConf = _SenceConfManager2.default.getSenceConf(hashConf.senceID);
	            if (!senceConf) {
	                return console.warn("no sence found: " + hashConf.senceID);
	            }

	            // TODO senceID 和 当前route 查重对比
	            if (slientChangeFlag) {
	                if (hashConf.hash) _StatgeManager2.default.slientChangeHash(hashConf.hash);else _StatgeManager2.default.slientChangeHash("!" + (hashConf.statgeID || this.id) + "/" + hashConf.senceID);
	            }
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
	            oldSence && _util2.default.safeRun(oldSence.beforeNextSence, newSence, [isBack, false], 'sence beforeNextSence error: ');
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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.slientChangeHash = slientChangeHash;
	exports.addStatge = addStatge;
	exports.getStatge = getStatge;
	exports.removeStatge = removeStatge;
	exports.unRegister = unRegister;
	exports.getStatgeMap = getStatgeMap;
	exports.setMainStatge = setMainStatge;
	exports.start = start;
	exports.stop = stop;

	var _util = __webpack_require__(2);

	var _util2 = _interopRequireDefault(_util);

	var _SenceConfManager = __webpack_require__(7);

	var _SenceConfManager2 = _interopRequireDefault(_SenceConfManager);

	var _Statge = __webpack_require__(8);

	var _Statge2 = _interopRequireDefault(_Statge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/// 单例模式

	// hash 监听
	var listenFlag = false;

	function slientChangeHash(hashStr) {
	    hashStr = hashStr || "#";
	    if (listenFlag) {
	        if (hashStr.charAt(0) !== "#") hashStr = "#" + hashStr;
	        if (hashStr !== location.hash) {
	            _ignoreTimes++;
	        }
	    }
	    location.hash = hashStr;
	}

	var _ignoreTimes = 0;
	function shouldIgnore() {
	    if (_ignoreTimes > 0) {
	        _ignoreTimes--;
	        return true;
	    } else if (_ignoreTimes < 0) {
	        _ignoreTimes = 0;
	    }
	    return false;
	}
	$(window).on("hashchange", function () {
	    if (!listenFlag) return;
	    if (shouldIgnore()) return;

	    var hashConf = _util2.default.parseHash(location.hash);
	    if (hashConf.isSence) {
	        dispatchHashConf(hashConf);
	    }
	});

	var statgeMap = {};
	var mainStatgeID = ""; // 只有一个main statge 即default statge
	var statgeCounter = 0;
	function addStatge(rootEle, conf) {
	    var statge = new _Statge2.default(rootEle, conf); // 创建

	    var id = statge.id;
	    if (statgeMap[id]) {
	        return console.error("duplicate statge id: " + id);
	    }
	    statgeMap[id] = statge;
	    statgeCounter++;

	    if (statgeCounter === 1 || statge.isMain) {
	        /// 默认第一个为 main statge
	        setMainStatge(statge);
	    }

	    return statge;
	}

	function getStatge(statgeID) {
	    return statgeMap[statgeID];
	}

	function removeStatge(statge) {
	    if (typeof statge === 'string') {
	        statge = getStatge(statge);
	    }
	    unRegister(statge.id);
	    statge && statge.destroy();
	}

	function unRegister(statgeID) {
	    var st = getStatge(statgeID);
	    if (st) {
	        delete statgeMap[st.id];
	        statgeCounter--;
	    }

	    // if(statge.isMain){
	    //     // TODO
	    // }
	}

	function getStatgeMap() {
	    return statgeMap;
	}

	function setMainStatge(statge) {
	    mainStatgeID = statge.id;
	}

	function dispatchHashConf(hashConf) {
	    var statgeID = hashConf.statgeID || mainStatgeID;
	    var statge = statgeMap[statgeID];
	    if (!statge) {
	        return console.warn("no statge found: " + statgeID);
	    }

	    statge.loadSence(null, hashConf);
	}

	function start() {
	    listenFlag = true;
	}

	function stop() {
	    listenFlag = false;
	}

	exports.default = $.extend({}, exports);

/***/ }
/******/ ]);