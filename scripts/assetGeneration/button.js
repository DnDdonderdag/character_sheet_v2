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

    checkmark.appendChild(diamond)
    page.appendChild(checkmark)
    return checkmark
}

export function tickbox(){

}



function checkmarkClicked(){
    let diamond = document.getElementById(this.id + "Diamond");
    var visibility = (this.value === 1) ? "hidden" : "visible";
    diamond.style.setProperty("visibility", visibility)
    this.value = 1 - this.value;
}

export function buttonUpdater(){
    let allButtons = document.getElementsByClassName("button")
    for (let i = 0; i<allButtons.length; i++){
        let field = allButtons[i];
        var visibility = (field.value === 1) ? "visible" : "hidden";
        let tickId;
        if(field.className.includes("checkmark")){tickId = field.id + "Diamond"};
        if(field.className.includes("tickbox")){tickId = field.id + "Tick"};
        document.getElementById(tickId).style.setProperty("visibility", visibility);
    }
}
