import * as update from "../utilities/updater.js";

export function checkmark(id, top, left, width, height, parentDivID, color, jsonBool){
    // ====
    //  Creates square checkbox button
    // ====
    // top, left, width, height speak for themselves
    // color, set the color, default is "#dde4ff"


    //These allow variables to be undefined, and they set a default value
    var color = (color === undefined) ? "#dde4ff" : color;

    const checkmark = document.createElement("div");
    checkmark.id = id;
    checkmark.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px; --color:"+String(color)+"; "
    checkmark.className = "not-selectable checkmark button save "
    checkmark.value = 0;
    checkmark.addEventListener("click", update.onButtonPress, false)

    const diamond = document.createElement("div");
    diamond.id = id + "Diamond";
    diamond.className = "not-selectable checkmarkDiamond save "
    diamond.style.setProperty("visibility", "hidden");


    jsonBool = (jsonBool === undefined || jsonBool === null || jsonBool === "null" || jsonBool === "undefined") ? true : jsonBool;
    if(jsonBool){
        checkmark.className += " json"
        let jsonCode = '"' + id + '":{"function":"checkmark","args":["'+id+'",'+top+','+left+','+width+','+height+',"'+parentDivID+'","'+color+'",'+jsonBool+']},'
        checkmark.json = jsonCode
    }
    
    document.getElementById(parentDivID).appendChild(checkmark)
    checkmark.appendChild(diamond)
    return checkmark
}

export function tickbox(id, top, left, width, height, parentDivID, color, jsonBool){
    // ====
    //  Creates circular tickbox button
    // ====
    // top, left, width, height speak for themselves
    // color, set the color, default is "#dde4ff"


    //These allow variables to be undefined, and they set a default value
    var color = (color === undefined) ? "#dde4ff" : color;

    const tickbox = document.createElement("div");
    tickbox.id = id;
    tickbox.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px; --color:"+String(color)+"; "
    tickbox.className = "not-selectable tickbox button save "
    tickbox.value = 0;
    tickbox.addEventListener("click", update.onButtonPress, false)

    jsonBool = (jsonBool === undefined || jsonBool === null || jsonBool === "null" || jsonBool === "undefined") ? true : jsonBool;
    if(jsonBool){
        tickbox.className += " json"
        let jsonCode = '"' + id + '":{"function":"tickbox","args":["'+id+'",'+top+','+left+','+width+','+height+',"'+parentDivID+'","'+color+'",'+jsonBool+']},'
        tickbox.json = jsonCode
    }
    

    document.getElementById(parentDivID).appendChild(tickbox)
    return tickbox
}



export function buttonUpdater(){
    let allButtons = document.getElementsByClassName("button")
    for (let i = 0; i<allButtons.length; i++){
        let field = allButtons[i];
        if(field.className.includes("checkmark")){
            var visibility = (field.value === 1) ? "visible" : "hidden";
            let tickId;
            tickId = field.id + "Diamond"
            document.getElementById(tickId).style.setProperty("visibility", visibility);
        };
        if(field.className.includes("tickbox")){
            let backgroundColor = (field.value === 1) ? "gray" : "#dde4ff";
            field.style.setProperty("background-color", backgroundColor)
        };
        
    }
}
