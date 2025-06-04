import * as update from "../utilities/updater.js";
import * as calc from "../decorators/calculate/calculations.js";
import * as sync from "../decorators/syncronising.js";
import * as saveload from "../utilities/saveLoad.js";
import * as formfield  from "../constructors/formfield.js";
import * as button  from "../constructors/button.js";
import * as text from "../constructors/text.js";
import * as autoSize from "../decorators/autoSize.js";
import * as frame from "../constructors/frame.js";
import * as page from "../constructors/page.js";
import * as presetTestPage from "../pages/presetTestPage.js"
import * as statsPage from "../pages/statsPage.js"
import * as spellListPage from "../pages/spellListPage.js"
import * as inventoryPage from "../pages/inventoryPage.js"
import * as backgroundPage from "../pages/characterBackgroundPage.js"
import * as svg from "../constructors/svg.js";


const functionMap = {
  //decorators
  calc: (field) => calc.calcDecorator(runFunctionByName(field.function, field.args)),
  sync: (field) => sync.syncDecorator(field.syncClass, runFunctionByName(field.function, field.args)),
    
  //individual assets
  page: (args) => page.create(...args),
  saveLoadButtons: (args) => saveload.createSaveLoadButtons(...args),
  frame: (args) => frame.create(...args),

  formfield: (args) => formfield.create(...args),
  singleLine: (args) => formfield.singleLine(...args),
  checkmark: (args) => button.checkmark(...args),
  tickbox: (args) => button.tickbox(...args),
  text: (args) => text.create(...args),
  svg: (args) => svg.create(...args),


  //Pre made pages
  presetTestPage: (args) => presetTestPage.create(...args),
  statsPage: (args) => statsPage.create(...args),
  spellListPage: (args) => spellListPage.create(...args),
  inventoryPage: (args) => inventoryPage.create(...args),
  backgroundPage: (args) => backgroundPage.create(...args)

  };


function runFunctionByName(name, args) {
  const fn = functionMap[name];
  if (typeof fn === "function") {
    return fn(args);
  } else {
    console.error("Function not found:", name);
  }
}

export function render(layout){
    for (const [key, value] of Object.entries(layout)) {
        runFunctionByName(value.function, value.args)
      }
      saveload.setLayout(layout)
}