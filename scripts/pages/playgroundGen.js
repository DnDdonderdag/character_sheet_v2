import * as calc from "../decorators/calculations.js";
import * as sync from "../decorators/syncronising.js";
import * as saveload from "../utilities/saveLoad.js";
import * as formfield  from "../constructors/formfield.js";
import * as button  from "../constructors/button.js";
import * as text from "../constructors/text.js";
import * as autoSize from "../decorators/autoSize.js";
import * as frame from "../constructors/frame.js";
import * as page from "../constructors/page.js";



export function generatePlayground(){
    let page1 = page.create("page1", 10, 10);

    let field =
        autoSize.autoSizeDecorator(
            sync.syncDecorator("TestSyncClass", //This field will sync its data with all fields with same syncClass
                calc.calcDecorator( //This field is calculated
                    formfield.create("testField", 300, 300, 200, 100, "page1")
                )
            )
        );

    let secondField =
        autoSize.autoSizeDecorator(
            sync.syncDecorator("TestSyncClass", //This field will sync its data with all fields with same syncClass
                calc.calcDecorator( //This field is calculated
                    formfield.create("testField2", 100, 50, 200, 100, "page1")
                )
            )
        );

    let unsyncedField =
        calc.calcDecorator(
            autoSize.autoSizeDecorator(
                sync.syncDecorator("otherTestSyncClass", //This field will sync its data with all fields with same syncClass
                    formfield.create("unsyncedField", 400, 50, 200, 100, "page1")
                )
            )
        );
    let singleLineField =
    autoSize.autoSizeDecorator(
        formfield.singleLine("singleLineField", 300, 50, 200, 30, "page1", undefined, "left")
    );

    let singleLineField2 =
    autoSize.autoSizeDecorator(
        formfield.singleLine("singleLineField2", 340, 50, 200, 30, "page1", undefined, "left")
    );


    let checkmark =
        button.checkmark("testButton", 30, 400, 30, 30, "page1");
    let testButton =
        sync.syncDecorator("testSyncButton",
            button.tickbox("testTickbox", 30, 450, 30, 30, "page1")
        );
        
    let testButton2 =
        sync.syncDecorator("testSyncButton",
            button.tickbox("testTickbox2", 60, 450, 30, 30, "page1")
        );

    let textTest = 
        text.create("testText", "THIS IS A TEST", 100, 400, 100, 10, "page1", "Scalasans");

    let textFrame = 
        frame.create("testFrame", 450, 300, 200, 300, "page1", "TEST");


    field.textContent = "1+1 [unsynce[singleLineField]Fi[singleLineField2]ld]";
    unsyncedField.textContent = "test";
    singleLineField.value = "d";
    singleLineField2.value = "e";

    saveload.createSaveLoadButtons(10, 10);
};

