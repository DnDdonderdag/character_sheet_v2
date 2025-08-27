import * as calc from "../decorators/calculate/calculations.js";
import * as sync from "../decorators/syncronising.js";
import * as saveload from "../utilities/saveLoad.js";
import * as formfield  from "../constructors/formfield.js";
import * as button  from "../constructors/button.js";
import * as text from "../constructors/text.js";
import * as autoSize from "../decorators/autoSize.js";
import * as frame from "../constructors/frame.js";
import * as page from "../constructors/page.js";
import * as svg from "../constructors/svg.js";
import * as lookup from "../utilities/lookup.js"
import * as bevelledBox from "../constructors/bevelledBox.js"
import * as programmableButton from "../constructors/programmableButton.js"

export function create(top,left){
    let lookupEditPage = page.create("lookupEditPage", top, left)

    //Header
    let headerAsset = svg.create("lookupEditPageHeader", -134, -20, 650, 400, "headerP4.svg", "lookupEditPage")
    headerAsset.style.setProperty("z-index", "-10")
    

    let characterName = sync.syncDecorator("characterName", formfield.singleLine("lookupEditPageName", 61, 23, 185, 23, "lookupEditPage", undefined, "center", undefined))
    let statsPageNameText = text.create("lookupEditPageNameText", "CHARACTER NAME", 93, 30, 100, 8, "lookupEditPage", undefined, undefined, undefined, "center")


    let characterInfoSyncDecorators = ["age", "skin", "weight", "eyes", "height", "hair"]
    let characterInfoFormFieldIds = ["age", "skin", "weight", "eyes", "height", "hair"]
    let characterInfotextContents =["AGE", "SKIN", "WEIGHT", "EYES", "HEIGHT", "HAIR"]
    for (let i = 0; i<6; i++){
        sync.syncDecorator(characterInfoSyncDecorators[i],
            formfield.singleLine(characterInfoFormFieldIds[i]+"LookupEditPage", 46 + i%2 * 29, 272 + i%3 * 110, 100, 16, "lookupEditPage", undefined, "Left", 13)
        )
        text.create(characterInfoFormFieldIds+"TextlookupEditPage", characterInfotextContents[i], 63 + i%2 * 29, 272 + i%3 * 110, 100, 8, "lookupEditPage", "Scalasanslight", undefined, undefined, "left")
    }

    frame.create("lookupAppendFrameLookupEditPage", 120, 5, 620, 155, "lookupEditPage", "CHANGE CUSTOM LOOKUP", undefined, undefined, false)
    text.create("keyTextLookupEditPage", "KEY", 7, 10, 125, 10, "lookupAppendFrameLookupEditPage", undefined, undefined, undefined, "left")
    calc.calcDecorator(sync.syncDecorator("key",formfield.singleLine("keyLookupEditPage", 19, 10, 130, 25, "lookupAppendFrameLookupEditPage", undefined, "left", undefined, undefined)))
    text.create("bodyTextLookupEditPage", "BODY", 7, 140, 125, 10, "lookupAppendFrameLookupEditPage", undefined, undefined, undefined, "left")
    calc.calcDecorator(sync.syncDecorator("body",formfield.create("bodyLookupEditPage", 19,143, 467, 120, "lookupAppendFrameLookupEditPage",undefined, "left", undefined)))
    programmableButton.create("addLookupLookupEditPage", 48, 10, 130, 20, "lookupAppendFrameLookupEditPage", undefined, "add custom entry", 12, "center", "lookup.appendLookup(document.getElementById('keyLookupEditPage').value, document.getElementById('bodyLookupEditPage').value )== 'success' ? document.getElementById('statusButtonLookupLookupEditPage').style.background = 'green' : document.getElementById('statusButtonLookupLookupEditPage').style.background = 'red'")
    programmableButton.create("removeLookupLookupEditPage", 72, 10, 130, 20, "lookupAppendFrameLookupEditPage", undefined, "remove custom entry", 12, "center", "lookup.removeLookup(document.getElementById('keyLookupEditPage').value)== 'success' ? document.getElementById('statusButtonLookupLookupEditPage').style.background = 'green' : document.getElementById('statusButtonLookupLookupEditPage').style.background = 'red'")
    programmableButton.create("clearFieldsLookupLookupEditPage", 96, 10, 130, 20, "lookupAppendFrameLookupEditPage", undefined, "clear fields", 12, "center", "document.getElementById('keyLookupEditPage').textContent = ''; document.getElementById('bodyLookupEditPage').textContent = '';document.getElementById('statusButtonLookupLookupEditPage').style.background = '#c5c6c7'")
    programmableButton.create("statusButtonLookupLookupEditPage", 120, 10, 130, 19, "lookupAppendFrameLookupEditPage", undefined, "STATUS", 12, "center", "")


    frame.create("featuresLookuplookupEditPage", 510, 215, 410, 380, "lookupEditPage", "FEATURES & TRAITS LOOKUP", undefined, undefined, false)
    calc.calcDecorator(sync.syncDecorator("featureLookUpClasslookupEditPage",formfield.singleLine("featureLookUpClasslookupEditPage", 19,10, 125, 25, "featuresLookuplookupEditPage", undefined, "left", undefined, undefined)))
    calc.calcDecorator(sync.syncDecorator("featureLookUpSubclasslookupEditPage",formfield.singleLine("featureLookUpSubclasslookupEditPage", 19,140, 125, 25, "featuresLookuplookupEditPage", undefined, "left", undefined, undefined)))
    calc.calcDecorator(sync.syncDecorator("featureLookUpFeaturelookupEditPage",formfield.singleLine("featureLookUpFeaturelookupEditPage", 19,270, 130, 25, "featuresLookuplookupEditPage", undefined, "left", undefined, undefined)))
    text.create("featureLookUpClasslookupEditPageText", "CLASS", 7, 10, 125, 10, "featuresLookuplookupEditPage", undefined, undefined, undefined, "left")
    text.create("featureLookUpSubclasslookupEditPageText", "SUBCLASS", 7, 140, 125, 10, "featuresLookuplookupEditPage", undefined, undefined, undefined, "left")
    text.create("featureLookUpFeaturelookupEditPageText", "FEATURE", 7, 270, 125, 10, "featuresLookuplookupEditPage", undefined, undefined, undefined, "left")
    calc.calcDecorator(sync.syncDecorator("featureLookuplookupEditPage",formfield.create("featureLookuplookupEditPage", 49,10, 390, 380-13-49, "featuresLookuplookupEditPage", undefined, "left", undefined, "⟨features,[featureLookUpClasslookupEditPage],{('[featureLookUpSubclasslookupEditPage]'=='0')?'base':'[featureLookUpSubclasslookupEditPage]'},[featureLookUpFeaturelookupEditPage],description⟩")))

    frame.create("lookupAllKeysFrameLookupEditPage", 285, 5, 620, 215, "lookupEditPage", "CURRENT KEYS IN LOOKUP", "CurrentKeysLookupEditPage", undefined, true)
    document.getElementById("lookupAllKeysFrameLookupEditPage").textContent = "Current keys in your custom lookup table are:\n{lookup.getKeys('custom')}"

    frame.create("lookupFrameLookupEditPage", 510, 5, 200, 380, "lookupEditPage", "LOOKUP", undefined, undefined, false)
    calc.calcDecorator(formfield.create("lookupKeyLookupEditPage", 7,10,180,20, "lookupFrameLookupEditPage", undefined, undefined, undefined, undefined))
    calc.calcDecorator(formfield.create("lookupResultLookupEditPage",30,10,180,336, "lookupFrameLookupEditPage", "#c5c6c7", undefined, undefined, "{('[lookupKeyLookupEditPage]'!=0) ? '[lookupKeyLookupEditPage]':'Enter custom feature above';}\n\n⟨custom,[lookupKeyLookupEditPage]⟩"))
};

