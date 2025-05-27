export function create(id, top, left, width, height, bevel ,parentDivID, color){
    bevel = (bevel === undefined) ? 6 : bevel;
    
    const bevelledBox  = document.createElement("div");
    bevelledBox.id = id
    bevelledBox.className = "bevelledBox";
    bevelledBox.style = "--width: "+String(width)+"px; --height: "+String(height)+"px; --bevel: "+String(bevel)+"px; --color: #"+String(color)+"; top:"+String(top)+"px; left:"+String(left)+"px;";
    
    document.getElementById(parentDivID).appendChild(bevelledBox)
}