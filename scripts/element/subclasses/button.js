import { Element } from "../element.js"

export class Button extends Element {
    constructor(master, elementId, valueId, parent, children, top, left, width, height, buttonText, color, backgroundColor, alignment, font, fontSize) {
        super(master, elementId, valueId, parent, children, top, left, width, height)
        this.buttonText = (buttonText ?? "").toString().trim() || "button"
        this.color = (color ?? "").toString().trim() || "black"
        this.backgroundColor = (backgroundColor ?? "").toString().trim() || "#c5c6c7"
        this.alignment = ["left", "center", "right"].includes((alignment ?? "").toString().trim().toLowerCase())
            ? (alignment ?? "").toString().trim().toLowerCase()
            : "center"
        this.font = (font ?? "").toString().trim() || "scalasans"
        this.fontSize = Number.isFinite(Number(fontSize)) && Number(fontSize) > 0 ? Number(fontSize) : 12
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
        elementDIV.style.color = this.color
        elementDIV.style.background = this.backgroundColor
        elementDIV.style.textAlign = this.alignment
        elementDIV.style.fontFamily = this.font
        elementDIV.style.fontSize = `${this.fontSize}px`
        elementDIV.style.display = "flex"
        elementDIV.style.alignItems = "center"
        if (this.alignment === "left") {
            elementDIV.style.justifyContent = "flex-start"
        } else if (this.alignment === "right") {
            elementDIV.style.justifyContent = "flex-end"
        } else {
            elementDIV.style.justifyContent = "center"
        }
        elementDIV.style.cursor = "pointer"
        elementDIV.style.userSelect = "none"
        elementDIV.style.boxSizing = "border-box"
        elementDIV.style.border = "1px solid transparent"
        elementDIV.style.whiteSpace = "pre-wrap"
        elementDIV.style.wordBreak = "break-word"
        elementDIV.addEventListener("mouseenter", () => {
            elementDIV.style.border = "1px solid black"
        })
        elementDIV.addEventListener("mouseleave", () => {
            elementDIV.style.border = "1px solid transparent"
        })

        elementDIV.textContent = this.buttonText
        elementDIV.addEventListener("click", (event) => {
            event.stopPropagation()
            this.runButton()
        })


        // ======================== End =======================

        for (const elementId of this.children) {
            let element = this.master.getElementFromId(elementId)
            if (element) {element.draw()}
            else {console.log("could not draw element with elementId" + elementId)}
        }

    }

    runButton() {
        const displayText = this.master.getValueFromId(this.valueId)?.getDisplayValue?.() ?? ""
        if (!displayText.trim()) {
            console.warn(`Button ${this.elementId}: no JavaScript to execute`)
            return
        }

        try {
            eval(displayText)
        } catch (error) {
            console.warn(`Button ${this.elementId}: invalid JavaScript`, error)
            return
        }
    }

    openWindow(keyset) {
        this.master.lookup.openFloatingWindowFromKeyset(keyset)
    }

    changeValue(valueId, newValue) {
        this.master.getValueFromId(valueId).setValue(String(newValue))
    }

    readValue(valueId) {
        return this.master.getValueFromId(valueId).getDisplayValue()
    }


    getEditingOptions() {
        return [
            {name: "elementId", type: "String", value: this.elementId, function: this.setElementId.bind(this)},
            {name: "valueId", type: "String", value: this.valueId, function: this.setValueId.bind(this)},
            {name: "value", type: "Multiline", value: this.master.getValueFromId(this.valueId).value, function: this.setValue.bind(this)},
            {name: "button text", type: "String", value: this.buttonText, function: this.setButtonText.bind(this)},
            {name: "text color", type: "String", value: this.color, function: this.setColor.bind(this)},
            {name: "background color", type: "String", value: this.backgroundColor, function: this.setBackgroundColor.bind(this)},
            {name: "alignment", type: "String", value: this.alignment, function: this.setAlignment.bind(this)},
            {name: "font", type: "String", value: this.font, function: this.setFont.bind(this)},
            {name: "font size", type: "Int", value: this.fontSize, function: this.setFontSize.bind(this)},
            {name: "top", type: "Int", value: this.top, function: this.setTop.bind(this)},
            {name: "left", type: "Int", value: this.left, function: this.setLeft.bind(this)},
            {name: "width", type: "Int", value: this.width, function: this.setWidth.bind(this)},
            {name: "height", type: "Int", value: this.height, function: this.setHeight.bind(this)},
            {name: "parent", type: "String", value: this.parent, function: this.setParent.bind(this)},
            {name: "Add Child", type: "button", value: null, function: this.addChild.bind(this)},
            {name: "Export Branch", type: "button", value: null, function: this.exportBranch.bind(this)},
            {name: "Import Branch as Child", type: "button", value: null, function: this.importBranchAsChild.bind(this)},
            {name: "Duplicate", type: "button", value: null, function: this.duplicate.bind(this)},
            {name: "Remove Element", type: "button", value: null, function: this.remove.bind(this)}
        ]
    }

    setButtonText(buttonText) {
        this.buttonText = (buttonText ?? "").toString().trim() || "button"
        this.draw()
    }

    setColor(color) {
        const nextColor = (color ?? "").toString().trim()
        if (!nextColor) {
            this.color = "black"
        } else {
            this.color = CSS.supports("color", nextColor) ? nextColor : "black"
        }
        this.draw()
    }

    setBackgroundColor(backgroundColor) {
        const nextColor = (backgroundColor ?? "").toString().trim()
        if (!nextColor) {
            this.backgroundColor = "#c5c6c7"
        } else {
            this.backgroundColor = CSS.supports("color", nextColor) ? nextColor : "#c5c6c7"
        }
        this.draw()
    }

    setAlignment(alignment) {
        const nextAlignment = (alignment ?? "").toString().trim().toLowerCase()
        if (!["left", "center", "right"].includes(nextAlignment)) {
            alert("alignment must be one of: left, center, right")
            return
        }

        this.alignment = nextAlignment
        this.draw()
    }

    setFont(font) {
        this.font = (font ?? "").toString().trim() || "scalasans"
        this.draw()
    }

    setFontSize(fontSize) {
        const nextSize = Number(fontSize)
        if (!Number.isFinite(nextSize) || nextSize <= 0) {
            alert("font size must be a positive number")
            return
        }

        this.fontSize = nextSize
        this.draw()
    }

    toJSON() {
        return {
            ...super.toJSON(),
            type: "Button",
            buttonText: this.buttonText,
            color: this.color,
            backgroundColor: this.backgroundColor,
            alignment: this.alignment,
            font: this.font,
            fontSize: this.fontSize,
        }
    }

    static fromJSON(master, data) {
        return new Button(
            master,
            data.elementId,
            data.valueId,
            data.parent,
            Array.isArray(data.children) ? data.children : [],
            data.top,
            data.left,
            data.width,
            data.height,
            data.buttonText,
            data.color,
            data.backgroundColor,
            data.alignment,
            data.font,
            data.fontSize,
        )
    }
}


