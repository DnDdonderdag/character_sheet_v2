export function create(id, top, left, width, height, fileName, parentDivID){
    // ====
    //  Creates an svg from the assets folder
    // ====
    // top, left, width, height speak for themselves

    fileName = "./assets/svg/" + fileName
    const div = document.createElement("div");
    div.draggable = false;
    div.id = id;
    div.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px;"
    div.className = "not-selectable assetDiv"
    div.spellcheck = false;
    document.getElementById(parentDivID).appendChild(div)


    const asset = document.createElement("img");
    asset.src=fileName;
    asset.alt="failed asset";
    asset.draggable = false;
    asset.id = id+"Asset";
    asset.style = "--top:"+String(0)+"px; --left:"+String(0)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px;"
    asset.className = "not-selectable asset"
    asset.spellcheck = false;
    div.appendChild(asset)
    return div
}
