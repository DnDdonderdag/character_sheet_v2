import * as calc from "../decorators/calculate/calculations.js";
import * as sync from "../decorators/syncronising.js";
import * as saveLoad from "../utilities/saveLoad.js";
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
import * as layoutRenderer from "../utilities/layoutRenderer.js"



export function create(top,left){
    let landingPage = page.create("landingPage", top, left)
    let loadButton = saveLoad.createLoadButton(40,30)
    let fullCasterTemplate = programmableButton.create("fullCasterTemplate", 60,20, 170, 22, "landingPage", undefined, "Template Full Caster", 16, "Center", "fetch('/layoutTemplates/templateFullCaster.json').then(res => res.json()).then(data => {saveLoad.loadState(data); update.onPageLoad()});document.body.innerHTML = '';")
    let martialTemplate = programmableButton.create("martialTemplate", 90,20, 170, 22, "landingPage", undefined, "Template Martial", 16, "Center", "fetch('/layoutTemplates/templateMartial.json').then(res => res.json()).then(data => {saveLoad.loadState(data); update.onPageLoad()});document.body.innerHTML = '';")
    let template3_5 = programmableButton.create("3.5Template", 120,20, 170, 22, "landingPage", undefined, "Template 3.5 Martial", 16, "Center", "fetch('/layoutTemplates/template35Martial.json').then(res => res.json()).then(data => {saveLoad.loadState(data); update.onPageLoad()});document.body.innerHTML = '';")
    let linkToGithub = programmableButton.create("githubLink", 60, 200, 170, 22, "landingPage", undefined, "Documentation", 16, "center", "window.open('https://github.com/DnDdonderdag/character_sheet_v2');")
}