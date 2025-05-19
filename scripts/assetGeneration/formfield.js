export function create(id, top, left, width, height, parentDiv, color, alignment){
    // ====
    //  Creates a form field box
    // ====
    // top, left, width, height speak for themselves
    // alignment, choose from things like "left" "center"
    // color, set the color, default is "#dde4ff"


    //These allow variables to be undefined, and they set a default value
    var alignment = (alignment === undefined) ? "left" : alignment;
    var color = (color === undefined) ? "#dde4ff" : color;

    const formfield = document.createElement("textarea");
    formfield.id = id;
    formfield.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px; --color:"+String(color)+"; --align:"+String(alignment)+""
    formfield.className = "not-selectable formfield save"
    formfield.spellcheck = false;
    parentDiv.appendChild(formfield)
    return formfield
}

export function singleLine(id, top, left, width, height, parentDiv, color, alignment){
    // ====
    //  Creates a form field box
    // ====
    // top, left, width, height speak for themselves
    // alignment, choose from things like "left" "center"
    // color, set the color, default is "#dde4ff"


    //These allow variables to be undefined, and they set a default value
    var alignment = (alignment === undefined) ? "left" : alignment;
    var color = (color === undefined) ? "#dde4ff" : color;

    const formfield = document.createElement("input");
    formfield.id = id;
    formfield.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px; --color:"+String(color)+"; --align:"+String(alignment)+""
    formfield.className = "not-selectable singleLine save"
    formfield.spellcheck = false;
    parentDiv.appendChild(formfield)
    return formfield
}