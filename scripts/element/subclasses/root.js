import { Element } from "../element.js"

export class Root extends Element {
    constructor(master, elementId, valueId, parent, children, top, left, width, height) {
        super(master, elementId, valueId, parent, children, top, left, width, height)
    }

    draw() {
        let elementDIV = document.getElementById(this.elementId)

        if (elementDIV && this.parent) {
            elementDIV.remove()
            elementDIV = null
        }

        if (this.parent) {
            const parentDiv = document.getElementById(this.parent)
            if (!parentDiv) {
                console.warn("could not draw element, parent not found: " + this.parent)
                return
            }
            elementDIV = document.createElement("div")
            elementDIV.id = this.elementId
            elementDIV.style.position = "absolute"
            parentDiv.appendChild(elementDIV)
        }

        if (!elementDIV) {
            console.warn("could not draw element with elementId " + this.elementId)
            return
        }

        this.html = elementDIV

        for (const elementId of this.children) {
            let element = this.master.getElementFromId(elementId)
            if (element) {element.draw()}
            else {console.log("could not draw element with elementId" + elementId)}
        }
        
    }

    getEditingOptions() {
        return [
            {name: "Add Child", type: "button", value: null, function: this.addChild.bind(this)},
            {name: "Import Branch as Child", type: "button", value: null, function: this.importBranchAsChild.bind(this)},
        ]
    }

    toJSON() {
        return {
            ...super.toJSON(),
            type: "Root",
        }
    }

    static fromJSON(master, data) {
        return new Root(
            master,
            data.elementId,
            data.valueId,
            data.parent,
            Array.isArray(data.children) ? data.children : [],
            data.top,
            data.left,
            data.width,
            data.height,
        )
    }
}
