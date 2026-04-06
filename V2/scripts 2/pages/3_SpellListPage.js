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
import * as spellbar from "../constructors/spellbar.js"


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
    spellcastingAbility.textContent = ""
    spellSaveDC.textContent = ""
    spellAttackBonus.textContent = ""

    for (let i=0; i<3; i++){
        svg.create("spellListFrame"+String(i)+"SpellListPage", 55, 5+207*i, 207, 900, "spellListFrame.svg", "spellListPage")
        document.getElementById("spellListFrame"+String(i) + "SpellListPage").style.setProperty("transform", "scale(1,1.095)")
    }
    calc.calcDecorator(formfield.create("disappearMe", 0,0,0,0,"spellListPage",undefined, undefined, 8, "{document.getElementById('spellListFrame0SpellListPage').style.setProperty('transform', 'scale(1,1.095)')\ndocument.getElementById('spellListFrame1SpellListPage').style.setProperty('transform', 'scale(1,1.095)')\ndocument.getElementById('spellListFrame2SpellListPage').style.setProperty('transform', 'scale(1,1.095)')}"))
    
    
    //57 lines total
    //1 bar = 4 lines
    //top = 107 + 4*12*bars + 12*lines

    spellbar.create3_5(0, 107, 5, "spellListFrame0SpellListPage", 12, true, "spellListPage")
    spellbar.create3_5(1, 107+4*12*1+12*12, 5, "spellListFrame0SpellListPage", 17, true, "spellListPage")
    spellbar.create3_5(2, 107+4*12*2+(12+17)*12, 5, "spellListFrame0SpellListPage", 16, true, "spellListPage")
    spellbar.create3_5(3, 107, 5, "spellListFrame1SpellListPage", 16, true, "spellListPage")
    spellbar.create3_5(4, 107+4*12*1+16*12, 5, "spellListFrame1SpellListPage", 15, true, "spellListPage")
    spellbar.create3_5(5, 107+4*12*2+(16+15)*12, 5, "spellListFrame1SpellListPage", 14, true, "spellListPage")
    spellbar.create3_5(6, 107, 5, "spellListFrame2SpellListPage", 12, true, "spellListPage")
    spellbar.create3_5(7, 107+4*12*1+12*12, 5, "spellListFrame2SpellListPage", 11, true, "spellListPage")
    spellbar.create3_5(8, 107+4*12*2+(12+11)*12, 5, "spellListFrame2SpellListPage", 10, true, "spellListPage")
    spellbar.create3_5(9, 107+4*12*3+(12+11+10)*12, 5, "spellListFrame2SpellListPage", 8, true, "spellListPage")
};

