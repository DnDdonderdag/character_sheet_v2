export function checkmark(id, top, left, width, height, page, color){
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
    checkmark.addEventListener("click", checkmarkClicked, false)

    const diamond = document.createElement("div");
    diamond.id = id + "Diamond";
    diamond.className = "not-selectable checkmarkDiamond save "
    diamond.style.setProperty("visibility", "hidden");
    
    page.appendChild(checkmark)
    checkmark.appendChild(diamond)
    return checkmark
}

export function tickbox(id, top, left, width, height, page, color){
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
    tickbox.addEventListener("click", tickboxClicked, false)

    page.appendChild(tickbox)
    return tickbox
}


function checkmarkClicked(){
    let diamond = document.getElementById(this.id + "Diamond");
    var visibility = (this.value === 1) ? "hidden" : "visible";
    diamond.style.setProperty("visibility", visibility)
    this.value = 1 - this.value;
}

function tickboxClicked(){
    let backgroundColor = (this.value === 1) ? "#dde4ff" : "gray";
    this.style.setProperty("background-color", backgroundColor)
    this.value = 1 - this.value;
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
