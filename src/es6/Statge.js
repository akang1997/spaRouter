// 舞台类, 就是一块div的 单页面 的管理类，
// 一个舞台可一切换不同的场景，但是最多只有一个场景在前台
// 
// 除了管 sence 切换，其他的ui相关内容一律不管

import Route from './Route'
import PageConfManager from './PageConfManager'
// import


class Statge {
    /**
     * @param  pc : page config or page config map
     */

    constructor(rootEle) {
        // route 对象的栈
        this.routeStack = [];
        this.rootEle = rootEle;
        this.runFlag = true;
    }

    // 开始监听事件
    start() {

    }

    // 停止监听事件
    stop() {

    }

}


export default Statge;