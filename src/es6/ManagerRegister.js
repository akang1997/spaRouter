import SenceManager from './SenceManager'

var managers = {};

var instance = new SenceManager();

export function registerManager(managerName, instanceProps, staticProps) {
    if(getManager(managerName)){
        console.warn("duplicate managerName " + managerName);
    }
    function SubManager(){
        SenceManager.apply(this, arguments);  // === super(arguments)
    }
    SubManager.prototype = Object.create(instance, instanceProps);
    SubManager.prototype.constructor = SubManager;

    $.extend(SubManager, staticProps);

    managers[managerName] = SubManager;
}

export function getManager(managerName){
    return managers[managerName];
}