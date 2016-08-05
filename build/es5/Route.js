"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// manage route statck

/**
 * Route 一个路由对象，存放一个page实例的相关信息
 */

var Route = function Route(pageID, url, senceInstance, domCache) {
    _classCallCheck(this, Route);

    this.pageID = pageID;
    this.url = url;
    this.sence = senceInstance;
    this.domCache = !!domCache;
};

exports.default = Route;