let syncClasses = [];

export function syncDecorator(syncClass,field){
    let className = field.className;
    className += " " + "sync" + " syncMe" + String(syncClass);
    syncClasses.push(String(syncClass));
    field.className = className;
    field.addEventListener("focusout", syncDecoratorHandler, false);
    return field;
};


export function syncDecoratorHandler(){
    let classname = this.className
    let preSliced = classname.slice(this.className.indexOf("syncMe"))
    let syncClass = (preSliced.indexOf(" ") == -1) ? preSliced : preSliced.slice(0, preSliced.indexOf(" "))

    let affectedFields = document.getElementsByClassName(syncClass)
    for (let i = 0; i<affectedFields.length; i++){
        let field = affectedFields[i]
        field.value = this.value
        field.textContent = this.textContent
        
    }
}