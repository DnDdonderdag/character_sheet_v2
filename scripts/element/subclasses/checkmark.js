import { Element } from "../element.js"

export class Checkmark extends Element {
    constructor(master, elementId, valueId, parent, children, top, left, width, height, style, color, markColor, stateOff, stateOn) {
        super(master, elementId, valueId, parent, children, top, left, width, height)
        this.style = style ? style : "circle"
        this.color = color ? color : "#dde4ff"
        this.markColor = markColor ? markColor : "gray"
        this.stateOff = stateOff ? stateOff : "0"
        this.stateOn = stateOn ? stateOn : "1"

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

        const mark = document.createElement("div")
        mark.className = "checkmark-token"
        elementDIV.appendChild(mark)
        mark.style.background = this.markColor
        mark.style.position = "absolute"
        mark.style.pointerEvents = "none"
        mark.style.top = "50%"
        mark.style.left = "50%"
        mark.style.transform = "translate(-50%, -50%)"
        mark.style.userSelect = "none"
        mark.style.webkitUserSelect = "none"
        elementDIV.style.border = "none"
        elementDIV.style.boxShadow = "none"


        if (this.style == "circle") {
            elementDIV.style.borderRadius = "50%"
            elementDIV.style.boxShadow = "inset 0 0 0 1px black"
            mark.style.width = "90%"
            mark.style.height = "90%"
            mark.style.borderRadius = "50%"
        }
        else if (this.style == "diamond") {
            mark.style.width = "80%"
            mark.style.height = "80%"
            mark.style.clipPath = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
            mark.style.background = "black"
            elementDIV.style.boxShadow = "inset 0 0 0 1px black"
        }
        elementDIV.style.background = this.color
        elementDIV.style.top = `${this.top}px`
        elementDIV.style.left = `${this.left}px`
        elementDIV.style.width = `${this.width}px`
        elementDIV.style.height = `${this.height}px`
        elementDIV.style.cursor = "pointer"
        elementDIV.style.userSelect = "none"
        elementDIV.style.webkitUserSelect = "none"
        elementDIV.style.outline = "1px solid transparent"

        const updateDirectHoverOutline = (event) => {
            const hoveredNode = document.elementFromPoint(event.clientX, event.clientY)
            const hoveredDiv = hoveredNode?.closest?.("div[id]")
            const isDirectlyHovered = hoveredDiv?.id === this.elementId
            elementDIV.style.outline = isDirectlyHovered ? "1px solid black" : "1px solid transparent"
        }

        elementDIV.addEventListener("mouseenter", updateDirectHoverOutline)
        elementDIV.addEventListener("mousemove", updateDirectHoverOutline)
        elementDIV.addEventListener("mouseleave", () => {
            elementDIV.style.outline = "1px solid transparent"
        })

        let value = this.master.getValueFromId(this.valueId).getDisplayValue()
        let toggledOn
        if (value == this.stateOn) {toggledOn = true} 
        else {toggledOn = false}

        mark.style.display = toggledOn ? "block" : "none"

        const handleClick = (event) => {
            event.stopPropagation()
            this.setValue(toggledOn ? this.stateOff : this.stateOn)
            if (toggledOn) {
                this.master.getValueFromId(this.valueId).setValue(this.stateOff)
            } else {
                this.master.getValueFromId(this.valueId).setValue(this.stateOn)
            }
        }
        elementDIV.addEventListener("click", handleClick)

        
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
            {name: "style", type: "String", value: this.style, function: this.setStyle.bind(this)},
            {name: "color", type: "String", value: this.color, function: this.setColor.bind(this)},
            {name: "mark color", type: "String", value: this.markColor, function: this.setMarkColor.bind(this)},
            {name: "top", type: "Int", value: this.top, function: this.setTop.bind(this)},
            {name: "left", type: "Int", value: this.left, function: this.setLeft.bind(this)},
            {name: "width", type: "Int", value: this.width, function: this.setWidth.bind(this)},
            {name: "height", type: "Int", value: this.height, function: this.setHeight.bind(this)},
            {name: "checkmark color", type: "String", value: this.color, function: this.setColor.bind(this)},
            {name: "'on' state value", type: "String", value: this.stateOn, function: this.setstateOn.bind(this)},
            {name: "'off' state value", type: "String", value: this.stateOff, function: this.setstateOff.bind(this)},
            {name: "parent", type: "String", value: this.parent, function: this.setParent.bind(this)},
                {name: "Export Branch", type: "button", value: null, function: this.exportBranch.bind(this)},
                {name: "Import Branch as Child", type: "button", value: null, function: this.importBranchAsChild.bind(this)},
            {name: "Add Child", type: "button", value: null, function: this.addChild.bind(this)},
            {name: "Duplicate", type: "button", value: null, function: this.duplicate.bind(this)},
            {name: "Remove Element", type: "button", value: null, function: this.remove.bind(this)}
        ]
    }

    setStyle(style) {
        const allowedStyles = ["circle", "diamond"]
        const nextStyle = (style ?? "").trim().toLowerCase()

        if (!allowedStyles.includes(nextStyle)) {
            alert(`Invalid style: "${style}". Allowed styles are: ${allowedStyles.join(", ")}`)
            return
        }

        this.style = nextStyle
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

    setMarkColor(markColor) {
        const nextColor = (markColor ?? "").trim()
        if (!nextColor) {
            this.markColor = "gray"
        } else {
            this.markColor = CSS.supports("color", nextColor) ? nextColor : "gray"
        }
        this.draw()
    }

    setstateOn(stateOn) {
        this.stateOn = stateOn
        this.draw()
    }

    setstateOff(stateOff) {
        this.stateOff = stateOff
        this.draw()
    }

    toJSON() {
        return {
            ...super.toJSON(),
            type: "Checkmark",
            style: this.style,
            color: this.color,
            markColor: this.markColor,
            stateOff: this.stateOff,
            stateOn: this.stateOn,
        }
    }

    static fromJSON(master, data) {
        return new Checkmark(
            master,
            data.elementId,
            data.valueId,
            data.parent,
            Array.isArray(data.children) ? data.children : [],
            data.top,
            data.left,
            data.width,
            data.height,
            data.style,
            data.color,
            data.markColor,
            data.stateOff,
            data.stateOn,
        )
    }
}
