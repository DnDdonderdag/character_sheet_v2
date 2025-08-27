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
import * as imageHolder from "../constructors/imageHolder.js"
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
    frame.create("allies&organisations", 510, 5, 200, 380, "backgroundPage", "ALLIES & ORGANISATIONS", "alliesAndOrganisations", undefined, true)
    let characterQuestions = ["personalityTraits", "ideals", "bonds", "flaws"]
    let characterQuestionsText = ["PERSONALITY TRAITS", "IDEALS", "BONDS", "FLAWS"]
    for (let i=0; i<4; i++){
        frame.create (characterQuestions[i], 6 + i* 93, 5, 190, 88, "characterBevelledBox", characterQuestionsText[i], characterQuestions[i], undefined, true)
    }

    frame.create("characterAppearanceBackgroundPage", 510, 215, 410, 380, "backgroundPage", "CHARACTER APPEARANCE", undefined, undefined, false)
    imageHolder.create("characterImageBackgroundPage", 5,10, 390, 361, "characterAppearanceBackgroundPage", "data:image/png;base64,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")
};

