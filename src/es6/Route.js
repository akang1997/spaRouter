// manage route statck

/**
 * Route 一个路由对象，存放一个sence的相关信息
 */
class Route {
    constructor(hashConf, data, options, senceInstance, statgeID) {
        this.hashConf = hashConf; 
        this.data = data;
        this.options = options;
        this.sence = senceInstance;
        this.statgeID = statgeID;
    }
}

export default Route;