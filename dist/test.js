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

	var _loader = __webpack_require__(11);

	var _loader2 = _interopRequireDefault(_loader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.st = {
	    loader: _loader2.default
	};

/***/ },
/* 1 */,
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
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
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

/***/ }
/******/ ]);