import * as decorators from "./decoratorTemplate.js"
import * as calculator from "./calculations.js"
import * as sync from "./syncronising.js";

function createGenericPage(id, top,left){
    //Just page layout, page is 900 by 600 px
    const page = document.createElement("div");
    page.id = id
    page.style = "--top:"+String(top)+"px; --left:"+String(left)+"px;"
    page.className = "pageBackground"
    document.body.insertBefore(page, null);
    return page
}

function createGenericFormField(id, top, left, width, height, color, alignment ){
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
    formfield.className = "genericformfield"
    formfield.spellcheck = false;
    return formfield
}

function genericUpdater(){
    decorators.genericDecoratorHandler()
    calculator.calculationUpdater()
}

export function generatePlayground(){
    let page = createGenericPage("page1", 10, 10)
    let formfield =
        sync.syncDecorator("TestSyncClass", //This field will sync its data with all fields with same syncClass
            calculator.calcDecorator( //This field is calculated
                decorators.genericDecorator( //This field is decorated with the template
                    createGenericFormField("testField", 300, 300, 200, 100)
                )
            )
        )

    let secondFormfield =
        sync.syncDecorator("TestSyncClass", //This field will sync its data with all fields with same syncClass
            calculator.calcDecorator( //This field is calculated
                decorators.genericDecorator( //This field is decorated with the template
                    createGenericFormField("testField2", 100, 50, 200, 100)
                )
            )
        )
    let unsyncedFormfield =
        sync.syncDecorator("otherTestSyncClass", //This field will sync its data with all fields with same syncClass
            decorators.genericDecorator( //This field is decorated with the template
                createGenericFormField("testField2", 400, 50, 200, 100)
            )
        )
    formfield.value = ""
    formfield.textContent = "when updated, i sync"
    secondFormfield.textContent = "update me to sync"
    unsyncedFormfield.textContent = "i should not sync"
    page.appendChild(unsyncedFormfield); 
    page.appendChild(secondFormfield); 
    page.appendChild(formfield); 
    genericUpdater()
};

