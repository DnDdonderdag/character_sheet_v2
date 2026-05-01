import { Element } from "../element.js"

// Things to change Checklist:
// Class name
// draw
// getEditingOptions
// Functions added from editingOptions
// toJson
// fromJson
// elementTypeMap in loadFile in Saveload
// import in SaveLoad
// add elementtype to element.addChild (list and prompt)


export class Svg extends Element {
    constructor(master, elementId, valueId, parent, children, top, left, width, height, path) {
        super(master, elementId, valueId, parent, children, top, left, width, height)
        this.path = path ?? ""
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

        elementDIV.textContent = ""

        const svgImg = document.createElement("img")
        svgImg.alt = this.path || "svg"
        svgImg.draggable = false
        svgImg.style.position = "absolute"
        svgImg.style.inset = "0"
        svgImg.style.width = "100%"
        svgImg.style.height = "100%"
        svgImg.style.objectFit = "contain"
        svgImg.style.pointerEvents = "none"
        svgImg.style.userSelect = "none"
        svgImg.style.webkitUserSelect = "none"

        const normalizedPath = (this.path ?? "").toString().trim().replace(/^\/+/, "")
        svgImg.src = `../../../assets/svg/${normalizedPath}`


        const cssText = this.master.getValueFromId(this.valueId)?.getDisplayValue?.() ?? ""

        // Optional: remove previously applied dynamic props
        if (!Array.isArray(this._dynamicCssProps)) {
            this._dynamicCssProps = []
        }
        for (const prop of this._dynamicCssProps) {
            elementDIV.style.removeProperty(prop)
        }
        this._dynamicCssProps = []

        // Parse safely using a temp element
        const parser = document.createElement("div")
        parser.style.cssText = cssText

        // Optional protect layout-owned props
        const blocked = new Set(["position", "top", "left", "width", "height"])

        // Apply parsed declarations
        for (const prop of parser.style) {
            if (blocked.has(prop)) continue
            const value = parser.style.getPropertyValue(prop)
            const priority = parser.style.getPropertyPriority(prop) // handles !important
            elementDIV.style.setProperty(prop, value, priority)
            this._dynamicCssProps.push(prop)
        }

        elementDIV.appendChild(svgImg)


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
            {name: "value (added css)", type: "Multiline", value: this.master.getValueFromId(this.valueId).value, function: this.setValue.bind(this)},
            {name: "SVG path", type: "String", value: this.path, function: this.setPath.bind(this)},
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

    setPath(path) {
        let nextPath = (path ?? "").toString().trim()
        if (nextPath && !nextPath.toLowerCase().endsWith(".svg")) {
            nextPath += ".svg"
        }
        this.path = nextPath
        this.draw()
    }

    toJSON() {
        return {
            ...super.toJSON(),
            type: "Svg",
            path: this.path,
        }
    }

    static fromJSON(master, data) {
        return new Svg(
            master,
            data.elementId,
            data.valueId,
            data.parent,
            Array.isArray(data.children) ? data.children : [],
            data.top,
            data.left,
            data.width,
            data.height,
            data.path,
        )
    }
}
