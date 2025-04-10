
import * as decorators from "./decorators.js"

function createGenericPage(top,left){
    //Just page layout, page is 900 by 600 px
    const page = document.createElement("div");
    page.style.top = "10px";
    page.style.left = "10px";
    page.style.width = "600px";
    page.style.height = "900px";
    page.style.backgroundColor = "#D0D0D0";
    page.style.position = "absolute";
    document.body.insertBefore(page, null);
    return page
}

function createGenericFormField(top,left,width,height){
    const formfield = document.createElement("textarea");
    formfield.id = "testTextField";
    formfield.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px; --color:"+String("#dde4ff")+";"
    formfield.className = "genericformfield"
    formfield.spellcheck = false;
    return formfield
}

function genericUpdater(){
    decorators.genericDecoratorHandler()
}

document.addEventListener("DOMContentLoaded", function () {
    let page = createGenericPage(10,10)
    let formfield = decorators.genericDecorator(createGenericFormField(300,300,200,100))
    page.appendChild(formfield); 
    genericUpdater()
});

