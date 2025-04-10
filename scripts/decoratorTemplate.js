export function genericDecorator(field){
    let className = field.className
    className += " decoratorTest"  // replace with relevant classname
    field.className = className
    return field
}

export function genericDecoratorHandler(){
    let affectedFields = document.getElementsByClassName("decoratorTest")
    for (let i = 0; i<affectedFields.length; i++){
        let field = affectedFields[i]
        //code to do something with field:
        console.log("Box height is: "+ getComputedStyle(field).getPropertyValue('--height').trim() + "   (this was printed by decoratorTemplate as an example)")
    }
}