export function calcDecorator(field){
    let className = field.className
    className += " " + "calculated"  
    field.className = className
    field.addEventListener("focus", enterCalc, false);
    field.addEventListener("focusout", exitCalc, false);
    return field
}


function enterCalc(){
   //console.log("calculating "+this.id) //for testing
   let dummy = this.textContent
   this.textContent = this.value
   this.value = dummy
}

function exitCalc(){
    //console.log("uncalculating "+this.id) //for testing
    let dummy = this.textContent
    this.textContent = this.value
    this.value = dummy

    calculationUpdater()
}

function calculate(formula){
    //This is where the actual calculating logic should go
    //It will take the formula as input, and return the result
    let result = formula + " and now im calculated"//temporary remove when implenting

    return result
}

export function calculationUpdater(){
    let affectedFields = document.getElementsByClassName("calculated")
    for (let i = 0; i<affectedFields.length; i++){
        let field = affectedFields[i]
        let formula = field.textContent
        let result = calculate(formula)
        field.value = result
    }
 }
 