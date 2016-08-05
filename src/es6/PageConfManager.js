/// 管理每个page的资源配置

// Interface
// PageConf {
//     pageId: string;
//     managerId: string;
//     script?: string | string[];
//     html?: string | string[];
//     htmlContent: string;
// }


// 存放所有的资源配置
var pageConfMap = {}; /// string --> PageConf
/**
 * @param  pc : page config or page config map
 */
export function addPageConf(pc) {
    // not check duplicate
    if (typeof pc.pageId === "string") {
        pageConfMap[pc.pageId] = pc;
    } else {
        $.extends(pageConfMap, pc);  // page config map
    }
}


export function getPageConf(pageId){
    return pageConfMap[pageId];
}