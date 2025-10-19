export function create(id, top, left){
    //Just page layout, page is 900 by 630 px
    const page = document.createElement("div");
    page.id = id
    page.style = "--top:"+String(top)+"px; --left:"+String(left)+"px;"
    page.className = "pageBackground json"

    let jsonCode = '"' + id + '":{"function":"page","args":["'+id+'",'+top+','+left+']},'
    page.json = jsonCode

    document.body.insertBefore(page, null);
    return page
}
