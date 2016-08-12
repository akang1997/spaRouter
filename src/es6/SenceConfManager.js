/// 管理每个sence的资源配置

// Interface
// SenceConf {
//     senceId: string;   /// sence资源id
//     className: string; /// sence class name
//     script?: string | string[];
//     html?: string | string[]; 
//     htmlContent: string;  
//     css?: string;  // TODO ,先不支持 不推荐，建议style写到html里面去
// }


// 存放所有的资源配置
var senceConfMap = {}; /// string --> SenceConf
/**
 * @param  pc : sence config or sence config map
 */
export function addSenceConf(pc) {
    // not check duplicate
    if (typeof pc.senceId === "string") {
        senceConfMap[pc.senceId] = pc;
    } else {
        $.extend(senceConfMap, pc);  // sence config map
    }
}


export function getSenceConf(senceId){
    return senceConfMap[senceId];
}




export default $.extend({}, exports);   // 导出默认 模块。。。