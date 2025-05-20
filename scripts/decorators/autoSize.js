
export function autoSizeDecorator(field){
    let className = field.className
    className += " " + "autoSize"  
    field.className = className
    return field
}


let autoSizer = document.getElementById("autoSizer")
if (!autoSizer){
    autoSizer = document.createElement("div")
    autoSizer.id = "autoSizer"
    autoSizer.style.setProperty("visibility", "hidden")
    autoSizer.style.setProperty("overflow" , "auto")
    autoSizer.style.setProperty("width", "auto")
    autoSizer.style.setProperty("display",  "inline-block")
    autoSizer.style.setProperty("position", "fixed")
    autoSizer.style.setProperty("font-family", "Arial, Helvetica, sans-serif")
    document.body.appendChild(autoSizer)
}

export function resize(triggeringField){
    if (triggeringField.className.includes("formfield")){
        var fontSize = window.getComputedStyle(triggeringField, null).getPropertyValue('font-size');
        fontSize = parseFloat(fontSize);
        
        while(fontSize<triggeringField.maxFontSize){
            var style = window.getComputedStyle(triggeringField, null).getPropertyValue('font-size');
            var fontSize = parseFloat(style);
            triggeringField.style.fontSize = fontSize+0.1 + 'px'
            if (triggeringField.clientHeight < triggeringField.scrollHeight) {
                triggeringField.style.fontSize = fontSize -0.1+ 'px';
                break
            }
        }
        while (triggeringField.clientHeight < triggeringField.scrollHeight) {
            var style = window.getComputedStyle(triggeringField, null).getPropertyValue('font-size');
            var fontSize = parseFloat(style);
            triggeringField.style.fontSize = fontSize-0.1 + 'px';
        }

    } else if (triggeringField.className.includes("singleLine")){
        var fontSize = window.getComputedStyle(triggeringField, null).getPropertyValue('font-size');
        fontSize = parseFloat(fontSize);
        autoSizer.style.fontSize = fontSize + 'px'
        autoSizer.innerText = triggeringField.value

        while (autoSizer.offsetWidth > triggeringField.offsetWidth - 5){
            autoSizer.style.fontSize = fontSize + 'px'
            autoSizer.innerText = triggeringField.value
            
            fontSize -= 0.1
            autoSizer.style.fontSize = fontSize + 'px'
            triggeringField.style.fontSize = fontSize + 'px'
        }
        while (autoSizer.offsetWidth < triggeringField.offsetWidth - 5 && fontSize < triggeringField.maxFontSize){
            autoSizer.style.fontSize = fontSize + 'px'
            autoSizer.innerText = triggeringField.value
            
            fontSize += 0.1
            autoSizer.style.fontSize = fontSize + 'px'
            triggeringField.style.fontSize = fontSize + 'px'
        }
    }
}



export function autoSizeUpdater(){
    let affectedFields = document.getElementsByClassName("autoSize")
    for (let i = 0; i<affectedFields.length; i++){
        let field = affectedFields[i]
        resize(field)
    }
}
