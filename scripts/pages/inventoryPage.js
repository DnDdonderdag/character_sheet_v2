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

    //Header
    let headerAsset = svg.create("headerInventoryPage", -133, -35, 670, 400, "headerP5.svg", "inventoryPage")
    formfield.singleLine("nameInventoryPage", 210, 60, 130, 26, "headerInventoryPage", undefined, "center", undefined, undefined)
    text.create("containerInventoryPage", "INVENTORY CONTAINER", 242, 60, 130, 8, "headerInventoryPage", undefined, undefined, undefined, "left")
    svg.create("headerInventoryPageTab1", 170, 260, 170, 40, "inventorytabTop.svg", "headerInventoryPage")
    text.create("hederInventoryPageText1", "MAX CARRY WEIGHT", 13, 55, 110 ,10, "headerInventoryPageTab1", undefined, undefined, 9, "center")
    sync.syncDecorator("hederInventoryPageForm1",calc.calcDecorator(formfield.singleLine("hederInventoryPageForm1", 9, 8, 30, 22, "headerInventoryPageTab1", undefined, "center", undefined, undefined)))
    svg.create("headerInventoryPageTab2", 207, 260, 170, 30, "inventorytabBottom.svg", "headerInventoryPage")
    text.create("headerInventoryPageText2", "CURRENT CARRY WEIGHT", 11, 55, 110 ,10, "headerInventoryPageTab2", undefined, undefined, 9, "center")
    sync.syncDecorator("hederInventoryPageForm2",calc.calcDecorator(formfield.singleLine("hederInventoryPageForm2", 4, 8, 30, 22, "headerInventoryPageTab2", undefined, "center", undefined, undefined)))
    svg.create("headerInventoryPageTab3", 170, 450, 170, 40, "inventorytabTop.svg", "headerInventoryPage")
    text.create("headerInventoryPageText3", "CURRENT YEAR", 13, 55, 110 ,10, "headerInventoryPageTab3", undefined, undefined, 9, "center")
    sync.syncDecorator("hederInventoryPageForm3",calc.calcDecorator(formfield.singleLine("hederInventoryPageForm3", 9, 8, 30, 22, "headerInventoryPageTab3", undefined, "center", undefined, undefined)))
    svg.create("headerInventoryPageTab4", 207, 450, 170, 30, "inventorytabBottom.svg", "headerInventoryPage")
    text.create("headerInventoryPageText4", "CURRENT DAY", 11, 55, 110 ,10, "headerInventoryPageTab4", undefined, undefined, 9, "center")
    sync.syncDecorator("hederInventoryPageForm4",calc.calcDecorator(formfield.singleLine("hederInventoryPageForm4", 4, 8, 30, 22, "headerInventoryPageTab4", undefined, "center", undefined, undefined)))

    //Misc & shopping list
    frame.create("misc&shoppingFrameInventoryPage", 120,5,305, 185, "inventoryPage", undefined, undefined, undefined,false)
    text.create("miscellaneousTextInventoryPage", "MISCELLANEOUS", 172, 0, 152, 8, "misc&shoppingFrameInventoryPage", undefined, undefined, undefined, "center")
    text.create("shoppingListTextInventoryPage", "SHOPPING LIST", 172, 153, 152, 8, "misc&shoppingFrameInventoryPage", undefined, undefined, undefined, "center")
    sync.syncDecorator("miscellaneous", calc.calcDecorator(formfield.create("miscellaneousInventory", 7, 10, 139, 165, "misc&shoppingFrameInventoryPage", undefined, undefined, undefined, undefined)))
    sync.syncDecorator("shoppingList", calc.calcDecorator(formfield.create("shoppingListInventory", 7, 155, 139, 165, "misc&shoppingFrameInventoryPage", undefined, undefined, undefined, undefined)))

    
    //Funds
    frame.create("fundsFrameInventorypage", 120, 320, 140, 185, "inventoryPage", "FUNDS", undefined, undefined,false)
    text.create("personalFundsTextInventoryPage", "PERSONAL", 10,2,70, 8, "fundsFrameInventorypage", undefined, undefined, undefined, "center")
    text.create("partyFundsTextInventoryPage", "PARTY", 10,68,70, 8, "fundsFrameInventorypage", undefined, undefined, undefined, "center")
    let moneyList = ["CP", "SP", "EP", "GP", "PP"]
    for(let i=0; i<5; i++){
        svg.create("personal"+moneyList[i]+"AssetInventoryPage", 120+20 + 30*i, 320+ -10, 80, 28, "funds"+moneyList[i]+".svg", "inventoryPage")
        document.getElementById("personal"+moneyList[i]+"AssetInventoryPage").style.setProperty("z-index", "100")
        text.create("personal"+moneyList[i]+"TextInventoryPage", moneyList[i], 120+30 + 30*i,320 - 1, 10, 8, "inventoryPage", undefined, undefined, undefined, "center")
        calc.calcDecorator(sync.syncDecorator("personal"+moneyList[i], formfield.singleLine("personal"+moneyList[i]+"InventoryPage", 4, 30, 34, 20, "personal"+moneyList[i]+"AssetInventoryPage", undefined, "center", undefined, undefined)))

        svg.create("party"+moneyList[i]+"AssetInventoryPage", 120+20 + 30*i, 320+140-80 +10, 80, 28, "funds"+moneyList[i]+".svg", "inventoryPage")
        document.getElementById("party"+moneyList[i]+"AssetInventoryPage").style.setProperty("z-index", "100")
        document.getElementById("party"+moneyList[i]+"AssetInventoryPage").style.setProperty("transform", "scale(-1,1)")
        text.create("party"+moneyList[i]+"TextInventoryPage", moneyList[i], 120+30 + 30*i,320+140 -10 + 1, 10, 8, "inventoryPage", undefined, undefined, undefined, "center")
        let partyFund = calc.calcDecorator(sync.syncDecorator("party"+moneyList[i], formfield.singleLine("party"+moneyList[i]+"InventoryPage", 4, 30, 34, 20, "party"+moneyList[i]+"AssetInventoryPage", undefined, "center", undefined, undefined)))
        partyFund.style.setProperty("transform", "scale(-1,1)")
    }

    //Essential items
    frame.create("essentialItemsFrameInventorypage", 120, 470, 155, 185, "inventoryPage", "ESSENTIAL ITEMS", undefined, undefined,false)
    for(let i = 0; i<5; i++){
        svg.create("essentialItemAsset"+String(i), 10 + 32*i, 10, 135, 30, "essentialItemTab.svg", "essentialItemsFrameInventorypage")
        formfield.singleLine("essentialItemAmount"+String(i), 4, 8, 36, 22, "essentialItemAsset"+String(i), undefined, "center", undefined, undefined)
        formfield.singleLine("essentialItemType"+String(i), 6, 62, 63, 18, "essentialItemAsset"+String(i), undefined, "left", 12, undefined)
    }
    
    //Potions
    frame.create("potionsInventoryPage", 315, 5, 200, 200, "inventoryPage", "POTIONS", "potions", "left", true)

    //Quest items
    frame.create("questItemsInventoryPage", 315, 215, 200, 200, "inventoryPage", "QUEST ITEMS", "questItems", "left", true)

    //Armor
    frame.create("armorFrameInventoryPage", 315, 435, 190, 200, "inventoryPage", "ARMOR", undefined, undefined, false)
    for(let i=0; i<4; i++){
        sync.syncDecorator("ACvalueInventoryPage"+String(i), calc.calcDecorator(formfield.singleLine("ACvalueInventoryPage"+String(i), 7 + 45*i, 22, 42, 42, "armorFrameInventoryPage", "#c5c6c7", "center", 25, undefined)))
        sync.syncDecorator("armorTypeInventoryPage"+String(i), calc.calcDecorator(formfield.singleLine("armorTypeInventoryPage"+String(i), 7 + 45*i, 65, 112, 42, "armorFrameInventoryPage", undefined, "left", undefined, undefined)))
        sync.syncDecorator("armorEquippedInventoryPage"+String(i), button.tickbox("armorEquippedInventoryPage"+String(i), 39 + 45*i, 11, 8,8, "armorFrameInventoryPage", undefined))
        let line = document.createElement("div")
        line.id = "armorLineAsset"+String(i)
        line.className = "spellLineAsset"
        line.style.setProperty("top", 49 + 45*i +"px")
        line.style.setProperty("width", "170px")
        line.style.setProperty("left", "10px")
        document.getElementById("armorFrameInventoryPage").appendChild(line)
    }

    //Weapons
    frame.create("weaponsFrameInventoryPage", 525, 435, 190, 200, "inventoryPage", "WEAPONS", undefined, undefined, false)
    for(let i=0; i<4; i++){
        sync.syncDecorator("weapon"+String(i), calc.calcDecorator(formfield.singleLine("weaponTypeInventoryPage"+String(i), 7 + 45*i, 22, 155, 42, "weaponsFrameInventoryPage", undefined, "left", undefined, undefined)))
        sync.syncDecorator("weaponEquippedInventoryPage"+String(i), button.tickbox("weaponEquippedInventoryPage"+String(i), 39 + 45*i, 11, 8,8, "weaponsFrameInventoryPage", undefined))
        let line = document.createElement("div")
        line.id = "weaponLineAsset"+String(i)
        line.className = "spellLineAsset"
        line.style.setProperty("top", 49 + 45*i +"px")
        line.style.setProperty("width", "170px")
        line.style.setProperty("left", "10px")
        document.getElementById("weaponsFrameInventoryPage").appendChild(line)
    }

    //Attunements
    frame.create("attunementsFrameInventoryPage", 735, 435, 190, 155, "inventoryPage", "ATTUNEMENTS", undefined, undefined, false)
    for(let i=0; i<3; i++){
        sync.syncDecorator("attunementTypeInventoryPage"+String(i), calc.calcDecorator(formfield.singleLine("attunementTypeInventoryPage"+String(i), 7 + 45*i, 22, 155, 42, "attunementsFrameInventoryPage", undefined, "left", undefined, undefined)))
        sync.syncDecorator("attunementEquippedInventoryPage"+String(i), button.tickbox("attunementEquippedInventoryPage"+String(i), 39 + 45*i, 11, 8,8, "attunementsFrameInventoryPage", undefined))
        let line = document.createElement("div")
        line.id = "attunementLineAsset"+String(i)
        line.className = "spellLineAsset"
        line.style.setProperty("top", 49 + 45*i +"px")
        line.style.setProperty("width", "170px")
        line.style.setProperty("left", "10px")
        document.getElementById("attunementsFrameInventoryPage").appendChild(line)
    }

    //Treasures
    frame.create("treasureFrameInventoryPage", 525, 5, 410, 365, "inventoryPage", "TREASURES", undefined, undefined, false)
    sync.syncDecorator("treasures1", calc.calcDecorator(formfield.create("treasures1Inventory", 7, 10, 192, 343, "treasureFrameInventoryPage", undefined, undefined, undefined, undefined)))
    sync.syncDecorator("treasures2", calc.calcDecorator(formfield.create("treasures2Inventory", 7, 208, 192, 343, "treasureFrameInventoryPage", undefined, undefined, undefined, undefined)))

    
    

};

