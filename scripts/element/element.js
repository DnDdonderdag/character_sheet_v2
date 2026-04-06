import { Value } from "../value/value.js"

export class Element {
    constructor(master, elementId, valueId, parent, children, top, left, width, height){
        this.master = master
        this.elementId = elementId //Must be unique
        this.valueId = valueId
        this.parent = parent
        this.children = children
        this.top = top
        this.left = left
        this.width = width
        this.height = height
        this.html = null
    }

    getValue() {
        // return this.master.getValueFromId(this.valueId).getDisplayValue()
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

        // ======================== End =======================

        for (const elementId of this.children) {
            let element = this.master.getElementFromId(elementId)
            if (element) {element.draw()}
            else {console.log("could not draw element with elementId" + elementId)}
        }
    }

    save() {

    }


    setElementId(newElementId) {
        if (!newElementId  || newElementId === this.elementId) {return}
        if (this.master.elements && this.master.elements[newElementId]) {
            console.warn("could not set elementId, elementId already exists: " + newElementId)
            return
        }

        const oldElementId = this.elementId

        if (Array.isArray(this.children)) {
            for (const childId of this.children) {
                const child = this.master.getElementFromId(childId)
                if (child) {
                    child.parent = newElementId
                }
            }
        }

        const parentObj = this.parent ? this.master.getElementFromId(this.parent) : null
        if (parentObj && Array.isArray(parentObj.children)) {
            parentObj.children = parentObj.children.map((id) => id === oldElementId ? newElementId : id)
        }

        const valueObj = this.master.getValueFromId(this.valueId)
        if (valueObj) {
            if (Array.isArray(valueObj.parentElements)) {
                valueObj.parentElements = valueObj.parentElements.map((id) => id === oldElementId ? newElementId : id)
            } else {
                if (typeof valueObj.removeParent === "function") {
                    valueObj.removeParent(oldElementId)
                }
                if (typeof valueObj.addParent === "function") {
                    valueObj.addParent(newElementId)
                }
            }
        }

        if (this.master.elements) {
            this.master.elements[newElementId] = this
            delete this.master.elements[oldElementId]
        }

        this.elementId = newElementId

        const existingDiv = document.getElementById(oldElementId)
        if (existingDiv) {
            existingDiv.id = newElementId
        }

        if (this.master.editor && typeof this.master.editor.selectElement === "function") {
            this.master.editor.selectElement(newElementId)
        }

        this.draw()
    
    }
    setValueId(newValueId) {
        if (newValueId === this.valueId) {return}

        const oldValueObj = this.master.getValueFromId(this.valueId)
        if (oldValueObj && typeof oldValueObj.removeParent === "function") {
            oldValueObj.removeParent(this.elementId)
        }

        this.valueId = newValueId

        let newValueObj = this.master.getValueFromId(newValueId)
        if (!newValueObj) {
            newValueObj = new Value(this.master, newValueId, "", [this.elementId], [], [])
            if (typeof this.master.addValue === "function") {
                this.master.addValue(newValueObj)
            }
        }

        if (newValueObj && typeof newValueObj.addParent === "function") {
            newValueObj.addParent(this.elementId)
        }
        this.draw()
        console.log(this.master.values)
    }
    setValue(newValue) {
        const valueObj = this.master.getValueFromId(this.valueId)
        if (!valueObj || typeof valueObj.setValue !== "function") {
            console.warn("could not set value, value not found for valueId: " + this.valueId)
            return
        }
        valueObj.setValue(newValue)
        this.draw()
    }
    setTop(newTop) { //maybe someday dont redraw whole dom, but just update it
        this.top = newTop
        this.draw()
    }
    setLeft(newLeft) {
        this.left = newLeft
        this.draw()
    }
    setWidth(newWidth) {
        this.width = newWidth
        this.draw()
    }
    setHeight(newHeight) {
        this.height = newHeight
        this.draw()
    }
    isDescendant(elementId) {
        for (const childId of this.children) {
            if (childId === elementId) { return true }
            const child = this.master.getElementFromId(childId)
            if (child && child.isDescendant(elementId)) { return true }
        }
        return false
    }
    setParent(newParentId) {
        if (!newParentId || newParentId === this.elementId || newParentId === this.parent) {return}
        if (this.isDescendant(newParentId)) {
            console.warn("could not set parent, new parent is a descendant of this element: " + newParentId)
            return
        }

        const oldParent = this.master.getElementFromId(this.parent)
        const newParent = this.master.getElementFromId(newParentId)

        if (!newParent) {
            console.warn("could not set parent, new parent not found: " + newParentId)
            return
        }

        if (oldParent && Array.isArray(oldParent.children)) {
            oldParent.children = oldParent.children.filter((id) => id !== this.elementId)
        }

        if (!Array.isArray(newParent.children)) {
            newParent.children = []
        }
        if (!newParent.children.includes(this.elementId)) {
            newParent.children.push(this.elementId)
        }

        this.parent = newParentId

        if (typeof this.master.drawElements === "function") {
            this.master.drawElements()
        } else {
            this.draw()
        }
    }
    addChild() {
        // to be implemented
    }
    duplicate(){
        // to be implemented
    }
    _removeInternal(shouldRedraw = true) {
        const childrenCopy = Array.isArray(this.children) ? [...this.children] : []
        for (const childId of childrenCopy) {
            const child = this.master.getElementFromId(childId)
            if (child && typeof child._removeInternal === "function") {
                child._removeInternal(false)
            }
        }

        const existingDiv = document.getElementById(this.elementId)
        if (existingDiv) {
            existingDiv.remove()
        }

        const parentObj = this.parent ? this.master.getElementFromId(this.parent) : null
        if (parentObj && Array.isArray(parentObj.children)) {
            parentObj.children = parentObj.children.filter((id) => id !== this.elementId)
        }

        const valueObj = this.master.getValueFromId(this.valueId)
        if (valueObj) {
            if (typeof valueObj.removeParent === "function") {
                valueObj.removeParent(this.elementId)
            } else if (Array.isArray(valueObj.parentElements)) {
                valueObj.parentElements = valueObj.parentElements.filter((id) => id !== this.elementId)
            }
        }

        if (this.master.elements && this.master.elements[this.elementId]) {
            delete this.master.elements[this.elementId]
        }

        this.children = []
        this.parent = null
        this.html = null

        if (this.master.editor && typeof this.master.editor.selectElement === "function") {
            this.master.editor.selectElement("characterSheet")
        }

        if (shouldRedraw) {
            if (typeof this.master.drawElements === "function") {
                this.master.drawElements()
            }
            if (this.master.editor?.layoutTree && typeof this.master.editor.layoutTree.drawTree === "function") {
                this.master.editor.layoutTree.drawTree()
            }
        }
    }

    remove() {
        const existingModal = document.getElementById("removeElementConfirmModal")
        if (existingModal) {
            existingModal.remove()
        }

        const overlay = document.createElement("div")
        overlay.id = "removeElementConfirmModal"
        overlay.style.position = "fixed"
        overlay.style.inset = "0"
        overlay.style.background = "rgba(0, 0, 0, 0.35)"
        overlay.style.display = "flex"
        overlay.style.alignItems = "center"
        overlay.style.justifyContent = "center"
        overlay.style.zIndex = "20000"

        const modal = document.createElement("div")
        modal.style.background = "#fff"
        modal.style.border = "1px solid #999"
        modal.style.borderRadius = "8px"
        modal.style.padding = "16px"
        modal.style.width = "min(520px, 90vw)"
        modal.style.boxShadow = "0 12px 30px rgba(0,0,0,0.25)"

        const message = document.createElement("div")
        message.textContent = "Are you sure you want to remove this element? Doing so wil also remove all it's children!"
        message.style.marginBottom = "14px"
        message.style.lineHeight = "1.4"

        const actions = document.createElement("div")
        actions.style.display = "flex"
        actions.style.gap = "8px"
        actions.style.justifyContent = "flex-end"

        const noBtn = document.createElement("button")
        noBtn.type = "button"
        noBtn.textContent = "No"
        noBtn.addEventListener("click", () => {
            overlay.remove()
        })

        const yesBtn = document.createElement("button")
        yesBtn.type = "button"
        yesBtn.textContent = "Yes"
        yesBtn.addEventListener("click", () => {
            overlay.remove()
            this._removeInternal(true)
        })

        actions.appendChild(noBtn)
        actions.appendChild(yesBtn)
        modal.appendChild(message)
        modal.appendChild(actions)
        overlay.appendChild(modal)
        document.body.appendChild(overlay)
    }

    getEditingOptions() {
        return [
            {name: "elementId", type: "String", value: this.elementId, function: this.setElementId.bind(this)},
            {name: "valueId", type: "String", value: this.valueId, function: this.setValueId.bind(this)},
            {name: "value", type: "Multiline", value: this.master.getValueFromId(this.valueId).value, function: this.setValue.bind(this)},
            {name: "top", type: "Int", value: this.top, function: this.setTop.bind(this)},
            {name: "left", type: "Int", value: this.left, function: this.setLeft.bind(this)},
            {name: "width", type: "Int", value: this.width, function: this.setWidth.bind(this)},
            {name: "height", type: "Int", value: this.height, function: this.setHeight.bind(this)},
            {name: "parent", type: "String", value: this.parent, function: this.setParent.bind(this)},
            {name: "Add Child", type: "button", value: null, function: this.addChild.bind(this)},
            {name: "Duplicate", type: "button", value: null, function: this.duplicate.bind(this)},
            {name: "Remove Element", type: "button", value: null, function: this.remove.bind(this)}
        ]
    }

    toJSON() {
        return {
            type: this.constructor.name,
            elementId: this.elementId,
            valueId: this.valueId,
            parent: this.parent,
            children: Array.isArray(this.children) ? [...this.children] : [],
            top: this.top,
            left: this.left,
            width: this.width,
            height: this.height,
        }
    }

    static fromJSON(master, data) {
        return new Element(
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
