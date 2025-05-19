import * as calc from "../decorators/calculations.js";
import * as sync from "../decorators/syncronising.js";
import * as saveload from "../utilities/saveLoad.js";
import * as formfield  from "../assetGeneration/formfield.js";
import * as button  from "../assetGeneration/button.js";
import * as text from "../assetGeneration/text.js"
import * as autoSize from "../decorators/autoSize.js";
import * as frame from "../assetGeneration/frame.js";


/*==========
IMPORTANT NOTES:

 - Always apply the syncDecorator after the calcDecorator (for calculated fields)
 - Never call the sync updater while user is editing

==========*/


function createGenericPage(id, top, left){
    //Just page layout, page is 900 by 600 px
    const page = document.createElement("div");
    page.id = id
    page.style = "--top:"+String(top)+"px; --left:"+String(left)+"px;"
    page.className = "pageBackground"
    document.body.insertBefore(page, null);
    return page
}


function genericUpdater(){
    calc.calculationUpdater()
    autoSize.autoSizeUpdater()
}

export function generatePlayground(){
    let page = createGenericPage("page1", 10, 10)
    let field =
        autoSize.autoSizeDecorator(
            sync.syncDecorator("TestSyncClass", //This field will sync its data with all fields with same syncClass
                calc.calcDecorator( //This field is calculated
                    formfield.create("testField", 300, 300, 200, 100, page)
                )
            )
        )

    let secondField =
        autoSize.autoSizeDecorator(
            sync.syncDecorator("TestSyncClass", //This field will sync its data with all fields with same syncClass
                calc.calcDecorator( //This field is calculated
                    formfield.create("testField2", 100, 50, 200, 100, page)
                )
            )
        )

    let unsyncedField =
        autoSize.autoSizeDecorator(
            sync.syncDecorator("otherTestSyncClass", //This field will sync its data with all fields with same syncClass
                formfield.create("unsyncedField", 400, 50, 200, 100, page)
            )
        )

    let singleLineField =
    autoSize.autoSizeDecorator(
        formfield.singleLine("singleLineField", 300, 50, 200, 30, page, undefined, "left")
    )

    let singleLineField2 =
    autoSize.autoSizeDecorator(
        formfield.singleLine("singleLineField2", 340, 50, 200, 30, page, undefined, "left")
    )


    let checkmark =
        button.checkmark("testButton", 30, 400, 30, 30, page)
    let testButton =
        sync.syncDecorator("testSyncButton",
            button.tickbox("testTickbox", 30, 450, 30, 30, page)
        )
        
    let testButton2 =
        sync.syncDecorator("testSyncButton",
            button.tickbox("testTickbox2", 60, 450, 30, 30, page)
        )

    let textTest = 
        text.create("testText", "THIS IS A TEST", 100, 400, 100, 10, page, "Scalasans")

    let textFrame = 
        frame.create("testFrame", 450, 300, 200, 300, page, "TEST")


    field.textContent = "when updated, i sync"
    secondField.textContent = "update me to sync"
    unsyncedField.textContent = "i should not sync"
    singleLineField.value = "Welcome to this test page, this field holds a lot of text"

    saveload.createSaveLoadButtons(10, 10)

    genericUpdater()
};

