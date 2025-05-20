import * as update from "../utilities/updater.js";

export function create(id, top, left, width, height, parentDiv, color, alignment, maxFontSize){
    // ====
    //  Creates a form field box
    // ====
    // top, left, width, height speak for themselves
    // alignment, choose from things like "left" "center"
    // color, set the color, default is "#dde4ff"


    //These allow variables to be undefined, and they set a default value
    alignment = (alignment === undefined) ? "left" : alignment;
    color = (color === undefined) ? "#dde4ff" : color;
    maxFontSize = (maxFontSize === undefined) ? 16 : maxFontSize;

    const formfield = document.createElement("textarea");
    formfield.id = id;
    formfield.style = "--top:"+String(top-1)+"px; --left:"+String(left)+"px; --width:"+String(width-4)+"px; --height:"+String(height-4)+"px; --color:"+String(color)+"; --align:"+String(alignment)+""
    formfield.className = "not-selectable formfield save"
    formfield.spellcheck = false;
    formfield.maxFontSize = maxFontSize
    formfield.style.setProperty("font-size", maxFontSize + "px")
    formfield.addEventListener("focusout", update.onUnfocus, false)
    formfield.addEventListener("focus", update.onfocus, false);
    formfield.addEventListener("input", update.onKeystroke, false)
    if (parentDiv){parentDiv.appendChild(formfield)}
    return formfield
}

export function singleLine(id, top, left, width, height, parentDiv, color, alignment, maxFontSize){
    // ====
    //  Creates a form field box
    // ====
    // top, left, width, height speak for themselves
    // alignment, choose from things like "left" "center"
    // color, set the color, default is "#dde4ff"


    //These allow variables to be undefined, and they set a default value
    alignment = (alignment === undefined) ? "left" : alignment;
    color = (color === undefined) ? "#dde4ff" : color;
    maxFontSize = (maxFontSize === undefined) ? 16 : maxFontSize;


    const formfield = document.createElement("input");
    formfield.id = id;
    formfield.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px; --color:"+String(color)+"; --align:"+String(alignment)+""
    formfield.className = "not-selectable singleLine save"
    formfield.spellcheck = false;
    formfield.maxFontSize = maxFontSize
    formfield.style.setProperty("font-size", maxFontSize + "px")
    formfield.addEventListener("focusout", update.onUnfocus, false)
    formfield.addEventListener("focus", update.onfocus, false);
    formfield.addEventListener("input", update.onKeystroke, false)
    if (parentDiv){parentDiv.appendChild(formfield)}
    return formfield
}