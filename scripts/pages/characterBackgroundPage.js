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

export function create(top,left){
    let backgroundPage = page.create("backgroundPage", top, left)

    //Header
    let headerAsset = svg.create("backgroundPageHeader", -134, -20, 650, 400, "headerP4.svg", "backgroundPage")
    headerAsset.style.setProperty("z-index", "-10")
    

    let characterName = sync.syncDecorator("characterName", formfield.singleLine("backgroundPageName", 61, 23, 185, 23, "backgroundPage", undefined, "center", undefined))
    let statsPageNameText = text.create("statsPageNameText", "CHARACTER NAME", 93, 30, 100, 8, "backgroundPage", undefined, undefined, undefined, "center")


    let characterInfoSyncDecorators = ["age", "skin", "weight", "eyes", "height", "hair"]
    let characterInfoFormFieldIds = ["age", "skin", "weight", "eyes", "height", "hair"]
    let characterInfotextContents =["AGE", "SKIN", "WEIGHT", "EYES", "HEIGHT", "HAIR"]
    for (let i = 0; i<6; i++){
        sync.syncDecorator(characterInfoSyncDecorators[i],
            formfield.singleLine(characterInfoFormFieldIds[i], 46 + i%2 * 29, 272 + i%3 * 110, 100, 16, "backgroundPage", undefined, "Left", 13)
        )
        text.create(characterInfoFormFieldIds+"Text", characterInfotextContents[i], 63 + i%2 * 29, 272 + i%3 * 110, 100, 8, "backgroundPage", "Scalasanslight", undefined, undefined, "left")
    }

    frame.create("backstory", 120, 5, 410, 380, "backgroundPage", "BACKSTORY", "backstory", undefined, true)
    bevelledBox.create("characterBevelledBox", 120, 425, 200, 380, undefined, "backgroundPage", "c5c6c7")
    frame.create("allies&organisations", 510, 5, 200, 380, "backgroundPage", "BACKSTORY", "backstory", undefined, true)
    let characterQuestions = ["personalityTraits", "ideals", "bonds", "flaws"]
    let characterQuestionsText = ["PERSONALITY TRAITS", "IDEALS", "BONDS", "FLAWS"]
    for (let i=0; i<4; i++){
        frame.create (characterQuestions[i], 6 + i* 93, 5, 190, 88, "characterBevelledBox", characterQuestionsText[i], characterQuestions[i], undefined, true)
    }

    frame.create("featuresLookupBackgroundPage", 510, 215, 410, 380, "backgroundPage", "FEATURES & TRAITS LOOKUP", undefined, undefined, false)
    calc.calcDecorator(sync.syncDecorator("featureLookUpClassBackgroundPage",formfield.singleLine("featureLookUpClassBackgroundPage", 19,10, 125, 25, "featuresLookupBackgroundPage", undefined, "left", undefined, undefined)))
    calc.calcDecorator(sync.syncDecorator("featureLookUpSubclassBackgroundPage",formfield.singleLine("featureLookUpSubclassBackgroundPage", 19,140, 125, 25, "featuresLookupBackgroundPage", undefined, "left", undefined, undefined)))
    calc.calcDecorator(sync.syncDecorator("featureLookUpFeatureBackgroundPage",formfield.singleLine("featureLookUpFeatureBackgroundPage", 19,270, 130, 25, "featuresLookupBackgroundPage", undefined, "left", undefined, undefined)))
    text.create("featureLookUpClassBackgroundPageText", "CLASS", 7, 10, 125, 10, "featuresLookupBackgroundPage", undefined, undefined, undefined, "left")
    text.create("featureLookUpSubclassBackgroundPageText", "SUBCLASS", 7, 140, 125, 10, "featuresLookupBackgroundPage", undefined, undefined, undefined, "left")
    text.create("featureLookUpFeatureBackgroundPageText", "FEATURE", 7, 270, 125, 10, "featuresLookupBackgroundPage", undefined, undefined, undefined, "left")
    calc.calcDecorator(sync.syncDecorator("featureLookupBackgroundPage",formfield.create("featureLookupBackgroundPage", 49,10, 390, 380-13-49, "featuresLookupBackgroundPage", undefined, "left", undefined, "{('[featureLookUpSubclassBackgroundPage]'!=0) ? '':'Lookup any class feature in this field.\\nEnter any 5e class.\\nEnter BASE for subclass for base features';}⟨features,[featureLookUpClassBackgroundPage],[featureLookUpSubclassBackgroundPage],[featureLookUpFeatureBackgroundPage],description⟩")))
};

