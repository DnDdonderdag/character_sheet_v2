import * as calc from "../decorators/calculate/calculations.js"
import * as button from "../constructors/button.js"
import * as update from "./updater.js";
import * as layoutRenderer from "./layoutRenderer.js"
import * as lookup from "./lookup.js"

//alert the user when reloading
window.addEventListener('beforeunload', function (e) {
e.preventDefault();
e.returnValue = '';
});


let currentLayout = {}
export function setLayout(layout){
    currentLayout = layout
}

// Functions for creating the buttons
export function createSaveLoadButtons(top, left){
    createSaveButton(top, left)
    createLoadButton(top, left + 45)
}
function createSaveButton(top, left) {
    const saveButton = document.createElement("button");
    saveButton.className="saveButton";
    saveButton.textContent = "Save";
    saveButton.style.position = "absolute"
    saveButton.style.top = top + "px";
    saveButton.style.left = left + "px";
    saveButton.style.width = ("45px");
    saveButton.style.heigt = ("100px");
    saveButton.draggable = false;
    saveButton.style.zIndex = 0;
    saveButton.onclick = function(){saveSheet()};
    document.body.appendChild(saveButton);
}
export function createLoadButton(top, left) {
    const loadButton = document.createElement("input");
    loadButton.id = "loadButton"
    loadButton.type = "file"
    loadButton.textContent = "Browse...";
    loadButton.style.position = "absolute"
    loadButton.style.top = top + "px";
    loadButton.style.left = left + "px";
    loadButton.style.width = ("70px");
    loadButton.style.heigt = ("100px");
    loadButton.draggable = false;
    loadButton.style.zIndex = 0;
    loadButton.accept = "application/JSON"
    loadButton.addEventListener('change', unpackJson, false);
    document.body.appendChild(loadButton);
    return loadButton
}


// Functions for saving
async function saveSheet() {
    var formfields = document.getElementsByClassName("save")
    var json = {fieldValues:{},layout:currentLayout,lookupElements:lookup.getLookup()}
    for (let i=0 ; i<formfields.length; i++){
        let field = formfields.item(i)
        if (field.className.includes("calc")){
            json["fieldValues"][String(field.id)] = field.textContent
        } else {
            json["fieldValues"][String(field.id)] = field.value
        }
        
    }
    let file=JSON.stringify(json,undefined," ")
    console.log(file)
    
    const blob = new Blob([file], { type: 'application/json' });

    //Tries to save with a "Save as" functionality, (only supported on chromium)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: "character",
          types: [{
            description: "JSON file",
            accept: { "application/json": [".json"] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(file);
        await writable.close();
        console.log("Saved via File System Access API");
        return;
      } catch (err) {
        console.warn("User cancelled or error occurred, falling back...", err);
      }
    } else {
        // Fallback to download
        const blob = new Blob([file], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);

        let nameFields = document.getElementsByClassName("syncMecharacterName")
        if (nameFields && nameFields[0].value!=""){
            console.log(nameFields, nameFields[0].value!="")
            link.download = nameFields[0].value;
        } else {
            link.download = "charactersheet"
        }
            

        
        
        link.click();
        URL.revokeObjectURL(link.href);
    }
}


//Functions for loading
export function unpackJson(){
    const file = this.files[0];
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function() {
        
        loadState(JSON.parse(reader.result));
    }
    reader.onerror = function() {
        console.log(reader.error);
        alert("Error loading file")
    };
}
async function loadLayout(layout){
    document.body.innerHTML = '';
    layoutRenderer.render(layout);
    update.onPageLoad()
}


async function loadState(result){
    let confirmed = true
    if (!await CheckSaved()){ //Check if there is any unsaved data
        if (!confirm("Are you sure you want to open this file, the current one might not be saved.")){
            confirmed = false // Make sure they want to overwrite unsaved data
            // There is a quirk here we might want to fix, no matter if you confirm or not, the browse button will still display the chosen file as if it is loaded
        } 
    }
    if (confirmed){ // Load the file into the sheet
        loadLayout(result.layout)
        lookup.setLookup(result.lookupElements)
        result = result.fieldValues
        for (const property in result){
            try{
                let field = document.getElementById(property)
                if (field.className.includes("calc")){
                    field.textContent = result[property]
                } else {
                    field.value = result[property]
                }
            }
            catch{console.log("did not find: ", property)}
        }
        update.onFileLoad()
    }
}
async function CheckSaved(){
    //To be implemented
    // Shall check if the values in the sheet match the currently loaded file
    // return true if sheet matches loaded file
    // return false if there is unsved data

    return false
}