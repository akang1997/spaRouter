// 

/**
 * SenceManager 场景 管理类
 */
class SenceManager {

    constructor() {  // 公共的构造函数，不会被覆盖
        observable(this);
        this.init(parameters);
    }

    beforeInit(){

    }

    // 类初始化时调用
    init(param){

    }

    // 当页面可以做动画的时候触发
    beforeShow(){

    }

    // 	在页面动画完成之后触发
    afterShow(){

    }

    // 重新被切换到前台
    resume(){

    }

    afterBack(){
        
    }

    // 被切换到后台
    pause(){

    }

    // 移除动画
    beforeRemove(){

    }

    // 页面销毁
    destroy(){

    }

}