import * as calc from "../decorators/calculate/calculations.js";
import * as sync from "../decorators/syncronising.js";
import * as saveload from "../utilities/saveLoad.js";
import * as formfield  from "../constructors/formfield.js";
import * as button  from "../constructors/button.js";
import * as text from "../constructors/text.js";
import * as autoSize from "../decorators/autoSize.js";
import * as page from "../constructors/page.js";
import * as svg from "../constructors/svg.js";
import * as lookup from "../utilities/lookup.js"
import * as programmableButton from "./programmableButton.js"

export function create(level, top, left, parent, lineAmount, lineBool, idAddition, jsonBool){
    lineBool = (lineBool === undefined || lineBool === null) ? true : lineBool;
    idAddition = (idAddition === undefined || idAddition === null) ? "" : idAddition;
    const spellbar = document.createElement("div");
    spellbar.id = "spellbar"+level + idAddition;
    spellbar.className = "not-selectable spellbar"
    spellbar.spellcheck = false;


    if (level == 0){
        let cantripAsset = svg.create("cantripBarAsset"+idAddition, top, left, 197, 50, "spellBarCantrip.svg", parent, false)
        text.create("cantripText"+idAddition, "0", 12, 5, 10, 20, "cantripBarAsset"+idAddition, undefined, undefined, undefined, "center", false)
        text.create("cantripSpellText"+idAddition, "CANTRIPS", 19, 30, 150, 10, "cantripBarAsset"+idAddition, undefined, undefined, 10, "center", false)
        if (lineBool){
            for(let j=0; j<lineAmount; j++){

                let spellLine = sync.syncDecorator("spellLine"+String(j)+"Level"+level,calc.calcDecorator(formfield.singleLine("spellLine"+String(j)+"Level"+level+idAddition, 45 + 12 * j, 12, 180, 11, "cantripBarAsset"+idAddition, undefined, "left", 9, undefined, false)))
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
    } else if  (level == "variable"){
        let SpellBarAsset = svg.create("level"+level+"SpellBarAsset"+idAddition, top, left, 197, 50, "spellbar.svg", parent, false)

        calc.calcDecorator(sync.syncDecorator("variableSpellLevel", formfield.singleLine("variableSpellLevel"+idAddition,12,2,14,26, "level"+level+"SpellBarAsset"+idAddition, undefined, "center", undefined, undefined, false)))
        for (let i=0; i<4; i++){
            let spellLineCheckmark = sync.syncDecorator("spellCheckmark"+String(i)+"Level"+level, button.checkmark("level"+level+"SpellCheckMark"+String(i)+idAddition, 16, 90 + i* 24, 18, 18, "level"+level+"SpellBarAsset"+idAddition, undefined, false))
            if(idAddition == "spellListPage"){
                spellLineCheckmark.style.setProperty("transform", "scale(1,calc(1/1.095))")
            }
        }
        sync.syncDecorator("spellAmountLevel"+level, formfield.singleLine("spellAmountLevel"+level+idAddition, 14, 23, 45,  22, "level"+level+"SpellBarAsset"+idAddition, undefined, "center", undefined, undefined, false))
        if (lineBool){
            for(let j=0; j<lineAmount; j++){

                let spellLine = sync.syncDecorator("spellLine"+String(j)+"Level"+level,calc.calcDecorator(formfield.singleLine("spellLine"+String(j)+"Level"+level+idAddition, 48 + 12 * j, 12, 180, 10, "level"+level+"SpellBarAsset"+idAddition, undefined, "left", 9, undefined, false)))
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

                let spellLineButton = button.tickbox("button"+String(j)+"Level"+level,  50 + 12 * j, 2, 8, 8, "level"+level+"SpellBarAsset"+idAddition, undefined, false)
                
                if(idAddition == "spellListPage"){
                    spellLineButton.style.setProperty("transform", "scale(1,calc(1/1.095))")
                }
            }
        }
    } else{
        let SpellBarAsset = svg.create("level"+level+"SpellBarAsset"+idAddition, top, left, 197, 50, "spellbar.svg", parent, false)
        text.create("level"+level+"Text"+idAddition, String(level), 12, 5, 10, 20, "level"+level+"SpellBarAsset"+idAddition, undefined, undefined, undefined, "center", false)
        for (let i=0; i<4; i++){
            let spellLineCheckmark = sync.syncDecorator("spellCheckmark"+String(i)+"Level"+level, button.checkmark("level"+level+"SpellCheckMark"+String(i)+idAddition, 16, 90 + i* 24, 18, 18, "level"+level+"SpellBarAsset"+idAddition, undefined, false))
            if(idAddition == "spellListPage"){
                spellLineCheckmark.style.setProperty("transform", "scale(1,calc(1/1.095))")
            }
        }
        sync.syncDecorator("spellAmountLevel"+level, formfield.singleLine("spellAmountLevel"+level+idAddition, 14, 23, 45,  22, "level"+level+"SpellBarAsset"+idAddition, undefined, "center", undefined, undefined, false))
        if (lineBool){
            for(let j=0; j<lineAmount; j++){

                let spellLine = sync.syncDecorator("spellLine"+String(j)+"Level"+level,calc.calcDecorator(formfield.singleLine("spellLine"+String(j)+"Level"+level+idAddition, 48 + 12 * j, 12, 180, 10, "level"+level+"SpellBarAsset"+idAddition, undefined, "left", 9, undefined, false)))
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

                let spellLineButton = button.tickbox("button"+String(j)+"Level"+level,  50 + 12 * j, 2, 8, 8, "level"+level+"SpellBarAsset"+idAddition, undefined, false)
                
                if(idAddition == "spellListPage"){
                    spellLineButton.style.setProperty("transform", "scale(1,calc(1/1.095))")
                }
            }
        }
    }

    jsonBool = (jsonBool === undefined || jsonBool === null || jsonBool === "null" || jsonBool === "undefined") ? true : jsonBool;
    if(jsonBool){
        spellbar.className += " json"
        let jsonCode = '"spellbar'+level + idAddition + '":{"function":"spellbar","args":['+(level=="variable"? '"variable"':level)+','+top+','+left+',"'+parent+'",'+lineAmount+','+lineBool+',"'+idAddition+'",'+jsonBool+']},'
        spellbar.json = jsonCode
    }
    document.getElementById(parent).appendChild(spellbar)

}

export function create3_5(level, top, left, parent, lineAmount, lineBool, idAddition,jsonBool){
    lineBool = (lineBool === undefined || lineBool === null) ? true : lineBool;
    idAddition = (idAddition === undefined || idAddition === null) ? "" : idAddition;
    const spellbar = document.createElement("div");
    spellbar.id = "spellbar" +level+ idAddition;
    spellbar.className = "not-selectable spellbar"
    spellbar.spellcheck = false;

    if  (level == "variable"){
        let SpellBarAsset = svg.create("level"+level+"SpellBarAsset"+idAddition, top, left, 197, 50, "spellbar.svg", parent, false)

        // counting buttons
        calc.calcDecorator(sync.syncDecorator("currentSpellAmountLevel"+level,formfield.singleLine("currentSpellAmountLevel"+level+idAddition, 16, 95, 30, 18,"level"+level+"SpellBarAsset"+idAddition, undefined, "center", undefined, undefined, false)))
        programmableButton.create("buttonMinusOneSpellAmountLevel"+level+idAddition, 16, 127, 18, 18,"level"+level+"SpellBarAsset"+idAddition, "#c5c6c7", "-1", 13, "center", 'document.getElementById("currentSpellAmountLevel'+level+idAddition+'").textContent = Number(document.getElementById("currentSpellAmountLevel'+level+idAddition+'").textContent)-1', false  )
        programmableButton.create("buttonRefillSpellAmountLevel"+level+idAddition, 16, 147, 30, 18,"level"+level+"SpellBarAsset"+idAddition, "#c5c6c7", "FILL", 10, "center", 'document.getElementById("currentSpellAmountLevel'+level+idAddition+'").textContent = Number(document.getElementById("spellAmountLevel'+level+idAddition+'").value)', false  )


        calc.calcDecorator(sync.syncDecorator("variableSpellLevel", formfield.singleLine("variableSpellLevel"+idAddition,12,2,14,26, "level"+level+"SpellBarAsset"+idAddition, undefined, "center", undefined, undefined, false)))

        sync.syncDecorator("spellAmountLevel"+level, formfield.singleLine("spellAmountLevel"+level+idAddition, 14, 23, 45,  22, "level"+level+"SpellBarAsset"+idAddition, undefined, "center", undefined, undefined, false))
        if (lineBool){
            for(let j=0; j<lineAmount; j++){

                let spellLine = sync.syncDecorator("spellLine"+String(j)+"Level"+level,calc.calcDecorator(formfield.singleLine("spellLine"+String(j)+"Level"+level+idAddition, 48 + 12 * j, 12, 180, 10, "level"+level+"SpellBarAsset"+idAddition, undefined, "left", 9, undefined, false)))
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

                let spellLineButton = button.tickbox("button"+String(j)+"Level"+level,  50 + 12 * j, 2, 8, 8, "level"+level+"SpellBarAsset"+idAddition, undefined, false)
                
                if(idAddition == "spellListPage"){
                    spellLineButton.style.setProperty("transform", "scale(1,calc(1/1.095))")
                }
            }
        }
    } else{
        let SpellBarAsset = svg.create("level"+level+"SpellBarAsset"+idAddition, top, left, 197, 50, "spellbar.svg", parent, false)
        text.create("level"+level+"Text"+idAddition, String(level), 12, 5, 10, 20, "level"+level+"SpellBarAsset"+idAddition, undefined, undefined, undefined, "center", false)

        // counting buttons
        calc.calcDecorator(sync.syncDecorator("currentSpellAmountLevel"+level,formfield.singleLine("currentSpellAmountLevel"+level+idAddition, 16, 95, 30, 18,"level"+level+"SpellBarAsset"+idAddition, undefined, "center", undefined, undefined, false)))
        programmableButton.create("buttonMinusOneSpellAmountLevel"+level+idAddition, 16, 127, 18, 18,"level"+level+"SpellBarAsset"+idAddition, "#c5c6c7", "-1", 13, "center", 'document.getElementById("currentSpellAmountLevel'+level+idAddition+'").textContent = Number(document.getElementById("currentSpellAmountLevel'+level+idAddition+'").textContent)-1', false  )
        programmableButton.create("buttonRefillSpellAmountLevel"+level+idAddition, 16, 147, 30, 18,"level"+level+"SpellBarAsset"+idAddition, "#c5c6c7", "FILL", 10, "center", 'document.getElementById("currentSpellAmountLevel'+level+idAddition+'").textContent = Number(document.getElementById("spellAmountLevel'+level+idAddition+'").value)', false  )


        sync.syncDecorator("spellAmountLevel"+level, formfield.singleLine("spellAmountLevel"+level+idAddition, 14, 23, 45,  22, "level"+level+"SpellBarAsset"+idAddition, undefined, "center", undefined, undefined, false))
        if (lineBool){
            for(let j=0; j<lineAmount; j++){

                let spellLine = sync.syncDecorator("spellLine"+String(j)+"Level"+level,calc.calcDecorator(formfield.singleLine("spellLine"+String(j)+"Level"+level+idAddition, 48 + 12 * j, 12, 180, 10, "level"+level+"SpellBarAsset"+idAddition, undefined, "left", 9, undefined, false)))
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

                let spellLineButton = button.tickbox("button"+String(j)+"Level"+level,  50 + 12 * j, 2, 8, 8, "level"+level+"SpellBarAsset"+idAddition, undefined, false)
                
                if(idAddition == "spellListPage"){
                    spellLineButton.style.setProperty("transform", "scale(1,calc(1/1.095))")
                }
            }
        }
    }
    
    jsonBool = (jsonBool === undefined || jsonBool === null || jsonBool === "null" || jsonBool === "undefined") ? true : jsonBool;
    if(jsonBool){
        spellbar.className += " json"
        let jsonCode = '"spellbar'+level + idAddition + '":{"function":"spellbar3_5","args":['+(level=="variable"? '"variable"':level)+','+top+','+left+',"'+parent+'",'+lineAmount+','+lineBool+',"'+idAddition+'",'+jsonBool+']},'
        spellbar.json = jsonCode
    }
    document.getElementById(parent).appendChild(spellbar)
}