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
    let spellListPage = page.create("spellListPage", top, left)

    svg.create("headerSpellListPage", -146,-20, 650, 400, "headerP2.svg", "spellListPage")

    let spellcastingClass = 
        sync.syncDecorator("spellcastingClass",
            formfield.singleLine("spellcastingClassSpellListPage", 61, 23, 185, 23, "spellListPage", undefined, "center", undefined)
        )
    let statsPageNameText = text.create("spellcastingClassTextSpellListPage", "SPELLCASTING CLASS", 93, 47, 60, 8, "spellListPage", undefined, undefined, undefined, "left")
    
    let preparedSpellAmount = sync.syncDecorator("preparedSpellAmount",calc.calcDecorator(formfield.singleLine("preparedSpellAmountSpellList", 195, 295, 68, 30, "headerSpellListPage", undefined, "center", 20)))
    let spellcastingAbility = sync.syncDecorator("spellcastingAbility",calc.calcDecorator(formfield.singleLine("spellcastingAbilitySpellList", 195, 378, 68, 30, "headerSpellListPage", undefined, "center", 20)))
    let spellSaveDC = sync.syncDecorator("spellSaveDC",calc.calcDecorator(formfield.singleLine("spellSaveDCSpellList", 195, 462, 68, 30, "headerSpellListPage", undefined, "center", 20)))
    let spellAttackBonus = sync.syncDecorator("spellAttackBonus",calc.calcDecorator(formfield.singleLine("spellAttackBonusSpellList", 195, 546, 68, 30, "headerSpellListPage", undefined, "center", 20)))
    
    text.create("preparedSpellAmountTextSpellListPage", "PREPARED SPELL AMOUNT", 230, 295, 68, 20, "headerSpellListPage", undefined, undefined, 8, "center")
    text.create("spellcastingAbilityTextSpellListPage", "SPELLCASTING ABILITY", 230, 378, 68, 20, "headerSpellListPage", undefined, undefined, 8, "center")
    text.create("spellSaveDCTextSpellListPage", "SPELL SAVE DC", 230, 462, 68, 20, "headerSpellListPage", undefined, undefined, 8, "center")
    text.create("spellAttackBonusTextSpellListPage", "SPELL ATTACK BONUS", 230, 546, 68, 20, "headerSpellListPage", undefined, undefined, 8, "center")


    preparedSpellAmount.textContent = "0"
    spellcastingAbility.textContent = "INT"
    spellSaveDC.textContent = "{8+[prof]+{'[[spellcastingAbilitySpellList]mod]'.substring(1)}}"
    spellAttackBonus.textContent = "{[prof]+{'[[spellcastingAbilitySpellList]mod]'.substring(1)}}"

    for (let i=0; i<3; i++){
        svg.create("spellListFrame"+String(i)+"SpellListPage", 55, 5+207*i, 207, 900, "spellListFrame.svg", "spellListPage")
        document.getElementById("spellListFrame"+String(i) + "SpellListPage").style.setProperty("transform", "scale(1,1.095)")
    }

    function createSpellBar(level, top, parent, lineAmount){
        if (level == 0){
            let cantripAsset = svg.create("cantripBarAssetSpellListPage", top, 5, 197, 50, "spellBarCantrip.svg", parent)
            text.create("cantripTextSpellListPage", "0", 12, 5, 10, 20, "cantripBarAssetSpellListPage", undefined, undefined, undefined, "center")
            text.create("cantripSpellTextSpellListPage", "CANTRIPS", 19, 30, 150, 10, "cantripBarAssetSpellListPage", undefined, undefined, 10, "center")
            for(let j=0; j<lineAmount; j++){

                let spellLine = sync.syncDecorator("spellLine"+String(j)+"Level"+level,calc.calcDecorator(formfield.singleLine("spellLine"+String(j)+"Level"+level+"SpellList", 45 + 12 * j, 12, 180, 11, "cantripBarAssetSpellListPage", undefined, "left", 11, undefined)))
                let line = document.createElement("div")
                line.id = "spellLine"+String(j)+"Level"+level+"Asset"
                line.className = "spellLineAsset"
                line.style.setProperty("top", 56 + 12 * j +"px")
                line.style.setProperty("transform", "scale(1,calc(1/1.095))")
                spellLine.style.setProperty("transform", "scale(1,calc(1/1.095))")
                cantripAsset.appendChild(line)
            }
        } else{
            let SpellBarAsset = svg.create("level"+level+"SpellBarAssetSpellListPage", top, 5, 197, 50, "spellBar.svg", parent)
            text.create("level"+level+"TextSpellListPage", String(level), 12, 5, 10, 20, "level"+level+"SpellBarAssetSpellListPage", undefined, undefined, undefined, "center")
            for (let i=0; i<4; i++){
                let spellLineCheckmark = sync.syncDecorator("spellCheckmark"+String(i)+"Level"+level, button.checkmark("level"+level+"SpellCheckMark"+String(i)+"SpellList", 16, 90 + i* 24, 18, 18, "level"+level+"SpellBarAssetSpellListPage", undefined))
                spellLineCheckmark.style.setProperty("transform", "scale(1,calc(1/1.095))")
            }
            sync.syncDecorator("spellAmountLevel"+level, formfield.singleLine("spellAmountLevel"+level+"SpellList", 14, 23, 45,  22, "level"+level+"SpellBarAssetSpellListPage", undefined, "center", undefined))
            for(let j=0; j<lineAmount; j++){

                let spellLine = sync.syncDecorator("spellLine"+String(j)+"Level"+level,calc.calcDecorator(formfield.singleLine("spellLine"+String(j)+"Level"+level+"SpellList", 48 + 12 * j, 12, 180, 10, "level"+level+"SpellBarAssetSpellListPage", undefined, "left", 11, undefined)))
                let line = document.createElement("div")
                line.id = "spellLine"+String(j)+"Level"+level+"Asset"
                line.className = "spellLineAsset"
                line.style.setProperty("top", 58 + 12 * j +"px")
                line.style.setProperty("left", 12+"px")
                line.style.setProperty("width", "183px")
                line.style.setProperty("transform", "scale(1,calc(1/1.095))")
                spellLine.style.setProperty("transform", "scale(1,calc(1/1.095))")
                SpellBarAsset.appendChild(line)

                let spellLineButton = button.tickbox("button"+String(j)+"Level"+level,  50 + 12 * j, 2, 8, 8, "level"+level+"SpellBarAssetSpellListPage", undefined)
                spellLineButton.style.setProperty("transform", "scale(1,calc(1/1.095))")
            
            }
        }
    }
    //57 lines total
    //1 bar = 4 lines
    //top = 107 + 4*12*bars + 12*lines

    createSpellBar(0, 107, "spellListFrame0SpellListPage", 8)
    createSpellBar(1, 107+4*12*1+8*12, "spellListFrame0SpellListPage", 19)
    createSpellBar(2, 107+4*12*2+(8+19)*12, "spellListFrame0SpellListPage", 18)
    createSpellBar(3, 107, "spellListFrame1SpellListPage", 16)
    createSpellBar(4, 107+4*12*1+16*12, "spellListFrame1SpellListPage", 15)
    createSpellBar(5, 107+4*12*2+(16+15)*12, "spellListFrame1SpellListPage", 14)
    createSpellBar(6, 107, "spellListFrame2SpellListPage", 12)
    createSpellBar(7, 107+4*12*1+12*12, "spellListFrame2SpellListPage", 11)
    createSpellBar(8, 107+4*12*2+(12+11)*12, "spellListFrame2SpellListPage", 10)
    createSpellBar(9, 107+4*12*3+(12+11+10)*12, "spellListFrame2SpellListPage", 8)
};

