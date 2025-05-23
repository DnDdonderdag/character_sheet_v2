import * as lookup from "../utilities/lookup.js";


export function calcDecorator(field){
    let className = field.className
    className += " " + "calculated"  
    field.className = className
    return field
}


function calculate(formula){
    //This is where the actual calculating logic should go
    //It will take the formula as input, and return the result
    // Replace all [fieldID] references with the values of those fields
    

    //search and replace square brackets, final first for field reference
    while (formula.lastIndexOf("[")>=0){
        let start = formula.lastIndexOf("[")
        let finish = start + formula.slice(start).indexOf("]")
        let replacementid = formula.slice(start+1,finish)
        let replacementtext
        try{
            replacementtext = document.getElementById(replacementid).value
            replacementtext = (replacementtext == "") ? (0) : (replacementtext)
            formula = formula.replace(formula.slice(start, finish+1), String(replacementtext))
        }
        catch{ 
            replacementtext = "-could not find " + replacementid + "-"
            formula = formula.replace(formula.slice(start, finish+1), String(replacementtext))
            }
    }

    //search and replace square brackets, final first for lookup
    while (formula.lastIndexOf("{")>=0){
        let bracketStartIndex = formula.lastIndexOf("{")
        let bracketEndIndex = bracketStartIndex + formula.slice(bracketStartIndex).indexOf("}")
        let keys = formula.slice(bracketStartIndex+1,bracketEndIndex).toLowerCase().replaceAll(" ","").replaceAll("-","").replaceAll("'","").replaceAll("/","")
        let replacementText
        try{
            replacementText = lookup.fromString(keys.split(","))
            formula = formula.replace(formula.slice(bracketStartIndex, bracketEndIndex+1), String(replacementText))
        }
        catch{ 
            replacementText = "-could not find " + keys + "-"
            formula = formula.replace(formula.slice(bracketStartIndex, bracketEndIndex+1), String(replacementText))
            }
    }
    let result = formula

    return result
}

export function calculationUpdater(){
    //Will redo all the calculations and update all the calculated fields
    //SHOULD NEVER BE CALLED WHEN USER IS EDITING A FORMFIELD
    let affectedFields = document.getElementsByClassName("calculated")
    for (let i = 0; i<affectedFields.length; i++){
        let field = affectedFields[i]
        let formula = field.textContent
        let result = calculate(formula)
        field.value = result
    }
 }
 