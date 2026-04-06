import { Element } from "../element.js"

export class TextArea extends Element {
    constructor(master, elementId, valueId, parent, children, top, left, width, height, color) {
        super(master, elementId, valueId, parent, children, top, left, width, height)
        this.color = color ? color : "#dde4ff"
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
        
        // ================ draw Element here ================

        elementDIV.style.top = `${this.top}px`
        elementDIV.style.left = `${this.left}px`
        elementDIV.style.width = `${this.width}px`
        elementDIV.style.height = `${this.height}px`

        const textarea = document.createElement("textarea")
        textarea.style.position = "absolute"
        textarea.style.inset = "0"
        textarea.style.width = "100%"
        textarea.style.height = "100%"
        textarea.style.background = this.color
        textarea.style.boxSizing = "border-box"
        textarea.style.resize = "none"
        textarea.style.border = "none"
        textarea.style.outline = "none"
        textarea.addEventListener("mouseenter", () => textarea.style.outline = "1px solid black")
        textarea.addEventListener("mouseleave", () => textarea.style.outline = "none")
        textarea.addEventListener("focus", () => textarea.style.outline = "none")
        textarea.addEventListener("blur", () => {
            const currentValue = this.master.getValueFromId(this.valueId)?.getValue()
            if (textarea.value !== currentValue) { this.setValue(textarea.value) }
        })
        textarea.textContent = this.master.getValueFromId(this.valueId).getDisplayValue()
        elementDIV.appendChild(textarea)

        // ======================== End =======================

        for (const elementId of this.children) {
            let element = this.master.getElementFromId(elementId)
            if (element) {element.draw()}
            else {console.log("could not draw element with elementId" + elementId)}
        }

    }

    setColor(color) {
        const nextColor = (color ?? "").trim()
        if (!nextColor) {
            this.color = "#dde4ff"
        } else {
            this.color = CSS.supports("color", nextColor) ? nextColor : "#dde4ff"
        }
        this.draw()
    }

    getEditingOptions() {
        return [
            {name: "elementId", type: "String", value: this.elementId, function: this.setElementId.bind(this)},
            {name: "valueId", type: "String", value: this.valueId, function: this.setValueId.bind(this)},
            {name: "value", type: "Multiline", value: this.master.getValueFromId(this.valueId).value, function: this.setValue.bind(this)},
            {name: "color", type: "String", value: this.color, function: this.setColor.bind(this)},
            {name: "top", type: "Int", value: this.top, function: this.setTop.bind(this)},
            {name: "left", type: "Int", value: this.left, function: this.setLeft.bind(this)},
            {name: "width", type: "Int", value: this.width, function: this.setWidth.bind(this)},
            {name: "height", type: "Int", value: this.height, function: this.setHeight.bind(this)},
            {name: "parent", type: "String", value: this.parent, function: this.setParent.bind(this)},
            {name: "Add Child", type: "button", value: null, function: this.addChild.bind(this)},
            {name: "Duplicate", type: "button", value: null, function: this.duplicate.bind(this)},
            {name: "Remove Element", type: "button", value: null, function: this.remove.bind(this)},
        ]
    }

    toJSON() {
        return {
            ...super.toJSON(),
            type: "TextArea",
            color: this.color,
        }
    }

    static fromJSON(master, data) {
        return new TextArea(
            master,
            data.elementId,
            data.valueId,
            data.parent,
            Array.isArray(data.children) ? data.children : [],
            data.top,
            data.left,
            data.width,
            data.height,
            data.color,
        )
    }
}
