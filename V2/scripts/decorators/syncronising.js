let syncClasses = [];

export function syncDecorator(syncClass,field){
    //SHOULD ALWAYS BE APPLIED TO A FIELD AFTER THE CALCULATING DECORATOR (IF IT IS CALCULATED)
    let className = field.className;
    className += " " + "sync" + " syncMe" + String(syncClass);
    syncClasses.push(String(syncClass));
    field.className = className;

    if (field.className.includes("json")){
        field.json = field.json.slice(0,field.json.indexOf(":")+1)+'{"function":"sync","args":{"syncClass":"'+syncClass+'",'+field.json.slice(field.json.indexOf(":")+2,field.json.length-1)+"},"
    }
    return field

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