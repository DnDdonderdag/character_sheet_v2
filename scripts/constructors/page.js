export function create(id, top, left){
    //Just page layout, page is 900 by 600 px
    const page = document.createElement("div");
    page.id = id
    page.style = "--top:"+String(top)+"px; --left:"+String(left)+"px;"
    page.className = "pageBackground"
    document.body.insertBefore(page, null);
    return page
}
