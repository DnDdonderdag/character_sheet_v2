import { Element } from "../element.js"

export class Frame extends Element {
    constructor(master, elementId, valueId, parent, children, top, left, width, height, title, content, color, maxFontSize, textAlign, inputType) {
        super(master, elementId, valueId, parent, children, top, left, width, height)
        this.title = (title ?? "").toString()
        this.content = this.normalizeContent(content)
        this.color = color ? color : "#dde4ff"
        this.maxFontSize = maxFontSize ?? 16
        this.textAlign = ["left", "center", "right"].includes(textAlign) ? textAlign : "left"
        this.inputType = ["textArea", "singleLine"].includes(inputType) ? inputType : "textArea"
    }

    normalizeContent(content) {
        const normalized = (content ?? "").toString().trim().toLowerCase()
        if (normalized === "true" || normalized === "false") {
            return normalized
        }
        return "true"
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
        elementDIV.style.background = "white"
        elementDIV.style.clipPath = "polygon(7px 0, calc(100% - 7px) 0, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0 calc(100% - 7px), 0 7px)"

        const cornerSize = 20
        const corners = [
            {left: -1, top: -1, transform: "scale(-1, 1)"},
            {left: this.width - cornerSize + 1, top: -1, transform: "scale(1, 1)"},
            {left: this.width - cornerSize + 1, top: this.height - cornerSize + 1, transform: "scale(1, -1)"},
            {left: -1, top: this.height - cornerSize + 1, transform: "scale(-1, -1)"},
        ]

        for (const corner of corners) {
            const cornerIMG = document.createElement("img")
            cornerIMG.src = "assets/svg/FrameCorner.svg"
            cornerIMG.alt = "frame corner"
            cornerIMG.draggable = false
            cornerIMG.style.position = "absolute"
            cornerIMG.style.left = `${corner.left}px`
            cornerIMG.style.top = `${corner.top}px`
            cornerIMG.style.width = `${cornerSize}px`
            cornerIMG.style.height = `${cornerSize}px`
            cornerIMG.style.transform = corner.transform
            cornerIMG.style.transformOrigin = "center"
            cornerIMG.style.pointerEvents = "none"
            cornerIMG.style.userSelect = "none"
            cornerIMG.style.webkitUserSelect = "none"
            elementDIV.appendChild(cornerIMG)
        }

        const lineSize = 20
        const horizontalInset = 7
        const horizontalSpan = Math.max(this.width - (horizontalInset * 2), 0)
        const horizontalScale = horizontalSpan / lineSize
        const verticalScale = Math.max((this.height - 38) / lineSize, 0)
        const halfLine = (lineSize / 2)

        const lines = [
            {src: "assets/svg/HorizontalLine.svg", left: horizontalInset, top: 0, transform: `scale(${horizontalScale}, 1)`, transformOrigin: "left center"},
            {src: "assets/svg/HorizontalLine.svg", left: horizontalInset, top: this.height - lineSize, transform: `scale(${horizontalScale}, -1)`, transformOrigin: "left center"},
            {src: "assets/svg/VerticalLine.svg", left: this.width - lineSize + 1, top: this.height / 2 - halfLine, transform: `scale(1, ${verticalScale})`, transformOrigin: "center"},
            {src: "assets/svg/VerticalLine.svg", left: -1, top: this.height / 2 - halfLine, transform: `scale(-1, ${verticalScale})`, transformOrigin: "center"},
        ]

        for (const line of lines) {
            const lineIMG = document.createElement("img")
            lineIMG.src = line.src
            lineIMG.alt = "frame edge"
            lineIMG.draggable = false
            lineIMG.style.position = "absolute"
            lineIMG.style.left = `${line.left}px`
            lineIMG.style.top = `${line.top}px`
            lineIMG.style.width = `${lineSize}px`
            lineIMG.style.height = `${lineSize}px`
            lineIMG.style.transform = line.transform
            lineIMG.style.transformOrigin = line.transformOrigin ?? "center"
            lineIMG.style.pointerEvents = "none"
            lineIMG.style.userSelect = "none"
            lineIMG.style.webkitUserSelect = "none"
            elementDIV.appendChild(lineIMG)
        }

        if (this.title !== "") {
            const titleDIV = document.createElement("div")
            titleDIV.textContent = this.title
            titleDIV.style.position = "absolute"
            titleDIV.style.left = "0px"
            titleDIV.style.top = `${this.height - 15}px`
            titleDIV.style.width = `${this.width}px`
            titleDIV.style.height = "8px"
            titleDIV.style.textAlign = "center"
            titleDIV.style.fontFamily = "Scalasans"
            titleDIV.style.fontSize = "8px"
            titleDIV.style.lineHeight = "8px"
            titleDIV.style.pointerEvents = "none"
            titleDIV.style.userSelect = "none"
            titleDIV.style.webkitUserSelect = "none"
            elementDIV.appendChild(titleDIV)
        }

        if (this.content === "true") {
            let textarea
            if(this.inputType == "textArea"){
                textarea = document.createElement("textarea")
            }
            else {
                textarea = document.createElement("input")
            }
            
            textarea.spellcheck = false
            const stopBubble = (event) => event.stopPropagation()
            textarea.addEventListener("pointerdown", stopBubble)
            textarea.addEventListener("click", stopBubble)
            textarea.style.position = "absolute"
            textarea.style.right = "auto"
            textarea.style.bottom = "auto"
            textarea.style.width = `${this.width-20}px`
            if (this.title){
                textarea.style.height = `${this.height-23}px`
            } else {
                textarea.style.height = `${this.height-10}px`
            }
            
            textarea.style.top = `${5}px`
            textarea.style.left = `${10}px`
            textarea.style.background = this.color
            textarea.style.boxSizing = "border-box"
            textarea.style.padding = "0"
            textarea.style.margin = "0"
            textarea.style.display = "block"
            textarea.style.resize = "none"
            textarea.style.overflow = "hidden"
            textarea.style.border = "none"
            textarea.style.outline = "none"
            textarea.style.boxShadow = "none"
            textarea.style.fontFamily = "Arial, Helvetica, sans-serif"
            textarea.style.textAlign = this.textAlign
            textarea.addEventListener("mouseenter", () => textarea.style.boxShadow = "inset 0 0 0 1px black")
            textarea.addEventListener("mouseleave", () => textarea.style.boxShadow = "none")
            textarea.addEventListener("focus", () => {
                textarea.style.outline = "none"
                textarea.style.boxShadow = "none"
                textarea.value = this.master.getValueFromId(this.valueId).getValue()
            })
            textarea.addEventListener("blur", (event) => {
                const nextValue = textarea.value
                const relatedElementId = event.relatedTarget?.closest?.("div[id]")?.id ?? null
                const shouldRestoreFocus = !!(relatedElementId && this.master.getElementFromId(relatedElementId))

                setTimeout(() => {
                    const currentValue = this.master.getValueFromId(this.valueId)?.getValue()
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
                textarea.value = this.master.getValueFromId(this.valueId).getDisplayValue()
            })
            textarea.value = this.master.getValueFromId(this.valueId).getDisplayValue()

            if(this.inputType == "textArea"){
                textarea.addEventListener("focus", () => this.resizeText())
                textarea.addEventListener("blur", () => this.resizeText())
                textarea.addEventListener("change", () => this.resizeText())
                textarea.addEventListener("input", () => this.resizeText())
            }
            else {
                textarea.addEventListener("focus", () => this.resizeTextSingleLine())
                textarea.addEventListener("blur", () => this.resizeTextSingleLine())
                textarea.addEventListener("change", () => this.resizeTextSingleLine())
                textarea.addEventListener("input", () => this.resizeTextSingleLine())
            }

            elementDIV.appendChild(textarea)
            if(this.inputType == "textArea"){
                this.resizeText()
            }
            else {
                this.resizeTextSingleLine()
            }
            
        }
        
        
        
        


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
            {name: "title", type: "String", value: this.title, function: this.setTitle.bind(this)},
            {name: "content", type: "String", value: this.content, function: this.setContent.bind(this)},
            {name: "color", type: "String", value: this.color, function: this.setColor.bind(this)},
            {name: "maximum font size", type: "Int", value: this.maxFontSize, function: this.setMaxFontSize.bind(this)},
            {name: "text align", type: "String", value: this.textAlign, function: this.setTextAlign.bind(this)},
            {name: "input type", type: "String", value: this.inputType, function: this.setinputType.bind(this)},
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

    setTitle(title) {
        this.title = (title ?? "").toString()
        this.draw()
    }

    setContent(content) {
        this.content = this.normalizeContent(content)
        this.draw()
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

    setinputType(inputType) {
        const nextInputType = (inputType ?? "").toString().trim()
        if (!["textArea", "singleLine"].includes(nextInputType)) {
            alert("input Type must be one of: textArea or singleLine")
            return
        }

        this.inputType = nextInputType
        this.draw()
    }

    resizeText() {
        const triggeringField = this.html?.querySelector("textarea")
        if (!triggeringField) {
            return
        }

        const maxFont = Number(this.maxFontSize)
        if (!Number.isFinite(maxFont) || maxFont <= 0) {
            return
        }

        const autoSizer = document.createElement("div")
        autoSizer.id = "autoSizer"
        autoSizer.style.setProperty("visibility", "hidden")
        autoSizer.style.setProperty("overflow", "auto")
        autoSizer.style.setProperty("display", "inline-block")
        autoSizer.style.setProperty("position", "fixed")
        autoSizer.style.setProperty("left", "-10000px")
        autoSizer.style.setProperty("top", "-10000px")
        autoSizer.style.setProperty("box-sizing", "border-box")
        autoSizer.style.setProperty("white-space", "pre-wrap")
        autoSizer.style.setProperty("word-break", "break-word")
        autoSizer.style.setProperty("padding", window.getComputedStyle(triggeringField).padding)
        autoSizer.style.setProperty("border", window.getComputedStyle(triggeringField).border)
        autoSizer.style.setProperty("font-family", window.getComputedStyle(triggeringField).fontFamily)
        autoSizer.style.setProperty("line-height", window.getComputedStyle(triggeringField).lineHeight)
        autoSizer.style.setProperty("letter-spacing", window.getComputedStyle(triggeringField).letterSpacing)
        autoSizer.style.setProperty("text-transform", window.getComputedStyle(triggeringField).textTransform)
        document.body.appendChild(autoSizer)

        const setSize = (size) => {
            triggeringField.style.fontSize = `${size}px`
            autoSizer.style.fontSize = `${size}px`
            autoSizer.style.width = `${triggeringField.clientWidth}px`
            autoSizer.textContent = triggeringField.value?.length ? triggeringField.value + " " : " "
        }

        const overflows = () => {
            return autoSizer.scrollHeight > triggeringField.clientHeight || autoSizer.scrollWidth > triggeringField.clientWidth
        }

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

    resizeTextSingleLine() {
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

    toJSON() {
        return {
            ...super.toJSON(),
            type: "Frame",
            title: this.title,
            content: this.content,
            color: this.color,
            maxFontSize: this.maxFontSize,
            textAlign: this.textAlign,
            inputType: this.inputType,
        }
    }

    static fromJSON(master, data) {
        return new Frame(
            master,
            data.elementId,
            data.valueId,
            data.parent,
            Array.isArray(data.children) ? data.children : [],
            data.top,
            data.left,
            data.width,
            data.height,
            data.title,
            data.content,
            data.color,
            data.maxFontSize,
            data.textAlign,
            data.inputType,
        )
    }
}
