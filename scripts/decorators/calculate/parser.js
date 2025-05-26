import { calcDice, calcNum, operator, calcString } from "./classes.js"
import * as reversePolish from "./reversePolish.js"
import * as shuntingYard from "./shuntingYard.js"

let operatorString = "()+-*/^"

export function evaluate(input){
    try{
        let result = []
        let current = ""
        for (let i = 0; i < input.length; i++){

            //If current character is an operator
            if (operatorString.includes(input[i])){
                if (current.length>0){
                    result.push(current)
                }
                result.push(input[i])
                current = ""
            }
            
            //if current character is a number
            else if (!isNaN(parseFloat(input[i]))) {
                if (isNaN(parseFloat(current))){
                    if (current.length>0){
                    result.push(current)
                    }
                    current = input[i]
                } else {
                    current += input[i]
                }
            } 
            
            //If current character is a string and previous was num
            else if (isNaN(parseFloat(input[i])) && !isNaN(parseFloat(current))){
                result.push(current)
                current = input[i]
            }

            //If current character is a string
            else{
                current += input[i]
            }
        }
        result.push(current)

        //remove elements that are just empty space
        result = result.filter(str => str.trim() !== "");
        
        
        //collect dice
        for (let i = result.length-1; i >= 0; i--) {
            if (result[i] === "d") {
                
                result[i - 1] = new calcDice(parseFloat(result[i-1]), parseFloat(result[i+1]))
                result.splice(i + 1, 1);
                result.splice(i, 1);
            }
        }


        //Assign class
        for (let i = 0; i < result.length; i++){
            if (!(result[i] instanceof calcDice)){
                if (!isNaN(parseFloat(result[i]))){
                    result[i] = new calcNum(parseFloat(result[i]))
                } else if (operatorString.includes(result[i])) {
                    result[i] = new operator(result[i])
                } else {
                    result[i] = new calcString(result[i])
                }
            }
        }


        result = shuntingYard.toRPN(result)
        result = reversePolish.RPNEvaluator(result)
        return result.eval()
    }
    catch{
        return input
    }
}
