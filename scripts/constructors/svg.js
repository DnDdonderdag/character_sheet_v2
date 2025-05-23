export function create(id, top, left, width, height, fileName, parentDivID){
    // ====
    //  Creates an svg from the assets folder
    // ====
    // top, left, width, height speak for themselves

    fileName = "./assets/svg/" + fileName

    const asset = document.createElement("img");
    asset.src=fileName;
    asset.alt="failed asset";
    asset.draggable = false;
    asset.id = id;
    asset.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px;"
    asset.className = "not-selectable asset"
    asset.spellcheck = false;
    document.getElementById(parentDivID).appendChild(asset)
    return asset
}
