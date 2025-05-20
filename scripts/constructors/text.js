export function create(id, content, top, left, width, height, parent, fontfamily, color, fontsize, alignment){
    // ====
    //  Creates a text box
    // ====
    // top, left, width, height speak for themselves
    // alignment, choose from things like "left" "center"
    // color, set the color, default is "black"


    //These allow variables to be undefined, and they set a default value
    var fontfamily = (fontfamily === undefined) ? "Scalasans" : fontfamily;
    var alignment = (alignment === undefined) ? "center" : alignment;
    var fontsize = (fontsize === undefined) ? height : fontsize;
    var color = (color === undefined) ? "black" : color;

    const textbox = document.createElement("div");
    textbox.id = id;
    textbox.textContent = content;
    textbox.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px; --color:"+String(color)+"; --align:"+String(alignment)+"; --fontsize:"+String(fontsize)+"px"+"; --fontfamiliy:"+String(fontfamily)+";"
    textbox.className = "not-selectable textbox"
    textbox.spellcheck = false;
    parent.appendChild(textbox)
    return textbox
}