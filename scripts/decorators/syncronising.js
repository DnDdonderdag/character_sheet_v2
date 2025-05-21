let syncClasses = [];

export function syncDecorator(syncClass,field){
    //SHOULD ALWAYS BE APPLIED TO A FIELD AFTER THE CALCULATING DECORATOR (IF IT IS CALCULATED)
    let className = field.className;
    className += " " + "sync" + " syncMe" + String(syncClass);
    syncClasses.push(String(syncClass));
    field.className = className;

    return field;
};


export function syncUpdater(triggeringField){
    let classname = triggeringField.className
    let preSliced = classname.slice(triggeringField.className.indexOf("syncMe")) // filtering the syncclass from within the enitre class string
    let syncClass = (preSliced.indexOf(" ") == -1) ? preSliced : preSliced.slice(0, preSliced.indexOf(" ")) // finishing filtering (this is a one line if-else)

    let affectedFields = document.getElementsByClassName(syncClass)
    for (let i = 0; i<affectedFields.length; i++){
        let field = affectedFields[i]
        field.value = triggeringField.value
        if (field.className.includes("calc")){field.textContent = triggeringField.textContent}
    }
}