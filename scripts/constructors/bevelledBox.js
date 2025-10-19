export function create(id, top, left, width, height, bevel ,parentDivID, color, jsonBool){
    bevel = (bevel === undefined || bevel === "null" || bevel === "undefined") ? 6 : bevel;
    
    const bevelledBox  = document.createElement("div");
    bevelledBox.id = id
    bevelledBox.className = "bevelledBox";
    bevelledBox.style = "--width: "+String(width)+"px; --height: "+String(height)+"px; --bevel: "+String(bevel)+"px; --color: #"+String(color)+"; top:"+String(top)+"px; left:"+String(left)+"px;";

    jsonBool = (jsonBool === undefined || jsonBool === null || jsonBool === "null" || jsonBool === "undefined") ? true : jsonBool;
    if(jsonBool){
        bevelledBox.className += " json"
        let jsonCode = '"' + id + '":{"function":"bevelledBox","args":["'+id+'",'+top+','+left+','+width+','+height+','+bevel+',"'+parentDivID+'","'+color+'",'+jsonBool+']},'
        bevelledBox.json = jsonCode
    }

    document.getElementById(parentDivID).appendChild(bevelledBox)
}