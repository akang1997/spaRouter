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

	var _loader = __webpack_require__(1);

	var _loader2 = _interopRequireDefault(_loader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.st = {
	    loader: _loader2.default
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// ajax resource loader, base on jquery ajax api
	// include cache
	// class Loader {
	//     constructor(parameters) {

	//     }
	// }
	var CONF = {
	    timeout: 30000
	};

	// 当前页面的路径
	var pagePath = function () {
	    var l = location;
	    var file = l.origin + l.pathname;
	    return file.substring(0, file.lastIndexOf("/"));
	}();

	function path2Url(path) {
	    if (path.startsWith("http:") || path.startsWith("https:")) {
	        return path;
	    } else {
	        return pagePath + path;
	    }
	}

	// 基于URL全路径的内存缓存？？
	var cache = {};
	function getCache(path) {
	    return cache[path];
	}
	function setCache(path, txt) {
	    cache[path] = txt;
	}

	// 基于jQuery
	var loader = {
	    query: function query(path, succ, err, complete) {
	        var txt = getCache(path); /// check cache first
	        if (txt) {
	            var d = $.Deferred();
	            d.resolve(txt);
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
	    loadUrls: function loadUrls(pathArr, scriptArr, succ, err) {
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
	                Array.isArray(ret) && retArr.push(ret[0]);
	            }
	            succ && succ.apply(null, retArr);
	        }, err);
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

	exports.default = loader;

/***/ }
/******/ ]);