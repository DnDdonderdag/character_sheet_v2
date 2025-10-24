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
    let notesPage = page.create("notesPage", top, left)

    //Header
    let headerAsset = svg.create("notesPageHeader", -134, -20, 650, 400, "headerP4.svg", "notesPage")
    headerAsset.style.setProperty("z-index", "-10")
    
    let characterName = sync.syncDecorator("characterName", formfield.singleLine("notesPageName", 61, 23, 185, 23, "notesPage", undefined, "center", undefined))
    let statsPageNameText = text.create("notesPageNameText", "CHARACTER NAME", 93, 30, 100, 8, "notesPage", undefined, undefined, undefined, "center")


    let characterInfoSyncDecorators = ["age", "skin", "weight", "eyes", "height", "hair"]
    let characterInfoFormFieldIds = ["ageNotesPage", "skinNotesPage", "weightNotesPage", "eyesNotesPage", "heightNotesPage", "hairNotesPage"]
    let characterInfotextContents =["AGE", "SKIN", "WEIGHT", "EYES", "HEIGHT", "HAIR"]
    for (let i = 0; i<6; i++){
        sync.syncDecorator(characterInfoSyncDecorators[i],
            formfield.singleLine(characterInfoFormFieldIds[i], 46 + i%2 * 29, 272 + i%3 * 110, 100, 16, "notesPage", undefined, "Left", 13)
        )
        text.create(characterInfoFormFieldIds[i]+"TextNotesPage", characterInfotextContents[i], 63 + i%2 * 29, 272 + i%3 * 110, 100, 8, "notesPage", "Scalasanslight", undefined, undefined, "left")
    }

    let notesSyncDecorators = ["general", "locations", "npcs", "quests", "lore"]
    let notesFormFieldIds = ["generalNotesPage", "locationsNotesPage", "npcsNotesPage", "questsNotesPage", "loreNotesPage"]
    let notesInfotextContents = ["GENERAL", "LOCATIONS", "NPCS", "QUESTS", "LORE"]
    for(let i = 0; i < 5; i++){
        frame.create(notesFormFieldIds[i], 120 + 156*i, 5, 620, 146, "notesPage", notesInfotextContents[i], notesSyncDecorators[i], "left", true)
    }


};

