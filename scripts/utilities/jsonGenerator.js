export function generateJson(){
    let affectedFields = document.getElementsByClassName("json")
    let json = '"layout" : {'
    for (let i = 0; i<affectedFields.length; i++){
        let field = affectedFields[i]
        json += "\n" + field.json
        
    }
    json = json.slice(0,-1)
    json += '\n},'
    console.log(json)
}