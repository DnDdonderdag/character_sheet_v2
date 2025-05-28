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
    let inventoryPage = page.create("inventoryPage", top, left)

    let headerAsset = svg.create("headerInventoryPage", -133, -35, 670, 400, "headerP5.svg", "inventoryPage")

    frame.create("misc&shoppingFrameInventoryPage", 120,5,305, 185, "inventoryPage", undefined, undefined, undefined,false)


    frame.create("fundsFrameInventorypage", 120, 320, 140, 185, "inventoryPage", "FUNDS", undefined, undefined,false)


    frame.create("essentialItemsFrameInventorypage", 120, 470, 155, 185, "inventoryPage", "ESSENTIAL ITEMS", undefined, undefined,false)


    frame.create("potionsInventoryPage", 315, 5, 200, 200, "inventoryPage", "POTIONS", "potions", "left", true)


    frame.create("questItemsInventoryPage", 315, 215, 200, 200, "inventoryPage", "QUEST ITEMS", "questItems", "left", true)


    frame.create("armorFrameInventoryPage", 315, 435, 190, 200, "inventoryPage", "ARMOR", undefined, undefined, false)


    frame.create("weaponsFrameInventoryPage", 525, 435, 190, 200, "inventoryPage", "WEAPONS", undefined, undefined, false)


    frame.create("attunementsFrameInventoryPage", 735, 435, 190, 155, "inventoryPage", "ATTUNEMENTS", undefined, undefined, false)


    frame.create("treasureFrameInventoryPage", 525, 5, 410, 365, "inventoryPage", "TREASURES", undefined, undefined, false)

    
    

};

