// manage route statck

/**
 * Route 一个路由对象，存放一个page实例的相关信息
 */
class Route {
    constructor(pageID, url, senceInstance, domCache) {
        this.pageID = pageID; 
        this.url = url;
        this.sence = senceInstance;
        this.domCache = !!domCache;
    }
}

export default Route