import { Element } from "../element.js"

export class ImageHolder extends Element {
    constructor(master, elementId, valueId, parent, children, top, left, width, height, imageString) {
        super(master, elementId, valueId, parent, children, top, left, width, height)
        this.imageString = (imageString ?? "").toString()
    }

    setImageString(newImageString) {
        this.imageString = (newImageString ?? "").toString()
        this.draw()
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
        elementDIV.style.cursor = "pointer"

        elementDIV.addEventListener("click", (event) => {
            event.stopPropagation()

            const input = document.createElement("input")
            input.type = "file"
            input.accept = "image/*"

            input.addEventListener("change", () => {
                const file = input.files?.[0]
                if (!file) { return }

                const reader = new FileReader()
                reader.onload = () => {
                    const encodedImage = typeof reader.result === "string" ? reader.result : ""
                    if (!encodedImage) { return }
                    this.setImageString(encodedImage)
                }
                reader.onerror = () => {
                    alert("Could not read selected image")
                }
                reader.readAsDataURL(file)
            }, { once: true })

            input.click()
        })
        const imageValue = this.imageString

        if (imageValue) {
            const safeUrl = imageValue.replace(/"/g, "\\\"")
            elementDIV.style.backgroundImage = `url("${safeUrl}")`
            elementDIV.style.backgroundSize = "contain"
            elementDIV.style.backgroundRepeat = "no-repeat"
            elementDIV.style.backgroundPosition = "center center"
        } else {
            elementDIV.style.backgroundImage = "none"
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
            {name: "image string", type: "Multiline", value: this.imageString, function: this.setImageString.bind(this)},
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

    toJSON() {
        return {
            ...super.toJSON(),
            type: this.constructor.name,
            imageString: this.imageString,
        }
    }

    static fromJSON(master, data) {
        return new ImageHolder(
            master,
            data.elementId,
            data.valueId,
            data.parent,
            Array.isArray(data.children) ? data.children : [],
            data.top,
            data.left,
            data.width,
            data.height,
            data.imageString,
        )
    }
}
