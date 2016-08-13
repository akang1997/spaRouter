import util from './util'
import SenceConfManager from './SenceConfManager'
import Statge from './Statge'

/// 单例模式

// hash 监听
var listenFlag = false;

export function slientChangeHash(hashStr) {
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

    var hashConf = util.parseHash(location.hash);
    if (hashConf.isSence) {
        dispatchHashConf(hashConf);
    }
});


var statgeMap = {};
var mainStatgeID = "";   // 只有一个main statge 即default statge
var statgeCounter = 0;
export function addStatge(rootEle, conf) {
    var statge = new Statge(rootEle, conf);  // 创建

    var id = statge.id;
    if (statgeMap[id]) {
        return console.error("duplicate statge id: " + id);
    }
    statgeMap[id] = statge;
    statgeCounter++;

    if (statgeCounter === 1 || statge.isMain) { /// 默认第一个为 main statge
        setMainStatge(statge);
    }

    return statge;
}

export function getStatge(statgeID) {
    return statgeMap[statgeID];
}

export function removeStatge(statge) {
    if (typeof statge === 'string') {
        statge = getStatge(statge);
    }
    unRegister(statge.id);
    statge && statge.destroy();
}

export function unRegister(statgeID) {
    var st = getStatge(statgeID);
    if (st) {
        delete statgeMap[st.id];
        statgeCounter--;
    }

    // if(statge.isMain){
    //     // TODO
    // }
}

export function getStatgeMap() {
    return statgeMap;
}

export function setMainStatge(statge) {
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

export function start() {
    listenFlag = true;
}

export function stop() {
    listenFlag = false;
}

export default $.extend({}, exports);