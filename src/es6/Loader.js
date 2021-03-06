import utils from './util'
import ui from './ui'

// ajax resource loader, base on jquery ajax api
// include cache
var CONF = {
    timeout: 30000
}


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
var cache = {}
function getCache(path) {
    return cache[path];
}
function setCache(path, txt) {
    cache[path] = txt;
}

// 基于jQuery，全局单列
var loader = {
    query(path, succ, err, complete) {
        var txt = getCache(path);  /// check cache first
        if (txt) {
            var d = $.Deferred();
            d.resolve([txt, "from cache"]);
            succ && succ(txt);
            return d.promise();
        } else {
            return $.ajax({
                url: path
                , timeout: CONF.timeout
                , dataType: "text"
                , success: function (txt) {
                    setCache(path, txt);
                    succ && succ;
                }
                , error: err
                , complete: complete
            });
        }
    }
    , loadSenceRes(senceResConf, succ, err) {
        var pathArr = [], scriptArr = [];
        // if(senceResConf.css) pathArr.push(senceResConf.css);
        if (senceResConf.html) pathArr.push(senceResConf.html);
        pathArr = utils.arrFlat(pathArr);
        if (senceResConf.script) scriptArr = senceResConf.script;

        return this.loadUrls(pathArr, utils.makeArr(scriptArr), succ, err);
    }
    , loadUrls(pathArr, scriptArr, succ, err) {
        showLoading();
        var arr = pathArr.map(function (path) {
            return loader.query(path);
        });
        var jsArr = scriptArr.map(function (path) {
            return loader.loadScript(path);
        });

        return $.when.apply($, arr.concat(jsArr)).then(function (xhrs) {
            var retArr = [], ret;
            for (var i = 0; i < arguments.length; i++) {
                ret = arguments[i];
                $.isArray(ret) && retArr.push(ret[0]);
            }
            succ && succ.call(null, retArr);
        }, err).then(hideLoading);
    }
    // 使用script标签加载，不保证执行先后顺序
    , loadScript(path, succ, err) {
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
        }
        script.onerror = function () {
            this.onerror = this.onerror = null;
            d.reject("script load error: " + path);
            err && err();
        }
        script.setAttribute("src", path);
        document.head.appendChild(script);
        return d.promise();
    }
    , _getCache() {
        return cache;
    }
};

function showLoading() {
    ui.showloading();
}
function hideLoading() {
    ui.hideloading();
}

export default loader;