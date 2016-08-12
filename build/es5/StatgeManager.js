'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addStatge = addStatge;
exports.getStatge = getStatge;
exports.removeStatge = removeStatge;
exports.unRegister = unRegister;
exports.getStatgeMap = getStatgeMap;
exports.setMainStatge = setMainStatge;
exports.start = start;
exports.stop = stop;

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _SenceConfManager = require('./SenceConfManager');

var _SenceConfManager2 = _interopRequireDefault(_SenceConfManager);

var _Statge = require('./Statge');

var _Statge2 = _interopRequireDefault(_Statge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/// 单例模式

// hash 监听
var listenFlag = false;
$(window).on("hashchange", function () {
    if (!listenFlag) return;

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
        delete statgeMap[statge.id];
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