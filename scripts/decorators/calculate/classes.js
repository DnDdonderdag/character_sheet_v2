function evaluate(left, op, right){
    switch (op.type) {
      case '+': // Addition
        return(left.add(right));
      case '-': // Subtraction
        return left.subtract(right)
      case '*': // Multiplication
        return left.multiply(right)
      case '/': // Division
        return left.divide(right)
      case '^': // Exponentiation
        return left.exponentiate(right)
      default:
        throw new Error(`Invalid operator: ${op}`);
    }
}

export class calcNum {
    constructor(amount){
        this.amount = amount
    }
    toString(){
        return String(this.amount)
    }
    add(that){
        if (that instanceof calcNum){
            return new calcNum(this.amount + that.amount)
        }
        else{
            return new calcString(this.toString() + "+" + that.toString())
        }
    }

    subtract(that){
        if (that instanceof calcNum){
            return new calcNum(this.amount - that.amount)
        }
        else{
            return new calcString(this.toString() + "-" + that.toString())
        }
    }

    multiply(that){
        if (that instanceof calcNum){
            return new calcNum(this.amount * that.amount)
        }
        else if (that instanceof calcDice){
            return new calcDice(this.amount * that.amount, that.type)
        }
        else{
            return new calcString(this.toString() + "*" + that.toString())
        }
    }
}

export class calcDice {
    constructor(amount, type){
        this.amount = amount
        this.type = type
    }
    toString(){
        return this.amount + "d" + this.type
    }
    add(that){
        if (that instanceof calcDice){
            if (that.type == this.type){
                return new calcDice(this.amount + that.amount, this.type )
            }
        } 
        else{
            return new calcString(this.toString() + "+" + that.toString())
        }
    }
    subtract(that){
        if (that instanceof calcDice){
            if (that.type == this.type){
                return new calcDice(this.amount - that.amount, this.type )
            }
        }
        else{
            return new calcString(this.toString() + "-" + that.toString())
        }
    }
    multiply(that){
        if (that instanceof calcNum){
            return new calcDice(this.amount * that.amount, this.type)
        }
        else{
            return new calcString(this.toString() + "*" + that.toString())
        }
    }
}

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
  "(":0,
  ")":0
};

export class operator{
    constructor(type){
        this.type = type
        this.precedence = operators[String(type)].prec
    } 
    toString(){
        return String(this.type)
    }
}

export class calcString{
    constructor(content){
        this.content = content
    }
    add(that){
        return new calcString(this.toString() + "+" + that.toString())
    }
    
    subtract(that){
        return new calcString(this.toString() + "-" + that.toString())
    }

    multiply(that){
        return new calcString(this.toString() + "*" + that.toString())
    }

    toString(){
        return this.content
    }
}

export class calcExpression{
    constructor(left, op, right){
        this.left = left
        this.op = op
        this.right = right
    }

    toString(){
        return "("+this.left.toString() + this.op.toString() + this.right.toString()+")"
    }

    eval(){
        let result 


        //String other associativity
        if (this.left instanceof calcExpression && this.left.left instanceof calcString){
            result = new calcExpression(this.left.left, this.left.op, new calcExpression(this.left.right, this.op, this.right)).eval()
        }
        else if (this.right instanceof calcExpression && this.right.right instanceof calcString){
            result = new calcExpression(new calcExpression(this.left, this.op, this.right.left), this.right.op, this.right.right).eval()
        }

        //General logic
        else if (this.left instanceof calcExpression && this.right instanceof calcExpression){
            result = new calcExpression(this.left.eval(), this.op, this.right.eval()).eval()
        }
        else if
        (this.right instanceof calcExpression){

            result = new calcExpression(this.left, this.op, this.right.eval()).eval()
        }
        else if 
        (this.left instanceof calcExpression){
            result = new calcExpression(this.left.eval(), this.op, this.right).eval()
        }
        else
        {   
            result = evaluate(this.left, this.op, this.right)
        }
        return result
    }
}


let expression1 = new calcExpression(new calcDice(2,6), new operator("+"), new calcString("test"))
let expression2 = new calcExpression(new calcNum(2), new operator("*"), expression1)
let expressionOfExpression = new calcExpression(expression1, new operator("+"), expression2)
//console.log(expression2.eval().toString())




/*
let my8D8 = new calcDice(8,8)
let my6D6 = new calcDice(6,6)
let three = new calcNum(3)
let four  = new calcNum(4)

console.log(my8D8.add(my6D6))
console.log(my8D8.multiply(three).toString())
console.log(three.add(four).toString())
console.log(three.multiply(four).toString())
console.log(three.multiply(my8D8).toString())




*/
