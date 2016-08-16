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

	var _Route = __webpack_require__(5);

	var _Route2 = _interopRequireDefault(_Route);

	var _Sence = __webpack_require__(6);

	var _Sence2 = _interopRequireDefault(_Sence);

	var _ResManager = __webpack_require__(8);

	var _ResManager2 = _interopRequireDefault(_ResManager);

	var _observable = __webpack_require__(7);

	var _observable2 = _interopRequireDefault(_observable);

	var _Statge = __webpack_require__(9);

	var _Statge2 = _interopRequireDefault(_Statge);

	var _StatgeManager = __webpack_require__(10);

	var _StatgeManager2 = _interopRequireDefault(_StatgeManager);

	var _ui = __webpack_require__(4);

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

	$.extend(st, _ResManager2.default, _StatgeManager2.default, _ui2.default, _Sence2.default);

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

	var _ui = __webpack_require__(4);

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
	    loadSenceRes: function loadSenceRes(senceResConf, succ, err) {
	        var pathArr = [],
	            scriptArr = [];
	        // if(senceResConf.css) pathArr.push(senceResConf.css);
	        if (senceResConf.html) pathArr.push(senceResConf.html);
	        pathArr = _util2.default.arrFlat(pathArr);
	        if (senceResConf.script) scriptArr = senceResConf.script;

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
/***/ function(module, exports, __webpack_require__) {

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

	var _requestAnimationFrame = __webpack_require__(3);

	var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	        ret.resID = sencePath[1];
	        ret.statgeID = sencePath[0];
	    } else {
	        ret.resID = sencePath[0];
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
	(function (global) {
	    if (global.requestAnimationFrame) {
	        return;
	    }

	    if (global.webkitRequestAnimationFrame) {
	        // Chrome <= 23, Safari <= 6.1, Blackberry 10
	        global.requestAnimationFrame = global['webkitRequestAnimationFrame'];
	        global.cancelAnimationFrame = global['webkitCancelAnimationFrame'] || global['webkitCancelRequestAnimationFrame'];
	        return;
	    }

	    // IE <= 9, Android <= 4.3, very old/rare browsers
	    global.requestAnimationFrame = function (callback) {
	        return global.setTimeout(callback, 0);
	    };

	    global.cancelAnimationFrame = function (id) {
	        clearTimeout(id);
	    };
	})(window);

	exports.default = 1;

/***/ },
/* 4 */
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
/* 5 */
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
	    this.cached = false;
	};

	exports.default = Route;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Sence = Sence;
	exports.extendSence = extendSence;
	exports.getSence = getSence;

	var _observable = __webpack_require__(7);

	var _observable2 = _interopRequireDefault(_observable);

	var _util = __webpack_require__(2);

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

/***/ },
/* 7 */
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
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.addResConf = addResConf;
	exports.getResConf = getResConf;
	/// 管理每个sence的资源配置

	// Interface
	// SenceConf {
	//     resID: string;   /// sence资源id
	//     className: string; /// sence class name
	//     script?: string | string[];
	//     html?: string | string[];
	//     htmlContent: string; 
	//     css?: string;  // TODO ,先不支持 不推荐，建议style写到html里面去
	// }

	// 存放所有的资源配置
	var resConfMap = {}; /// string --> SenceConf
	/**
	 * @param  pc : sence config or sence config map
	 */
	function addResConf(pc) {
	    // not check duplicate
	    if (typeof pc.resId === "string") {
	        resConfMap[pc.resId] = pc;
	    } else {
	        $.extend(resConfMap, pc); // sence config map
	    }
	}

	function getResConf(resId) {
	    return resConfMap[resId];
	}

	exports.default = $.extend({}, exports); // 导出默认 模块。。。

/***/ },
/* 9 */
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

	var _Route = __webpack_require__(5);

	var _Route2 = _interopRequireDefault(_Route);

	var _ResManager = __webpack_require__(8);

	var _ResManager2 = _interopRequireDefault(_ResManager);

	var _util = __webpack_require__(2);

	var _util2 = _interopRequireDefault(_util);

	var _observable = __webpack_require__(7);

	var _observable2 = _interopRequireDefault(_observable);

	var _Loader = __webpack_require__(1);

	var _Loader2 = _interopRequireDefault(_Loader);

	var _Sence = __webpack_require__(6);

	var _Sence2 = _interopRequireDefault(_Sence);

	var _StatgeManager = __webpack_require__(10);

	var _StatgeManager2 = _interopRequireDefault(_StatgeManager);

	var _ui = __webpack_require__(4);

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

/***/ },
/* 10 */
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

	var _ResManager = __webpack_require__(8);

	var _ResManager2 = _interopRequireDefault(_ResManager);

	var _Statge = __webpack_require__(9);

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