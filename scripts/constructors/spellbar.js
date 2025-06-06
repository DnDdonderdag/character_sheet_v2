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

export function create(level, top, left, parent, lineAmount, lineBool, idAddition){
    lineBool = (lineBool === undefined || lineBool === null) ? true : lineBool;
    idAddition = (idAddition === undefined || idAddition === null) ? "" : idAddition;

    if (level == 0){
        let cantripAsset = svg.create("cantripBarAsset"+idAddition, top, left, 197, 50, "spellBarCantrip.svg", parent)
        text.create("cantripText"+idAddition, "0", 12, 5, 10, 20, "cantripBarAsset"+idAddition, undefined, undefined, undefined, "center")
        text.create("cantripSpellText"+idAddition, "CANTRIPS", 19, 30, 150, 10, "cantripBarAsset"+idAddition, undefined, undefined, 10, "center")
        if (lineBool){
            for(let j=0; j<lineAmount; j++){

                let spellLine = sync.syncDecorator("spellLine"+String(j)+"Level"+level,calc.calcDecorator(formfield.singleLine("spellLine"+String(j)+"Level"+level+idAddition, 45 + 12 * j, 12, 180, 11, "cantripBarAsset"+idAddition, undefined, "left", 9, undefined)))
                let line = document.createElement("div")
                line.id = "spellLine"+String(j)+"Level"+level+"Asset"+idAddition
                line.className = "spellLineAsset"
                line.style.setProperty("top", 56 + 12 * j +"px")
                if(idAddition == "spellListPage"){
                    line.style.setProperty("transform", "scale(1,calc(1/1.095))")
                    spellLine.style.setProperty("transform", "scale(1,calc(1/1.095))")
                }
                cantripAsset.appendChild(line)
            }
        }
        
    } else{
        let SpellBarAsset = svg.create("level"+level+"SpellBarAsset"+idAddition, top, left, 197, 50, "spellbar.svg", parent)
        text.create("level"+level+"Text"+idAddition, String(level), 12, 5, 10, 20, "level"+level+"SpellBarAsset"+idAddition, undefined, undefined, undefined, "center")
        for (let i=0; i<4; i++){
            let spellLineCheckmark = sync.syncDecorator("spellCheckmark"+String(i)+"Level"+level, button.checkmark("level"+level+"SpellCheckMark"+String(i)+idAddition, 16, 90 + i* 24, 18, 18, "level"+level+"SpellBarAsset"+idAddition, undefined))
            if(idAddition == "spellListPage"){
                spellLineCheckmark.style.setProperty("transform", "scale(1,calc(1/1.095))")
            }
        }
        sync.syncDecorator("spellAmountLevel"+level, formfield.singleLine("spellAmountLevel"+level+idAddition, 14, 23, 45,  22, "level"+level+"SpellBarAsset"+idAddition, undefined, "center", undefined))
        if (lineBool){
            for(let j=0; j<lineAmount; j++){

                let spellLine = sync.syncDecorator("spellLine"+String(j)+"Level"+level,calc.calcDecorator(formfield.singleLine("spellLine"+String(j)+"Level"+level+idAddition, 48 + 12 * j, 12, 180, 10, "level"+level+"SpellBarAsset"+idAddition, undefined, "left", 9, undefined)))
                let line = document.createElement("div")
                line.id = "spellLine"+String(j)+"Level"+level+"Asset"+idAddition
                line.className = "spellLineAsset"
                line.style.setProperty("top", 58 + 12 * j +"px")
                line.style.setProperty("left", 12+"px")
                line.style.setProperty("width", "183px")
                if(idAddition == "spellListPage"){
                    line.style.setProperty("transform", "scale(1,calc(1/1.095))")
                    spellLine.style.setProperty("transform", "scale(1,calc(1/1.095))")
                }
                SpellBarAsset.appendChild(line)

                let spellLineButton = button.tickbox("button"+String(j)+"Level"+level,  50 + 12 * j, 2, 8, 8, "level"+level+"SpellBarAsset"+idAddition, undefined)
                
                if(idAddition == "spellListPage"){
                    spellLineButton.style.setProperty("transform", "scale(1,calc(1/1.095))")
                }
            }
        }
    }
}