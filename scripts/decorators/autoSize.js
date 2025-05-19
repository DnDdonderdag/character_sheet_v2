export function autoSizeDecorator(field){
    let className = field.className
    className += " " + "autoSize"  
    field.className = className
    field.addEventListener("input", resize, false)
    return field
}


let autoSizer = document.getElementById("autoSizer")
if (!autoSizer){
    autoSizer = document.createElement("div")
    autoSizer.id = "autoSizer"
    autoSizer.style.setProperty("visibility", "visible")
    autoSizer.style.setProperty("overflow" , "auto")
    autoSizer.style.setProperty("width", "auto")
    autoSizer.style.setProperty("display",  "inline-block")
    autoSizer.style.setProperty("position", "fixed")
    autoSizer.style.setProperty("font-family", "Arial, Helvetica, sans-serif")
    document.body.appendChild(autoSizer)
}

function resize(){
    if (this.className.includes("formfield")){
        var fontSize = window.getComputedStyle(this, null).getPropertyValue('font-size');
        fontSize = parseFloat(fontSize);
        
        while(fontSize<16){
            var style = window.getComputedStyle(this, null).getPropertyValue('font-size');
            var fontSize = parseFloat(style);
            this.style.fontSize = fontSize+0.1 + 'px'
            if (this.clientHeight < this.scrollHeight) {
                this.style.fontSize = fontSize -0.1+ 'px';
                break
            }
        }
        while (this.clientHeight < this.scrollHeight) {
            var style = window.getComputedStyle(this, null).getPropertyValue('font-size');
            var fontSize = parseFloat(style);
            this.style.fontSize = fontSize-0.1 + 'px';
        }

    } else if (this.className.includes("singleLine")){
        
        var fontSize = window.getComputedStyle(this, null).getPropertyValue('font-size');
        fontSize = parseFloat(fontSize);
        autoSizer.style.fontSize = fontSize + 'px'
        autoSizer.innerText = this.value
        while (autoSizer.offsetWidth > this.offsetWidth - 5){
            console.log("shrinking")
            autoSizer.style.fontSize = fontSize + 'px'
            autoSizer.innerText = this.value
            
            fontSize -= 0.1
            autoSizer.style.fontSize = fontSize + 'px'
            this.style.fontSize = fontSize + 'px'
        }
        while (autoSizer.offsetWidth < this.offsetWidth - 5 && fontSize < 16){
            autoSizer.style.fontSize = fontSize + 'px'
            autoSizer.innerText = this.value
            
            fontSize += 0.1
            autoSizer.style.fontSize = fontSize + 'px'
            this.style.fontSize = fontSize + 'px'
        }
        
    }

}



export function autoSizeUpdater(){
    let affectedFields = document.getElementsByClassName("autoSize")
    for (let i = 0; i<affectedFields.length; i++){
        let field = affectedFields[i]
        //code to do something with field:
        console.log("Box height is: "+ getComputedStyle(field).getPropertyValue('--height').trim() + "   (this was printed by decoratorTemplate as an example)")
    }
}
