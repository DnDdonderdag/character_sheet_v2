export function create(id, content, top, left, width, height, parentDivID, fontfamily, color, fontsize, alignment, jsonBool){
    // ====
    //  Creates a text box
    // ====
    // top, left, width, height speak for themselves
    // alignment, choose from things like "left" "center"
    // color, set the color, default is "black"


    //These allow variables to be undefined, and they set a default value
    var fontfamily = (fontfamily === undefined || fontfamily === null || fontfamily === "null" || fontfamily === "undefined") ? "Scalasans" : fontfamily;
    var alignment = (alignment === undefined || alignment === null || alignment === "null" || alignment === "undefined") ? "center" : alignment;
    var fontsize = (fontsize === undefined || fontsize === null || fontsize === "null" || fontsize === "undefined") ? height : fontsize;
    var color = (color === undefined || color === null || color === "null" || color === "undefined") ? "black" : color;

    const textbox = document.createElement("div");
    textbox.id = id;
    textbox.textContent = content;
    textbox.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px; --color:"+String(color)+"; --align:"+String(alignment)+"; --fontsize:"+String(fontsize)+"px"+"; --fontfamiliy:"+String(fontfamily)+";"
    textbox.className = "not-selectable textbox"
    textbox.spellcheck = false;

    jsonBool = (jsonBool === undefined || jsonBool === null || jsonBool === "null" || jsonBool === "undefined") ? true : jsonBool;
    if(jsonBool){
        textbox.className += " json"
        let jsonCode = '"' + id + '":{"function":"text","args":["'+id+'","'+content+'",'+top+','+left+','+width+','+height+',"'+parentDivID+'","'+fontfamily+'","'+color+'",'+fontsize+',"'+alignment+'",'+jsonBool+']},'
        textbox.json = jsonCode
    }
    
    document.getElementById(parentDivID).appendChild(textbox)
    return textbox
}