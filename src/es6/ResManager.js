/// 管理每个sence的资源配置

// Interface
// SenceConf {
//     resID: string;   /// sence资源id
//     className: string; /// sence class name
//     script?: string | string[];
//     html?: string | string[]; 
//     htmlContent: string;  
//     css?: string;  // TODO ,先不支持 不推荐，建议style写到html里面去
// }


// 存放所有的资源配置
var resConfMap = {}; /// string --> SenceConf
/**
 * @param  pc : sence config or sence config map
 */
export function addResConf(pc) {
    // not check duplicate
    if (typeof pc.resId === "string") {
        resConfMap[pc.resId] = pc;
    } else {
        $.extend(resConfMap, pc);  // sence config map
    }
}


export function getResConf(resId){
    return resConfMap[resId];
}




export default $.extend({}, exports);   // 导出默认 模块。。。