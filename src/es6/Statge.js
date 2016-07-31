// 舞台类, 就是一块div的 单页面 的管理类，
// 一个舞台可一切换不同的场景，但是最多只有一个场景在前台

// 存放所有的资源配置
var pageConfMap = {};
// PageConf {
//     pageId: string;
//     managerId: string;
//     script?: string | string[];
//     html?: string | string[];
//     htmlContent: string;
// }


class Statge{
    static addPageConf(pc) {  // page config or page config map
        // not check duplicate
        if (typeof pc.pageId === "string") {
            pageConfMap[pc.pageId] = pc;
        } else {
            $.extends(pageConfMap, pc);  // page config map
        }
    }

    constructor(rootEle) {
        // route 对象的栈
        this.routeStack = [];
        this.rootEle = rootEle;
    }

    // 开始监听事件
    start() {

    }

    // 停止监听事件
    stop() {

    }
    
}


export default Statge;