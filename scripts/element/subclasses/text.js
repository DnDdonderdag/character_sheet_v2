import { Element } from "../element.js"

export class Text extends Element {
    constructor(master, elementId, valueId, parent, children, top, left, width, height, fontSize, font, color, alignment) {
        super(master, elementId, valueId, parent, children, top, left, width, height)
        const normalizedSize = (fontSize ?? "").toString().trim().toLowerCase()
        if (normalizedSize === "auto") {
            this.fontSize = "auto"
        } else if (normalizedSize === "") {
            this.fontSize = 12
        } else if (Number.isFinite(Number(fontSize)) && Number(fontSize) > 0) {
            this.fontSize = Number(fontSize)
        } else {
            this.fontSize = 12
        }
        this.font = (font ?? "").toString().trim() || "scalasans"
        this.color = (color ?? "").toString().trim() || "black"
        this.alignment = ["left", "center", "right"].includes((alignment ?? "").toString().trim().toLowerCase())
            ? (alignment ?? "").toString().trim().toLowerCase()
            : "center"
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
        elementDIV.style.fontFamily = this.font
        elementDIV.style.color = this.color
        elementDIV.style.textAlign = this.alignment
        elementDIV.style.whiteSpace = "pre-wrap"
        elementDIV.style.wordBreak = "break-word"
        elementDIV.style.overflow = "hidden"
        elementDIV.style.boxSizing = "border-box"
        elementDIV.style.userSelect = "none"
        elementDIV.style.webkitUserSelect = "none"

        const displayValue = this.master.getValueFromId(this.valueId)?.getDisplayValue?.() ?? ""

        if (this.fontSize === "auto") {
            elementDIV.style.fontSize = `${this.getAutoFontSize(elementDIV, displayValue)}px`
        } else {
            elementDIV.style.fontSize = `${this.fontSize}px`
        }

        elementDIV.textContent = displayValue


        // ======================== End =======================

        for (const elementId of this.children) {
            let element = this.master.getElementFromId(elementId)
            if (element) {element.draw()}
            else {console.log("could not draw element with elementId" + elementId)}
        }

    }

    getEditingOptions() {
        return [
            {name: "elementId", type: "String", value: this.elementId, function: this.setElementId.bind(this)},
            {name: "valueId", type: "String", value: this.valueId, function: this.setValueId.bind(this)},
            {name: "value", type: "Multiline", value: this.master.getValueFromId(this.valueId).value, function: this.setValue.bind(this)},
            {name: "font size", type: "String", value: this.fontSize, function: this.setFontSize.bind(this)},
            {name: "font", type: "String", value: this.font, function: this.setFont.bind(this)},
            {name: "color", type: "String", value: this.color, function: this.setColor.bind(this)},
            {name: "alignment", type: "String", value: this.alignment, function: this.setAlignment.bind(this)},
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

    setFontSize(fontSize) {
        const normalizedSize = (fontSize ?? "").toString().trim().toLowerCase()
        if (normalizedSize === "auto") {
            this.fontSize = "auto"
            this.draw()
            return
        }

        if (normalizedSize === "") {
            this.fontSize = 12
            this.draw()
            return
        }

        const nextSize = Number(fontSize)
        if (!Number.isFinite(nextSize) || nextSize <= 0) {
            alert("font size must be a positive number or 'auto'")
            return
        }

        this.fontSize = nextSize
        this.draw()
    }

    getAutoFontSize(target, text) {
        const autoSizer = document.createElement("div")
        autoSizer.style.visibility = "hidden"
        autoSizer.style.position = "fixed"
        autoSizer.style.left = "-10000px"
        autoSizer.style.top = "-10000px"
        autoSizer.style.boxSizing = "border-box"
        autoSizer.style.whiteSpace = "pre-wrap"
        autoSizer.style.wordBreak = "break-word"
        autoSizer.style.fontFamily = this.font
        autoSizer.style.textAlign = this.alignment
        autoSizer.style.width = `${Math.max(0, target.clientWidth)}px`
        autoSizer.textContent = text?.length ? text : " "
        document.body.appendChild(autoSizer)

        const overflows = () => {
            return autoSizer.scrollHeight > target.clientHeight || autoSizer.scrollWidth > target.clientWidth
        }

        const setSize = (size) => {
            autoSizer.style.fontSize = `${size}px`
        }

        let low = 1
        let high = 256
        let bestFit = 1

        setSize(low)
        if (!overflows()) {
            bestFit = low
            for (let i = 0; i < 16; i++) {
                const mid = (low + high) / 2
                setSize(mid)
                if (overflows()) {
                    high = mid
                } else {
                    bestFit = mid
                    low = mid
                }
            }
        }

        autoSizer.remove()
        return Math.max(1, bestFit)
    }

    setFont(font) {
        this.font = (font ?? "").toString().trim() || "scalasans"
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

    setAlignment(alignment) {
        const nextAlignment = (alignment ?? "").toString().trim().toLowerCase()
        if (!["left", "center", "right"].includes(nextAlignment)) {
            alert("alignment must be one of: left, center, right")
            return
        }

        this.alignment = nextAlignment
        this.draw()
    }

    toJSON() {
        return {
            ...super.toJSON(),
            type: "Text",
            fontSize: this.fontSize,
            font: this.font,
            color: this.color,
            alignment: this.alignment,
        }
    }

    static fromJSON(master, data) {
        return new Text(
            master,
            data.elementId,
            data.valueId,
            data.parent,
            Array.isArray(data.children) ? data.children : [],
            data.top,
            data.left,
            data.width,
            data.height,
            data.fontSize,
            data.font,
            data.color,
            data.alignment,
        )
    }
}
