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