import * as lookup from "../../utilities/lookup.js";
import * as parser from "./parser.js"
import * as layoutRenderer from "../../utilities/layoutRenderer.js"


export function calcDecorator(field){
    let className = field.className
    className += " " + "calculated"  
    field.className = className
    if (field.className.includes("json")){
        field.json = field.json.slice(0,field.json.indexOf(":")+1)+'{"function":"calc","args":'+field.json.slice(field.json.indexOf(":")+1,field.json.length-1)+"},"
    }
    return field
}

function searchNReplaceData(start, finish, formula, data){
    let replacementtext
    try{
        replacementtext = document.getElementById(data).value
        replacementtext = (replacementtext == "") ? (0) : (replacementtext)
        formula = formula.replace(formula.slice(start, finish+1), String(replacementtext))
    }
    catch{
        replacementtext = "-could not find " + data + "-"
        formula = formula.replace(formula.slice(start, finish+1), String(replacementtext))
    }
    return formula
}
function evalData(start, finish, formula, data){
        let replacementtext
        try{
            replacementtext = String(eval(data))
            formula = formula.replace(formula.slice(start, finish+1), String(replacementtext))
        }
        catch{ 
            formula = formula.replace(formula.slice(start, finish+1), data)
        }
        return formula
}
function lookupData(start, finish, formula){
        let keys = formula.slice(start+1,finish).toLowerCase().replaceAll(" ","").replaceAll("-","").replaceAll("'","").replaceAll("/","")
        let replacementText
        try{
            replacementText = lookup.fromString(keys.split(","))
            formula = formula.replace(formula.slice(start, finish+1), String(replacementText))
        }
        catch{
            replacementText = "-could not find " + keys + "-"
            formula = formula.replace(formula.slice(start, finish+1), String(replacementText))
        }
        return formula
}

function calculate(formula){
    //This is where the actual calculating logic should go
    //It will take the formula as input, and return the result
    // Replace all [fieldID] references with the values of those fields
    

    //search and replace square brackets, final first for field reference

    let closingSymbols = ["}", "]", "⟩"]
    let openingSymbols = ["{", "[", "⟨"]
    while (true){
        let firstCloser = closingSymbols[closingSymbols.map((e) => (formula.indexOf(e)>=0)?formula.indexOf(e):Infinity).indexOf(Math.min.apply(Math, closingSymbols.map((e) => (formula.indexOf(e)>=0)?formula.indexOf(e):Infinity)))]
        let correspondingOpener = openingSymbols[closingSymbols.map((e) => (formula.indexOf(e)>=0)?formula.indexOf(e):Infinity).indexOf(Math.min.apply(Math, closingSymbols.map((e) => (formula.indexOf(e)>=0)?formula.indexOf(e):Infinity)))]
        let finish = formula.indexOf(firstCloser)
        let start = formula.slice(0,finish).lastIndexOf(correspondingOpener)
        if (start>finish || start == -1 || finish == -1){
            break
        }
        let data = formula.slice(start+1,finish)
        if (correspondingOpener == "["){
            formula = searchNReplaceData(start, finish, formula, data)
        } else if(correspondingOpener == "{"){
            formula = evalData(start, finish, formula, data)
        } else if(correspondingOpener == "⟨"){
            formula = lookupData(start, finish, formula)
        } else {
            console.log("something went wrong")
        }
    }
    return formula
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


