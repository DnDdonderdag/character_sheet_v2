import * as calc from "../decorators/calculations.js";
import * as sync from "../decorators/syncronising.js";
import * as saveload from "../utilities/saveLoad.js";
import * as formfield  from "../constructors/formfield.js";
import * as button  from "../constructors/button.js";
import * as text from "../constructors/text.js";
import * as autoSize from "../decorators/autoSize.js";
import * as frame from "../constructors/frame.js";
import * as page from "../constructors/page.js";



export function create(top,left){
    let page1 = page.create("playgroundPage", top, left)

    let field =
        autoSize.autoSizeDecorator(
            sync.syncDecorator("TestSyncClassPlayground", //This field will sync its data with all fields with same syncClass
                calc.calcDecorator( //This field is calculated
                    formfield.create("testFieldPlayground", 300, 300, 200, 100, "playgroundPage")
                )
            )
        );

    let secondField =
        autoSize.autoSizeDecorator(
            sync.syncDecorator("TestSyncClassPlayground", //This field will sync its data with all fields with same syncClass
                calc.calcDecorator( //This field is calculated
                    formfield.create("testField2Playground", 100, 50, 200, 100, "playgroundPage")
                )
            )
        );

    let unsyncedField =
        calc.calcDecorator(
            autoSize.autoSizeDecorator(
                sync.syncDecorator("otherTestSyncClass", //This field will sync its data with all fields with same syncClass
                    formfield.create("unsyncedFieldPlayground", 400, 50, 200, 100, "playgroundPage")
                )
            )
        );
    let singleLineField =
    autoSize.autoSizeDecorator(
        formfield.singleLine("singleLineFieldPlayground", 300, 50, 200, 30, "playgroundPage", undefined, "left")
    );

    let singleLineField2 =
    autoSize.autoSizeDecorator(
        formfield.singleLine("singleLineField2Playground", 340, 50, 200, 30, "playgroundPage", undefined, "left")
    );


    let testButton =
        sync.syncDecorator("testSyncButtonPlayground",
            button.checkmark("testTickbox", 30, 450, 30, 30, "playgroundPage")
        );
        
    let testButton2 =
        sync.syncDecorator("testSyncButtonPlayground",
            button.checkmark("testTickbox2", 60, 450, 30, 30, "playgroundPage")
        );

    let testButton3 =
        sync.syncDecorator("testSyncButton2Playground",
            button.tickbox("testTickbox3Playground", 30, 410, 30, 30, "playgroundPage")
        );
        
    let testButton4 =
        sync.syncDecorator("testSyncButton2Playground",
            button.tickbox("testTickbox4Playground", 60, 410, 30, 30, "playgroundPage")
        );

    let textTest = 
        text.create("testTextPlayground", "THIS IS A TEST", 100, 400, 100, 10, "playgroundPage", "Scalasans");

    let textFrame = 
        frame.create("testFramePlayground", 450, 300, 200, 300, "playgroundPage", "TEST");


    field.textContent = "1+1 [unsynce[singleLineFieldPlayground]Fi[singleLineField2Playground]ldPlayground]";
    unsyncedField.textContent = "test";
    singleLineField.value = "d";
    singleLineField2.value = "e";

    saveload.createSaveLoadButtons(top, left);
};

