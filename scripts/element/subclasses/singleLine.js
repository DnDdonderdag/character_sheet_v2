import { Element } from "../element.js"

export class SingleLine extends Element {
    constructor(master, elementId, valueId, parent, children, top, left, width, height, color, maxFontSize, textAlign) {
        super(master, elementId, valueId, parent, children, top, left, width, height)
        this.color = color ? color : "#dde4ff"
        this.maxFontSize = maxFontSize ?? 16
        this.textAlign = ["left", "center", "right"].includes(textAlign) ? textAlign : "left"
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
        elementDIV.style.userSelect = "none"
        elementDIV.style.webkitUserSelect = "none"

        const textarea = document.createElement("input")
        textarea.spellcheck = false
        const stopBubble = (event) => event.stopPropagation()
        textarea.addEventListener("pointerdown", stopBubble)
        textarea.addEventListener("click", stopBubble)
        textarea.style.position = "absolute"
        textarea.style.inset = "0"
        textarea.style.width = "100%"
        textarea.style.height = "100%"
        textarea.style.background = this.color
        textarea.style.boxSizing = "border-box"
        textarea.style.resize = "none"
        textarea.style.overflow = "hidden"
        textarea.style.border = "none"
        textarea.style.outline = "none"
        textarea.style.fontFamily = "Arial, Helvetica, sans-serif"
        textarea.style.textAlign = this.textAlign
        textarea.addEventListener("mouseenter", () => textarea.style.outline = "1px solid black")
        textarea.addEventListener("mouseleave", () => textarea.style.outline = "none")
        textarea.addEventListener("focus", () => {
            textarea.style.outline = "none"
            textarea.value = this.master.getValueFromId(this.valueId).getValue()
        })
        textarea.addEventListener("blur", (event) => {
            const nextValue = textarea.value
            const relatedElementId = event.relatedTarget?.closest?.("div[id]")?.id ?? null
            const shouldRestoreFocus = !!(relatedElementId && this.master.getElementFromId(relatedElementId))

            setTimeout(() => {
                const currentValue = this.master.getValueFromId(this.valueId)?.getDisplayValue()
                if (nextValue !== currentValue) { this.setValue(nextValue) }

                if (shouldRestoreFocus) {
                    setTimeout(() => {
                        const relatedContainer = document.getElementById(relatedElementId)
                        const relatedField = relatedContainer?.querySelector("textarea, input")
                        if (relatedField) {
                            relatedField.focus()
                        }
                    }, 0)
                }
            }, 0)
            textarea.value = this.master.getValueFromId(this.valueId).getValue()
        })
        textarea.value = this.master.getValueFromId(this.valueId).getDisplayValue()
        textarea.addEventListener("focus", () => this.resizeText())
        textarea.addEventListener("blur", () => this.resizeText())
        textarea.addEventListener("change", () => this.resizeText())
        textarea.addEventListener("input", () => this.resizeText())
        elementDIV.appendChild(textarea)
        this.resizeText()

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

    setMaxFontSize(maxFontSize) {
        const nextSize = Number(maxFontSize)
        if (!Number.isFinite(nextSize) || nextSize <= 0) {
            alert("maximum font size must be a positive number")
            return
        }

        this.maxFontSize = nextSize
        this.draw()
    }

    setTextAlign(textAlign) {
        const nextAlign = (textAlign ?? "").toString().trim().toLowerCase()
        if (!["left", "center", "right"].includes(nextAlign)) {
            alert("textAlign must be one of: left, center, right")
            return
        }

        this.textAlign = nextAlign
        this.draw()
    }

    getEditingOptions() {
        return [
            {name: "elementId", type: "String", value: this.elementId, function: this.setElementId.bind(this)},
            {name: "valueId", type: "String", value: this.valueId, function: this.setValueId.bind(this)},
            {name: "value", type: "Multiline", value: this.master.getValueFromId(this.valueId).value, function: this.setValue.bind(this)},
            {name: "color", type: "String", value: this.color, function: this.setColor.bind(this)},
            {name: "maximum font size", type: "Int", value: this.maxFontSize, function: this.setMaxFontSize.bind(this)},
            {name: "text align", type: "String", value: this.textAlign, function: this.setTextAlign.bind(this)},
            {name: "top", type: "Int", value: this.top, function: this.setTop.bind(this)},
            {name: "left", type: "Int", value: this.left, function: this.setLeft.bind(this)},
            {name: "width", type: "Int", value: this.width, function: this.setWidth.bind(this)},
            {name: "height", type: "Int", value: this.height, function: this.setHeight.bind(this)},
            {name: "parent", type: "String", value: this.parent, function: this.setParent.bind(this)},
            {name: "Add Child", type: "button", value: null, function: this.addChild.bind(this)},
            {name: "Export Branch", type: "button", value: null, function: this.exportBranch.bind(this)},
            {name: "Import Branch as Child", type: "button", value: null, function: this.importBranchAsChild.bind(this)},
            {name: "Duplicate", type: "button", value: null, function: this.duplicate.bind(this)},
            {name: "Remove Element", type: "button", value: null, function: this.remove.bind(this)},
        ]
    }

    toJSON() {
        return {
            ...super.toJSON(),
            type: 'SingleLine',
            color: this.color,
            maxFontSize: this.maxFontSize,
            textAlign: this.textAlign,
        }
    }

    resizeText() {
        const triggeringField = this.html?.querySelector("input")
        if (!triggeringField) {
            return
        }

        const maxFont = Number(this.maxFont ?? this.maxFontSize)
        if (!Number.isFinite(maxFont) || maxFont <= 0) {
            return
        }

        const autoSizer = document.createElement("div")
        autoSizer.id = "autoSizer"
        autoSizer.style.setProperty("visibility", "hidden")
        autoSizer.style.setProperty("overflow", "hidden")
        autoSizer.style.setProperty("width", "auto")
        autoSizer.style.setProperty("display", "inline-block")
        autoSizer.style.setProperty("position", "fixed")
        autoSizer.style.setProperty("left", "-10000px")
        autoSizer.style.setProperty("top", "-10000px")
        autoSizer.style.setProperty("white-space", "pre")
        const computedStyle = window.getComputedStyle(triggeringField)
        autoSizer.style.setProperty("font-family", computedStyle.fontFamily)
        autoSizer.style.setProperty("font-weight", computedStyle.fontWeight)
        autoSizer.style.setProperty("font-style", computedStyle.fontStyle)
        autoSizer.style.setProperty("letter-spacing", computedStyle.letterSpacing)
        autoSizer.style.setProperty("text-transform", computedStyle.textTransform)
        document.body.appendChild(autoSizer)

        const setSize = (size) => {
            triggeringField.style.fontSize = `${size}px`
            autoSizer.style.fontSize = `${size}px`
            autoSizer.textContent = triggeringField.value?.length ? triggeringField.value : " "
        }

        const horizontalPadding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
        const availableWidth = Math.max(0, triggeringField.clientWidth - horizontalPadding - 4)
        const overflows = () => autoSizer.offsetWidth > availableWidth

        let low = 1
        let high = maxFont
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

        setSize(Math.min(maxFont, bestFit))

        autoSizer.remove()
    }

    static fromJSON(master, data) {
        return new SingleLine(
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
            data.maxFontSize,
            data.textAlign,
        )
    }
}
