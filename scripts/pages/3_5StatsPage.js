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
import * as programmableButton from "../constructors/programmableButton.js"


export function create(top,left){
    let statsPage = page.create("statsPage", top, left)
        saveload.createSaveLoadButtons(top+12, left+380);

    let statsPageHeader = document.createElement("img");
    statsPageHeader.id = "statsPageHeaderSVG"
    statsPageHeader.className="header not-selectable"
    statsPageHeader.src="assets/svg/headerP1.svg";
    statsPageHeader.alt="headerchar";
    statsPageHeader.draggable = false;
    statsPageHeader.style = "--top:"+String(10)+"px; --left:"+String(-20)+"px;"
    statsPage.appendChild(statsPageHeader);


    let characterName = 
        sync.syncDecorator("characterName",
            formfield.singleLine("statsPageName", 61, 23, 185, 23, "statsPage", undefined, "center", undefined)
        )
    let statsPageNameText = text.create("statsPageNameText", "CHARACTER NAME", 93, 30, 100, 8, "statsPage", undefined, undefined, undefined, "center")

    
    let characterInfoSyncDecorators = ["class&level", "alignment", "playerName", "race", "deity", "experiencePoints"]
    let characterInfoFormFieldIds = ["class&level", "alignment", "playerName", "race", "deity", "experiencePoints"]
    let characterInfotextContents =["CLASS & LEVEL", "ALIGNMENT", "PLAYER NAME", "RACE", "DEITY", "EXPERIENCE POINTS"]
    for (let i = 1; i<6; i++){
        sync.syncDecorator(characterInfoSyncDecorators[i],
            formfield.singleLine(characterInfoFormFieldIds[i], 46 + i%2 * 29, 272 + i%3 * 110, 100, 16, "statsPage", undefined, "Left", 13)
        )
        text.create(characterInfoFormFieldIds+"Text", characterInfotextContents[i], 63 + i%2 * 29, 272 + i%3 * 110, 100, 8, "statsPage", "Scalasanslight", undefined, undefined, "left")
    }
    sync.syncDecorator(characterInfoSyncDecorators[0],
            formfield.singleLine(characterInfoFormFieldIds[0], 46 , 272 , 80, 16, "statsPage", undefined, "Left", 13)
        )
    sync.syncDecorator("careerLevel",
            formfield.singleLine("careerLevel", 46 , 353 , 19, 16, "statsPage", undefined, "Center", 13)
        )
    text.create(characterInfoFormFieldIds+"Text", characterInfotextContents[0], 63 , 272 , 100, 8, "statsPage", "Scalasanslight", undefined, undefined, "left")
    
    
    let featuresAndTraits = frame.create("features&Traits", 120, 425, 200, 770, "statsPage", "FEATURES & TRAITS", "features&Traits", undefined)

    //Healthbox
    let healthBevelledBox = bevelledBox.create("healthBevelledBox", 120, 215, 200, 430, undefined, "statsPage", "c5c6c7")

    let ACAsset = svg.create("acAssetStatsPage", 10, 5, 60, 60, "armor.svg", "healthBevelledBox")
    let acForm = calc.calcDecorator(sync.syncDecorator("ac", formfield.singleLine("ac", 10,15,30,28, "acAssetStatsPage", undefined, "center", 20, "{10 + [DEXmod] + [ACvalueInventoryPage0] * [armorEquippedInventoryPage0] + [ACvalueInventoryPage1] * [armorEquippedInventoryPage1] + [ACvalueInventoryPage2] * [armorEquippedInventoryPage2] + [ACvalueInventoryPage3] * [armorEquippedInventoryPage3]}")))
    let acText = text.create("acText", "ARMOR CLASS", 38, 15, 30, 30, "acAssetStatsPage", undefined, undefined, 6, 'center')

    let ACTouchAsset = svg.create("acTouchAssetStatsPage", 10, 70, 60, 60, "armor.svg", "healthBevelledBox")
    let acTouchForm = calc.calcDecorator(sync.syncDecorator("acTouch", formfield.singleLine("acTouch", 10,15,30,28, "acTouchAssetStatsPage", undefined, "center", 20, "{10 + [DEXmod]}")))
    let acTouchText = text.create("acTouchText", "TOUCH", 38, 15, 30, 30, "acTouchAssetStatsPage", undefined, undefined, 7, 'center')

    let ACFlatFootAsset = svg.create("acFlatFootAssetStatsPage", 10, 136, 60, 60, "armor.svg", "healthBevelledBox")
    let acFlatFootForm = calc.calcDecorator(sync.syncDecorator("acFlatFoot", formfield.singleLine("acFlatFoot", 10,15,30,28, "acFlatFootAssetStatsPage", undefined, "center", 20, "{[ac] - [DEXmod]}")))
    let acFlatFootText = text.create("acFlatFootText", "FLAT", 38, 15, 30, 30, "acFlatFootAssetStatsPage", undefined, undefined, 7, 'center')
    
    let grapple = frame.create("grappleFrame", 75, 5, 60, 60, "healthBevelledBox", "GRAPPLE", "undefined", 'center', false)
    let grappleForm = calc.calcDecorator(sync.syncDecorator("grapple",formfield.singleLine("grapple", 7, 10, 42, 38, "grappleFrame", undefined, "center", 25, "{[STRmod]}")))
    let speed = frame.create("speedFrame", 75, 136, 62,60, "healthBevelledBox", "SPEED", undefined, 'center', false)
    let speedForm = calc.calcDecorator(sync.syncDecorator("speed",formfield.singleLine("speed", 7, 10, 42, 38, "speedFrame", undefined, "center", 25)))
    let initiative = frame.create("initiativeFrame", 75, 70, 62 ,60, "healthBevelledBox", "INITIATIVE", "undefined", 'center', false)
    let initiativeForm = calc.calcDecorator(sync.syncDecorator("initiative",formfield.singleLine("initiative", 7, 10, 42, 38, "initiativeFrame", undefined, "center", 25, "{[DEXmod]}")))
   

    let health = frame.create("healthFrame", 140, 5, 190, 80, "healthBevelledBox", "WOUNDS / CURRENT HP", undefined, undefined, false)
    let maxHPText = text.create("maxHPText", "HIT POINT MAXIMUM", 9, 10, 80, 8, "healthFrame", undefined, "#c5c6c7", undefined, "left")
    let maxHPForm = calc.calcDecorator(sync.syncDecorator("maxHP",formfield.singleLine("maxHP", 7,90,90,12, "healthFrame", undefined, 'left', 8)))
    let HPForm = calc.calcDecorator(sync.syncDecorator("HP",formfield.singleLine("HP", 22,10,170,43, "healthFrame", undefined, 'center', 25)))
    
    let tempHP = frame.create("tempHPFrame", 225, 5, 190, 65, "healthBevelledBox", "NONLETHAL DAMAGE", undefined, undefined, false)
    let tempHPForm = calc.calcDecorator(sync.syncDecorator("tempHP",formfield.singleLine("tempHP", 7,10,170,43, "tempHPFrame", undefined, 'center', 25)))
   

    let baseAttackBonus = frame.create("baseAttackBonusFrame", 295, 5, 92,60, "healthBevelledBox", "BASE ATTACK", "undefined", 'center', false)
    let baseAttackBonusForm = calc.calcDecorator(sync.syncDecorator("baseAttack",formfield.singleLine("baseAttack", 7, 10, 72, 38, "baseAttackBonusFrame", undefined, "center", 25, "+0")))
    let spellResistance = frame.create("spellResistanceFrame", 295, 106, 92,60, "healthBevelledBox", "SPELL RESISTANCE", undefined, 'center', false)
    let spellResistanceForm = calc.calcDecorator(sync.syncDecorator("spellResistance",formfield.singleLine("spellResistance", 7, 10, 72, 38, "spellResistanceFrame", undefined, "center", 25, "+0")))

        
    let fortitude = frame.create("fortitudeFrame", 360, 5, 60, 60, "healthBevelledBox", "FORTITUDE", "undefined", 'center', false)
    let fortitudeForm = calc.calcDecorator(sync.syncDecorator("fortitude",formfield.singleLine("fortitude", 7, 10, 42, 38, "fortitudeFrame", undefined, "center", 25, "{[CONmod]}")))
    let reflex = frame.create("reflexFrame", 360, 136, 62,60, "healthBevelledBox", "REFLEX", undefined, 'center', false)
    let reflexForm = calc.calcDecorator(sync.syncDecorator("reflex",formfield.singleLine("reflex", 7, 10, 42, 38, "reflexFrame", undefined, "center", 25, "{[DEXmod]}")))
    let will = frame.create("willFrame", 360, 70, 62 ,60, "healthBevelledBox", "WILL", "undefined", 'center', false)
    let willForm = calc.calcDecorator(sync.syncDecorator("will",formfield.singleLine("will", 7, 10, 42, 38, "willFrame", undefined, "center", 25, "{[WISmod]}")))
   



    //Attacks and spell casting
    let attacksSpellcasting = frame.create("attacks&Spellcasting", 560, 215, 200, 330, "statsPage", "ATTACKS & SPELLCASTING", "Spellcasting", undefined, false)
    let attackNameText = text.create("attackNameText", "NAME", 5, 10, 80, 8, "attacks&Spellcasting", undefined, "#c5c6c7", undefined, "left")
    let attackBonusText = text.create("attackNameText", "ATK BONUS", 5, 78, 80, 8, "attacks&Spellcasting", undefined, "#c5c6c7", undefined, "left")
    let attackDamageText = text.create("attackNameText", "DAMAGE/TYPE", 5, 124, 80, 8, "attacks&Spellcasting", undefined, "#c5c6c7", undefined, "left")

    for (let i=0; i<3; i++){
        calc.calcDecorator(sync.syncDecorator("weapon"+String(i),formfield.singleLine("weapon"+String(i), 16 + i* 21,10, 67,20, "attacks&Spellcasting", undefined, 'left', 13)))
        calc.calcDecorator(sync.syncDecorator("atkBonus"+String(i),formfield.singleLine("atkBonus"+String(i), 16 + i* 21, 78, 45,20, "attacks&Spellcasting", undefined, 'left', 13)))
        calc.calcDecorator(sync.syncDecorator("atkDamage"+String(i),formfield.singleLine("atkDamage"+String(i), 16 + i* 21, 124, 66,20, "attacks&Spellcasting", undefined, 'left', 13)))
    }
    let attacksAndSpellcasting = calc.calcDecorator(sync.syncDecorator("attacksAndSpellcasting",formfield.create("ATKAndSpell", 79,10,180,236,"attacks&Spellcasting" ,undefined, 'left')))

    //StatsBox
    let statsBevelledBox = bevelledBox.create("statsBevelledBox", 120, 5, 200, 770, undefined, "statsPage", "e7e8e8")
    
    let abilities = ["strength","dexterity","constitution","intelligence","wisdom","charisma"]
    let skills = {strength:["climb", "jump", "swim"], dexterity:["balance", "escape artist", "hide", "move silently", "open lock", "ride", "sleight of hand", "tumble", "use rope"], constitution:["concentration"], intelligence:["appraise", "decipher script", "disable device", "forgery", "search", "spellcraft", "custom1craft", "custom2craft", "custom3craft", "custom1knowledge", "custom2knowledge", "custom3knowledge", "custom4knowledge"], wisdom:["heal", "listen", "sense motive", "spot", "survival", "custom1profession", "custom2profession"], charisma:["bluff", "diplomacy", "disguise", "gather info", "handle animal", "intimidate","use magic device", "custom1perform", "custom2perform", "custom3perform"]}
    
    svg.create("maxRankAsset", -25, 15, 170, 100, "profbonus.svg", "statsBevelledBox")
        text.create("maxRankText", "MAX RANKS", 46, 65, 90, 8, "maxRankAsset", undefined, undefined, undefined, "center")
        sync.syncDecorator("prof",calc.calcDecorator(formfield.singleLine("prof", 38, 11, 39, 24, "maxRankAsset", undefined, "center", 15)))
    let inspoAsset = svg.create("inspirationAsset", 13, 15, 170, 100, "profbonus.svg", "statsBevelledBox")
    inspoAsset.style.setProperty("z-index", "-100")
        text.create("inspirationText", "INSPIRATION", 46, 65, 90, 8, "inspirationAsset", undefined, undefined, undefined, "center")
        sync.syncDecorator("inspiration",calc.calcDecorator(formfield.singleLine("inspiration", 38, 11, 39, 24, "inspirationAsset", undefined, "center", 15)))


    let bonusText = text.create("bonusText", "SKILL MODIFIER", 84, 65, 90, 8, "statsBevelledBox", "scalasanslight", undefined, undefined, "left")
    let ranksText = text.create("ranksText", "RANKS", 84, 170, 90, 8, "statsBevelledBox", "scalasanslight", undefined, undefined, "left")
    let explainerText = text.create("explainerText", "■ Can be used untrained. * Armor check penalty applies.", 757, 10, 190, 8, "statsBevelledBox", "scalasanslight", undefined, undefined, "left")
    
    let statBoxOffset = [75,120,75,165,95,70]
    let skillsArmorPenalty = ["balance", "climb", "escape artist", "hide", "jump", "move silently", "sleight of hand", "swim", "tumble"]
    let untrainedSkills = ["appraise", "balance", "bluff", "climb", "concentration", "craft", "diplomacy", "disguise", "escape artist", "forgery", "gather info", "heal", "hide", "intimidate", "jump", "listen", "move silently", "ride", "search", "sense motive", "spot", "survival", "swim", "use rope"]
    for (let i=0; i<6; i++){
        svg.create("statBoxAsset"+abilities[i], 80+statBoxOffset.slice(0,i).reduce((partialSum, a) => partialSum + a, 0), 5, 190, 100, "modifiertab.svg", "statsBevelledBox")
        let modTab = sync.syncDecorator(abilities[i].substring(0,3).toUpperCase() + "mod", calc.calcDecorator(formfield.singleLine(abilities[i].substring(0,3).toUpperCase() + "mod", 19, 25, 20,16, "statBoxAsset"+abilities[i], "#e7e8e8", "center", 8)))
        let abilityTab = sync.syncDecorator(abilities[i] + "Value", calc.calcDecorator(formfield.singleLine(abilities[i] + "Value", 42, 12, 46,27, "statBoxAsset"+abilities[i], undefined, "center", 25)))
        text.create(abilities[i]+"Text", abilities[i].toUpperCase(), 69, 5, 60, 9, "statBoxAsset"+abilities[i], "scalasanslight", undefined, 8, "center")
        abilityTab.textContent = "10"
        modTab.textContent = "{((Math.floor([" + abilities[i] + "Value]/2)-5>=0)?'+': '')+String(Math.floor([" + abilities[i] + "Value]/2)-5)}"

        for(let j=0; j<skills[abilities[i]].length; j++){
            let skill = skills[abilities[i]][j]
            let ability = abilities[i]
            //add armor check penalty
            let profButton = sync.syncDecorator(ability+skill.replace(/\s/g, '')+"Prof",button.tickbox(ability+skill.replace(/\s/g, '')+"Prof", 26 + j*12, 73, 6,6, "statBoxAsset"+abilities[i], undefined))
            let profBonus = calc.calcDecorator(sync.syncDecorator(ability+skill.replace(/\s/g, '')+"Bonus", formfield.singleLine(ability+skill.replace(/\s/g, '')+"Bonus", 22 + j*12, 82, 15, 10, "statBoxAsset"+abilities[i], undefined, "center", 8)))
            svg.create(ability+skill.replace(/\s/g, '')+"UnderlineAsset", 32 + j*12, 79, 15, 8, "HorizontalLine.svg","statBoxAsset"+abilities[i])
            svg.create(ability+skill.replace(/\s/g, '')+"UnderlineAsset2", 32 + j*12, 85, 15, 8, "HorizontalLine.svg","statBoxAsset"+abilities[i])
            svg.create(ability+skill.replace(/\s/g, '')+"UnderlineAssetRank", 32 + j*12, 169, 15, 8, "HorizontalLine.svg","statBoxAsset"+abilities[i])
            svg.create(ability+skill.replace(/\s/g, '')+"UnderlineAsset2Rank", 32 + j*12, 175, 15, 8, "HorizontalLine.svg","statBoxAsset"+abilities[i])
            let addition = ""
            if(skillsArmorPenalty.includes(skill)){addition += "*"}
            if(untrainedSkills.includes(skill) || untrainedSkills.includes(skill.slice(7))){addition += "■"}
            if(skill.slice(0,6) == "custom"){
                calc.calcDecorator(sync.syncDecorator(ability+skill.replace(/\s/g, '')+"custom", formfield.singleLine(ability+skill.replace(/\s/g, '')+"custom", 22 + j*12, 99, 68, 10, "statBoxAsset"+abilities[i], undefined, "left", 8, skill.slice(7) + " (   )" )))
            } else{
                text.create(ability+skill.replace(/\s/g, '')+"text", skill.toUpperCase()+addition, 23 + j*12, 99, 90, 8, "statBoxAsset"+abilities[i], "scalasanslight", undefined, undefined, "left")
            }
            let ranks = calc.calcDecorator(sync.syncDecorator(ability+skill.replace(/\s/g, '')+"Ranks", formfield.singleLine(ability+skill.replace(/\s/g, '')+"Ranks", 22 + j*12, 172, 15, 10, "statBoxAsset"+abilities[i], undefined, "center", 8,"0")))
            if(skillsArmorPenalty.includes(skill)){
                profBonus.textContent = "{[" +ability.substring(0,3).toUpperCase() + "mod"+ "] + Math.floor([" + ability+skill.replace(/\s/g, '')+"Ranks" + "]) + " + (skill=="swim" ? "2*" : "") + "([checkPenaltyInventoryPage0] * [armorEquippedInventoryPage0] + [checkPenaltyInventoryPage1] * [armorEquippedInventoryPage1] + [checkPenaltyInventoryPage2] * [armorEquippedInventoryPage2] + [checkPenaltyInventoryPage3] * [armorEquippedInventoryPage3])}"
            }
            else {
                profBonus.textContent = "{[" +ability.substring(0,3).toUpperCase() + "mod"+ "] + Math.floor([" + ability+skill.replace(/\s/g, '')+"Ranks" + "])}"
            }
        }
    }


};