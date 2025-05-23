// calc update, whenever any object is edited
// sync updater whenever exiting a synced field
// autosize updater, at every key stroke, and when editing any field
//
import * as button from "../constructors/button.js"
import * as calc from "../decorators/calculations.js"
import * as sync from "../decorators/syncronising.js"
import * as autoSize from "../decorators/autoSize.js";


export function onKeystroke(){
    let triggeringField = this
    autoSize.resize(triggeringField)
}

export function onfocus(){
    let triggeringField = this
    if (triggeringField.className.includes("calc")){
        let dummy = triggeringField.textContent
        triggeringField.textContent = triggeringField.value
        triggeringField.value = dummy
    }
    autoSize.autoSizeUpdater()
}


export function onUnfocus(){
    let triggeringField = this
    if (triggeringField.className.includes("calc")){
        let dummy = triggeringField.textContent
        triggeringField.textContent = triggeringField.value
        triggeringField.value = dummy
    }
    
    if (triggeringField.className.includes("sync")){
        sync.syncUpdater(triggeringField)
    }
    
    downStreamCalculationUpdater()
    autoSize.autoSizeUpdater()
}

export function onPageLoad(){
    button.buttonUpdater()
    downStreamCalculationUpdater()
    autoSize.autoSizeUpdater()
}  

export function onFileLoad(){
    button.buttonUpdater()
    downStreamCalculationUpdater()
    autoSize.autoSizeUpdater()
}

export function onButtonPress(){
    let triggeringField = this

    if (triggeringField.className.includes("button")){
        triggeringField.value = 1 - triggeringField.value
    }

    if (triggeringField.className.includes("sync")){
        sync.syncUpdater(triggeringField)
    }
    
    downStreamCalculationUpdater()
    button.buttonUpdater()
    autoSize.autoSizeUpdater()
}

function downStreamCalculationUpdater(){
    //To be implemented, now just naive version that iterates the update to propagate it
    calc.calculationUpdater()
    calc.calculationUpdater()
    calc.calculationUpdater()
}