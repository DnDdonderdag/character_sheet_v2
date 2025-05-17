import * as decorators from "../decorators/decoratorTemplate.js";
import * as calc from "../decorators/calculations.js";
import * as sync from "../decorators/syncronising.js";
import * as saveload from "../utilities/saveLoad.js";
import * as formfield  from "../assetGeneration/formfield.js";
import * as button  from "../assetGeneration/button.js";

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
    decorators.genericDecoratorHandler()
    calc.calculationUpdater()
}

export function generatePlayground(){
    let page = createGenericPage("page1", 10, 10)
    let field =
        sync.syncDecorator("TestSyncClass", //This field will sync its data with all fields with same syncClass
            calc.calcDecorator( //This field is calculated
                formfield.create("testField", 300, 300, 200, 100, page)
            )
        )

    let secondField =
        sync.syncDecorator("TestSyncClass", //This field will sync its data with all fields with same syncClass
            calc.calcDecorator( //This field is calculated
                formfield.create("testField2", 100, 50, 200, 100, page)
            )
        )

    let unsyncedField =
        sync.syncDecorator("otherTestSyncClass", //This field will sync its data with all fields with same syncClass
            formfield.create("unsyncedField", 400, 50, 200, 100, page)
        )


    let checkmark =
        button.checkmark("testButton", 30, 400, 30, 30, page)
    let testButton =
        button.tickbox("testTickbox", 30, 450, 30, 30, page)
           
    field.textContent = "when updated, i sync"
    secondField.textContent = "update me to sync"
    unsyncedField.textContent = "i should not sync"


    saveload.createSaveLoadButtons(10, 10)

    genericUpdater()
};

