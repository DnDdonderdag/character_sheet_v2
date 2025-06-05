import * as update from "../utilities/updater.js";
import * as formfield from "../constructors/formfield.js"


export function create(id, top, left, width, height, parentDivID, color, textContent, fontsize, alignment ,initialScript){
    // ====
    //  Creates square checkbox button
    // ====
    // top, left, width, height speak for themselves
    // color, set the color, default is "#dde4ff"


    //These allow variables to be undefined, and they set a default value
    var color = (color === undefined || color === null) ? "#c5c6c7" : color;
    var initialScript = (initialScript === undefined || initialScript === null) ? "console.log('script not set)" : initialScript;
    var alignment = (alignment === undefined || alignment === null) ? "left" : alignment;
    var fontsize = (fontsize === undefined || fontsize === null) ? height : fontsize;

    const button = document.createElement("div");
    button.id = id;
    button.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px; --color:"+String(color)+"; --fontsize:"+String(fontsize)+"px"+"; --align:"+String(alignment)+""
    button.className = "not-selectable programmableButton save "
    button.value = initialScript;
    button.addEventListener("click", update.onProgrammableButtonPress, false)
    button.addEventListener("contextmenu", e => e.preventDefault());
    button.addEventListener("contextmenu", update.onProgrammableButtonRightClick, false)
    button.textContent = textContent
    document.getElementById(parentDivID).appendChild(button)
    return button
}


export function click(field){
    try{
        eval(field.value) //maybe make a better syntax for this one day
    }
    catch{
        console.log("error in script: " + field.value)
    }
}



export function rightClick(field){
    let scriptFieldParent = document.createElement("div")
    scriptFieldParent.id = "scriptFieldParent"
    document.body.appendChild(scriptFieldParent)
    let scriptField = formfield.create("scriptField", 0,0,100,200,"scriptFieldParent", undefined, "left", undefined, undefined)
    scriptField.addEventListener("blur", scriptFieldUnfocus)
    scriptField.style.setProperty("visibility", "visible")
    
    const rect = field.getBoundingClientRect(); 
    scriptField.style.top = `${rect.top + window.scrollY}px`;
    scriptField.style.left = `${rect.left + window.scrollX}px`;

    scriptField.textContent = field.id
    scriptField.value = field.value
    scriptField.focus()

}

function scriptFieldUnfocus(){
    this.style.setProperty("visibility", "hidden")
    let target = document.getElementById(this.textContent)
    target.value = this.value
    this.remove()
}