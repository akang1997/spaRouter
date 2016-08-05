"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Sence 场景类
 * 
 * 场景范围，只管manager的生命周期和page的生命周期
 * 不管ajax组件的销毁，由其他模块来玩
 * header 和 bottombar 先不管吧
 */

var Sence = function Sence(container, manager) {
    _classCallCheck(this, Sence);

    this.$root = $(container);
    this.manager = manager;
};