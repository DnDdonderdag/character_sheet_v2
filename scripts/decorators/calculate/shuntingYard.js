import { calcDice, calcNum, operator } from "./classes.js";

const operators = {
  '^': {
    prec: 4,
    assoc: 'right',
  },
  '*': {
    prec: 3,
    assoc: 'left',
  },
  '/': {
    prec: 3,
    assoc: 'left',
  },
  '+': {
    prec: 2,
    assoc: 'left',
  },
  '-': {
    prec: 2,
    assoc: 'left',
  },
};

const assert = (predicate) => {
  if (predicate) return;
  throw new Error('Assertion failed due to invalid token');
};

export const toRPN = (input) => {
  const opSymbols = Object.keys(operators);
  const stack = [];
  let output = [];

  const peek = () => {
    return stack.at(-1);
  };

  const addToOutput = (token) => {
    output.push(token);
  };

  const handlePop = () => {
    return stack.pop();
  }

  const handleToken = (token) => {
    switch (true) {
      case !(token instanceof operator):
        addToOutput(token);
        break;
      case opSymbols.includes(token.type):
        const o1 = token;
        let o2 = peek();

        while (
          o2 !== undefined &&
          o2.type !== '(' &&
          (operators[o2.type].prec > operators[o1.type].prec ||
            (operators[o2.type].prec === operators[o1.type].prec &&
              operators[o1.type].assoc === 'left'))
        ) {
          addToOutput(handlePop());
          o2 = peek();
        }
        stack.push(o1);
        break;
      case token.type === '(':
        stack.push(token);
        break;
      case token.type === ')':
        let topOfStack = peek();
        while (topOfStack.type !== '(') {
          assert(stack.length !== 0);
          addToOutput(handlePop());
          topOfStack = peek();
        }
        assert(peek().type === '(');
        handlePop();
        break;
      default:
        throw new Error(`Invalid token: ${token}`);
    }
  };

  for (let i of input) {
    handleToken(i);
  }

  while (stack.length !== 0) {
    assert(peek() !== '(');
    addToOutput(stack.pop());
  }

  return output;
};

