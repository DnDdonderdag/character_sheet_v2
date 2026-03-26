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

export function create(top,left,idAddition){
    let textPage = page.create("TextPage"+idAddition, top, left)

    frame.create("textFrame" + idAddition, 10, 10, 610, 880,"TextPage"+idAddition, "NOTES", "textFrame" + idAddition, undefined, true)
};
