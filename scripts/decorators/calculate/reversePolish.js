import { calcNum, calcDice, operator, calcExpression, calcString } from "./classes.js";
import * as shuntingYard from "./shuntingYard.js"


export const RPNEvaluator = (input) => {
  const stack = [];

  const handleToken = (token) => {
    if (!(token instanceof operator)) {
      stack.push(token);
      return;
    }

    const right = stack.pop();
    const left = stack.pop();
    stack.push(new calcExpression(left, token, right));
  };

  for (let i of input) {
    handleToken(i);
  }

  return stack.pop();
};



let input = [new operator("("), new calcDice(2,6), new operator("+"), new calcNum(2), new operator("*"), new calcDice(2,6), new operator(")"), new operator("*"),new calcNum(2)]
const rpn = shuntingYard.toRPN(input);
const evaluation = RPNEvaluator(rpn)
//console.log(evaluation.eval().toString())


//const input = parseExpression("Ik wil weten wat ((12+(3*2-1)) * 22d6 + 2d6)*2 als uitkomst geeft")