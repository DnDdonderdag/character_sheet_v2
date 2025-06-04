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
    let statsPage = page.create("statsPage", top, left)
        saveload.createSaveLoadButtons(top+12, left+380);

    let statsPageHeader = document.createElement("img");
    statsPageHeader.id = "statsPageHeaderSVG"
    statsPageHeader.className="header not-selectable"
    statsPageHeader.src="Assets/SVG/headerP1.svg";
    statsPageHeader.alt="headerchar";
    statsPageHeader.draggable = false;
    statsPageHeader.style = "--top:"+String(10)+"px; --left:"+String(-20)+"px;"
    statsPage.appendChild(statsPageHeader);


    let characterName = 
        sync.syncDecorator("characterName",
            formfield.singleLine("statsPageName", 61, 23, 185, 23, "statsPage", undefined, "center", undefined)
        )
    let statsPageNameText = text.create("statsPageNameText", "CHARACTER NAME", 93, 30, 100, 8, "statsPage", undefined, undefined, undefined, "center")


    let characterInfoSyncDecorators = ["class&level", "alignment", "playerName", "race", "background", "experiencePoints"]
    let characterInfoFormFieldIds = ["class&level", "alignment", "playerName", "race", "background", "experiencePoints"]
    let characterInfotextContents =["CLASS & LEVEL", "ALIGNMENT", "PLAYER NAME", "RACE", "BACKGROUND", "EXPERIENCE POINTS"]
    for (let i = 0; i<6; i++){
        sync.syncDecorator(characterInfoSyncDecorators[i],
            formfield.singleLine(characterInfoFormFieldIds[i], 46 + i%2 * 29, 272 + i%3 * 110, 100, 16, "statsPage", undefined, "Left", 13)
        )
        text.create(characterInfoFormFieldIds+"Text", characterInfotextContents[i], 63 + i%2 * 29, 272 + i%3 * 110, 100, 8, "statsPage", "Scalasanslight", undefined, undefined, "left")
    }
    
    
    let featuresAndTraits = frame.create("features&Traits", 120, 425, 200, 770, "statsPage", "FEATURES & TRAITS", "features&Traits", undefined)
    let otherProficiencies = frame.create("otherProficiencies", 730, 5, 200, 160, "statsPage", "OTHER PROFICIENCIES & LANGUAGES", "otherProficiencies", undefined)
    let characterNotes = frame.create("characterNotes", 730, 215, 200, 160, "statsPage", "CHARACTER NOTES", "characterNotes", undefined)
    
    //Healthbox
    let healthBevelledBox = bevelledBox.create("healthBevelledBox", 120, 215, 200, 300, undefined, "statsPage", "c5c6c7")
    let speed = frame.create("speedFrame", 10, 131, 62,60, "healthBevelledBox", "SPEED", undefined, 'center', false)
    let speedForm = calc.calcDecorator(sync.syncDecorator("speed",formfield.singleLine("speed", 7, 10, 42, 38, "speedFrame", undefined, "center", 25)))
    let initiative = frame.create("initiativeFrame", 10, 65, 62 ,60, "healthBevelledBox", "INITIATIVE", "undefined", 'center', false)
    let initiativeForm = calc.calcDecorator(sync.syncDecorator("initiative",formfield.singleLine("initiative", 7, 10, 42, 38, "initiativeFrame", undefined, "center", 25, "[DEXmod]")))
    let ACAsset = svg.create("acAssetStatsPage", 10, 5, 60, 60, "armor.svg", "healthBevelledBox")
    let acForm = calc.calcDecorator(sync.syncDecorator("ac", formfield.singleLine("ac", 10,15,30,28, "acAssetStatsPage", undefined, "center", 20, "{[ACvalueInventoryPage0] * [armorEquippedInventoryPage0] + [ACvalueInventoryPage1] * [armorEquippedInventoryPage1] + [ACvalueInventoryPage2] * [armorEquippedInventoryPage2] + [ACvalueInventoryPage3] * [armorEquippedInventoryPage3]}")))
    let acText = text.create("acText", "ARMOR CLASS", 38, 15, 30, 30, "acAssetStatsPage", undefined, undefined, 6, 'center')

    let health = frame.create("healthFrame", 75, 5, 190, 80, "healthBevelledBox", "CURRENT HIT POINTS", undefined, undefined, false)
    let maxHPText = text.create("maxHPText", "HIT POINT MAXIMUM", 9, 10, 80, 8, "healthFrame", undefined, "#c5c6c7", undefined, "left")
    let maxHPForm = calc.calcDecorator(sync.syncDecorator("maxHP",formfield.singleLine("maxHP", 7,90,90,12, "healthFrame", undefined, 'left', 8)))
    let HPForm = calc.calcDecorator(sync.syncDecorator("HP",formfield.singleLine("HP", 22,10,170,43, "healthFrame", undefined, 'center', 25)))
    
    let tempHP = frame.create("tempHPFrame", 160, 5, 190, 65, "healthBevelledBox", "TEMPORARY HIT POINTS", undefined, undefined, false)
    let tempHPForm = calc.calcDecorator(sync.syncDecorator("TempHp",formfield.singleLine("tempHP", 7,10,170,43, "tempHPFrame", undefined, 'center', 25)))
    
    let hitDice = frame.create("hitDiceFrame", 230, 5, 93, 65, "healthBevelledBox", "HIT DICE", undefined, undefined, false)
    let hitDiceText = text.create("hitDiceText", "TOTAL", 9, 10, 80, 8, "hitDiceFrame", undefined, "#c5c6c7", undefined, "left")
    let maxHitDiceForm = calc.calcDecorator(sync.syncDecorator("maxHitDice",formfield.singleLine("maxHitDice", 7,35,48,12, "hitDiceFrame", undefined, 'left', 8)))
    let hitDiceForm = calc.calcDecorator(sync.syncDecorator("hitDice",formfield.singleLine("hitDice", 22,10,73,28, "hitDiceFrame", undefined, 'center', 20)))
    
    let deathSaves = frame.create("deathSavesFrame", 230, 102, 93, 65, "healthBevelledBox", "DEATH SAVES", undefined, undefined, false)
    let successesText = text.create("successes", "SUCCESSES", 12, 5, 38, 7, "deathSavesFrame", undefined, undefined, undefined, "right")
    let failsText = text.create("fails", "FAILURES", 30, 5, 38, 7, "deathSavesFrame", undefined, undefined, undefined, "right")
    
    for (let i=0; i<4; i++){
        const asset = document.createElement("img");
        asset.src="./assets/svg/VerticalLine.svg";
        asset.alt="failed asset";
        asset.draggable = false;
        asset.id = "deathSaveLineAsset";
        asset.style = "--top:"+String(14 + i%2 * 18)+"px; --left:"+String(40+ Math.floor(i/2) * 10)+"px; --width:"+String(40)+"px; --height:"+String(10)+"px;"
        asset.className = "not-selectable asset"
        asset.style.setProperty("transform", "rotate(-90deg)")
        asset.style.setProperty("z-index", "-1")
        asset.spellcheck = false;
        document.getElementById("deathSavesFrame").appendChild(asset)
    }
    for (let i=0; i<3; i++){
       sync.syncDecorator("deathSave"+String(i), button.tickbox("deathSave" + String(i), 11, 47 + 13*i, 9,9, "deathSavesFrame", undefined))
       sync.syncDecorator("deathFail"+String(i), button.tickbox("deathFail" + String(i), 29, 47 + 13*i, 9,9, "deathSavesFrame", undefined))
    }

    //Attacks and spell casting
    let attacksSpellcasting = frame.create("attacks&Spellcasting", 430, 215, 200, 290, "statsPage", "ATTACKS & SPELLCASTING", "Spellcasting", undefined, false)
    let attackNameText = text.create("attackNameText", "NAME", 5, 10, 80, 8, "attacks&Spellcasting", undefined, "#c5c6c7", undefined, "left")
    let attackBonusText = text.create("attackNameText", "ATK BONUS", 5, 78, 80, 8, "attacks&Spellcasting", undefined, "#c5c6c7", undefined, "left")
    let attackDamageText = text.create("attackNameText", "DAMAGE/TYPE", 5, 124, 80, 8, "attacks&Spellcasting", undefined, "#c5c6c7", undefined, "left")

    for (let i=0; i<3; i++){
        calc.calcDecorator(sync.syncDecorator("weapon"+String(i),formfield.singleLine("weapon"+String(i), 16 + i* 21,10, 65,18, "attacks&Spellcasting", undefined, 'left', 12)))
        calc.calcDecorator(sync.syncDecorator("atkBonus"+String(i),formfield.singleLine("atkBonus"+String(i), 16 + i* 21, 78, 43,18, "attacks&Spellcasting", undefined, 'left', 12)))
        calc.calcDecorator(sync.syncDecorator("atkDamage"+String(i),formfield.singleLine("atkDamage"+String(i), 16 + i* 21, 124, 66,18, "attacks&Spellcasting", undefined, 'left', 12)))
    }
    let attacksAndSpellcasting = calc.calcDecorator(sync.syncDecorator("attacksAndSpellcasting",formfield.create("ATKAndSpell", 79,10,180,196,"attacks&Spellcasting" ,undefined, 'left')))

    //StatsBox
    let statsBevelledBox = bevelledBox.create("statsBevelledBox", 120, 5, 200, 600, undefined, "statsPage", "e7e8e8")
    
    let abilities = ["strength","dexterity","constitution","intelligence","wisdom","charisma"]
    let skills = {strength:["savingthrows","athletics"], dexterity:["savingthrows","acrobatics","sleight of hand", "stealth"], constitution:["savingthrows",], intelligence:["savingthrows","arcana", "history", "investigation", "nature", "religion"], wisdom:["savingthrows","animal handling", "insight", "medicine", "perception", "survival"], charisma:["savingthrows","deception", "intimidation", "performance", "persuasion"]}
    
    svg.create("profBonusAsset", -25, 15, 170, 100, "profbonus.svg", "statsBevelledBox")
        text.create("profBonusText", "PROFICIENCY BONUS", 46, 65, 90, 8, "profBonusAsset", undefined, undefined, undefined, "center")
        sync.syncDecorator("prof",calc.calcDecorator(formfield.singleLine("prof", 38, 11, 39, 24, "profBonusAsset", undefined, "center", 15)))
    svg.create("inspirationAsset", 13, 15, 170, 100, "profbonus.svg", "statsBevelledBox")
        text.create("inspirationText", "INSPIRATION", 46, 65, 90, 8, "inspirationAsset", undefined, undefined, undefined, "center")
        sync.syncDecorator("inspiration",calc.calcDecorator(formfield.singleLine("inspiration", 38, 11, 39, 24, "inspirationAsset", undefined, "center", 15)))
    svg.create("passivePerceptionAsset", 525, 15, 170, 100, "profbonus.svg", "statsBevelledBox")
        text.create("passivePerceptionText", "PASSIVE PERCEPTION", 46, 65, 90, 8, "passivePerceptionAsset", undefined, undefined, undefined, "center")
        let passivePerception = sync.syncDecorator("passivePerception",calc.calcDecorator(formfield.singleLine("passivePerception", 38, 11, 39, 24, "passivePerceptionAsset", undefined, "center", 15)))
        passivePerception.textContent = "{10 + [wisdomperceptionBonus]}"

    for (let i=0; i<6; i++){
        svg.create("statBoxAsset"+abilities[i], 70+80*i, 5, 190, 100, "modifiertab.svg", "statsBevelledBox")
        let modTab = sync.syncDecorator(abilities[i].substring(0,3).toUpperCase() + "mod", calc.calcDecorator(formfield.singleLine(abilities[i].substring(0,3).toUpperCase() + "mod", 19, 25, 20,16, "statBoxAsset"+abilities[i], "#e7e8e8", "center", 8)))
        let abilityTab = sync.syncDecorator(abilities[i] + "Value", calc.calcDecorator(formfield.singleLine(abilities[i] + "Value", 42, 12, 46,27, "statBoxAsset"+abilities[i], undefined, "center", 25)))
        text.create(abilities[i]+"Text", abilities[i].toUpperCase(), 69, 5, 60, 9, "statBoxAsset"+abilities[i], "scalasanslight", undefined, 8, "center")
        abilityTab.textContent = "10"
        modTab.textContent = "{((Math.floor([" + abilities[i] + "Value]/2)-5>=0)?'+': '')+String(Math.floor([" + abilities[i] + "Value]/2)-5)}"

        for(let j=0; j<skills[abilities[i]].length; j++){
            let skill = skills[abilities[i]][j]
            let ability = abilities[i]
            let expertiseButton = sync.syncDecorator(ability+skill+"Exp",button.tickbox(ability+skill+"Exp", 24 + j*12, 88, 5,5, "statBoxAsset"+abilities[i], undefined))
            let profButton = sync.syncDecorator(ability+skill+"Prof",button.tickbox(ability+skill+"Prof", 26 + j*12, 83, 6,6, "statBoxAsset"+abilities[i], undefined))
            let profBonus = calc.calcDecorator(sync.syncDecorator(ability+skill+"Bonus", formfield.singleLine(ability+skill+"Bonus", 22 + j*12, 96, 15, 10, "statBoxAsset"+abilities[i], undefined, "center", 8)))
            svg.create(ability+skill+"UnderlineAsset", 32 + j*12, 93, 15, 8, "HorizontalLine.svg","statBoxAsset"+abilities[i])
            svg.create(ability+skill+"UnderlineAsset2", 32 + j*12, 99, 15, 8, "HorizontalLine.svg","statBoxAsset"+abilities[i])
            text.create(ability+skill+"text", skill.toUpperCase(), 23 + j*12, 113, 90, 8, "statBoxAsset"+abilities[i], "scalasanslight", undefined, undefined, "left")
            profBonus.textContent = "{[" + ability+skill+"Prof" +"] * [prof] + [" +ability+skill+"Exp" + "]*[" + ability+skill+"Prof" +"] * [prof] + [" +ability.substring(0,3).toUpperCase() + "mod"+ "]}"
        }
    }


};

