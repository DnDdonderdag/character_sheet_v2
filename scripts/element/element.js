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
        return this.master.getValueFromId(this.valueId).getDisplayValue()
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
        const typeInput = prompt("Element type (TextArea, SingleLine, Checkmark, Svg, Text, Button, Page, Blank, Css, Frame):", "Frame")
        if (typeInput === null) { return }

        const type = (typeInput || "Element").trim()

        const elementIdInput = prompt("New elementId:")
        if (elementIdInput === null) { return }
        const elementId = elementIdInput.trim()
        if (!elementId) {
            alert("elementId is required")
            return
        }
        if (this.master.elements && this.master.elements[elementId]) {
            alert("elementId already exists")
            return
        }

        const valueIdDefault = `${elementId}_value`
        const valueIdInput = prompt("valueId (leave empty for null):", valueIdDefault)
        if (valueIdInput === null) { return }
        const valueId = valueIdInput.trim() === "" ? null : valueIdInput.trim()

        const parentInput = prompt("parent elementId:", this.elementId)
        if (parentInput === null) { return }
        const parent = parentInput.trim() || this.elementId
        if (!this.master.getElementFromId(parent)) {
            alert("Parent element not found")
            return
        }

        const children = []

        const top = Number(prompt("top:", "10"))
        const left = Number(prompt("left:", "10"))
        const width = Number(prompt("width:", "120"))
        const height = Number(prompt("height:", "60"))

        if ([top, left, width, height].some((v) => Number.isNaN(v))) {
            alert("top/left/width/height must be numbers")
            return
        }

        const ensureValueExists = () => {
            if (!valueId) { return true }

            const existing = this.master.getValueFromId(valueId)
            if (existing) {
                if (typeof existing.addParent === "function") {
                    existing.addParent(elementId)
                }
                return true
            }

            const initialValueInput = prompt("Initial value for valueId:", "")
            if (initialValueInput === null) { return false }

            const newValue = new Value(this.master, valueId, initialValueInput, [elementId], [], [])
            if (typeof this.master.addValue === "function") {
                this.master.addValue(newValue)
            } else {
                this.master.values[valueId] = newValue
            }

            return true
        }

        const finalizeAttach = (newElement) => {
            if (!Array.isArray(newElement.children)) {
                newElement.children = []
            }

            this.master.elements[elementId] = newElement

            const parentElement = this.master.getElementFromId(parent)
            if (parentElement) {
                if (!Array.isArray(parentElement.children)) {
                    parentElement.children = []
                }
                if (!parentElement.children.includes(elementId)) {
                    parentElement.children.push(elementId)
                }
            }

            if (typeof this.master.drawElements === "function") {
                this.master.drawElements()
            } else {
                newElement.draw()
            }

            if (this.master.editor?.layoutTree && typeof this.master.editor.layoutTree.drawTree === "function") {
                this.master.editor.layoutTree.drawTree()
            }
            if (this.master.editor && typeof this.master.editor.selectElement === "function") {
                this.master.editor.selectElement(elementId)
            }
        }

        if (!ensureValueExists()) { return }

        const createElement = async () => {
            try {
                const CHILD_ELEMENT_CLASSES = { // Add new subclasses here
                    textarea: async () => (await import("./subclasses/textArea.js")).TextArea,
                    checkmark: async () => (await import("./subclasses/checkmark.js")).Checkmark,
                    singleline: async () => (await import("./subclasses/singleLine.js")).SingleLine,
                    svg: async () => (await import("./subclasses/svg.js")).Svg,
                    text: async () => (await import("./subclasses/text.js")).Text,
                    button: async () => (await import("./subclasses/button.js")).Button,
                    page: async () => (await import("./subclasses/page.js")).Page,
                    blank: async () => (await import("./subclasses/blank.js")).Blank,
                    css: async () => (await import("./subclasses/css.js")).Css,
                    frame: async () => (await import("./subclasses/frame.js")).Frame,
                }

                const key = type.toLowerCase()
                const resolver = CHILD_ELEMENT_CLASSES[key]

                if (!resolver) {
                    alert("Unknown element type. Use TextArea, SingleLine, Checkmark, Svg, Text, Button, Page, Blank, Css, or Frame.")
                    return
                }

                const SelectedClass = await resolver()
                let specialArgs = [null, null, null, null, null]
                if (key === "svg") {
                    const path = prompt("SVG path:", "")
                    if (path === null) {
                        return
                    }
                    specialArgs = [path]
                }

                finalizeAttach(new SelectedClass(
                    this.master,
                    elementId,
                    valueId,
                    parent,
                    children,
                    top,
                    left,
                    width,
                    height,
                    ...specialArgs,
                ))
            } catch (error) {
                console.error("Could not create child element", error)
                alert("Could not create child element. Check console for details.")
            }
        }

        createElement()
    }
    duplicate(){
        const sourceIds = []
        const collectSubtreeIds = (elementId) => {
            const element = this.master.elements?.[elementId]
            if (!element) { return }
            sourceIds.push(elementId)
            for (const childId of Array.isArray(element.children) ? element.children : []) {
                collectSubtreeIds(childId)
            }
        }
        collectSubtreeIds(this.elementId)

        if (sourceIds.length === 0) {
            alert("could not duplicate element subtree")
            return
        }

        const existingIds = new Set(Object.keys(this.master.elements ?? {}))
        const allocatedIds = new Set()

        const makeCopyId = (oldId) => {
            const base = `${oldId}Copy`
            let candidate = base
            let counter = 2

            while (existingIds.has(candidate) || allocatedIds.has(candidate)) {
                candidate = `${base}${counter}`
                counter += 1
            }

            allocatedIds.add(candidate)
            return candidate
        }

        const idMap = {}
        for (const oldId of sourceIds) {
            idMap[oldId] = makeCopyId(oldId)
        }

        const createdElements = {}
        for (const oldId of sourceIds) {
            const sourceElement = this.master.elements?.[oldId]
            if (!sourceElement) { continue }

            const cloneData = sourceElement.toJSON()
            cloneData.elementId = idMap[oldId]
            cloneData.parent = oldId === this.elementId
                ? this.parent
                : (idMap[sourceElement.parent] ?? sourceElement.parent)
            cloneData.children = (Array.isArray(sourceElement.children) ? sourceElement.children : [])
                .map((childId) => idMap[childId])
                .filter(Boolean)

            const SourceClass = sourceElement.constructor
            let clonedElement
            if (SourceClass && typeof SourceClass.fromJSON === "function") {
                clonedElement = SourceClass.fromJSON(this.master, cloneData)
            } else {
                clonedElement = Element.fromJSON(this.master, cloneData)
            }

            createdElements[cloneData.elementId] = clonedElement
        }

        for (const [newId, newElement] of Object.entries(createdElements)) {
            this.master.elements[newId] = newElement
        }

        const duplicatedRootId = idMap[this.elementId]
        if (this.parent) {
            const parentElement = this.master.getElementFromId(this.parent)
            if (parentElement) {
                if (!Array.isArray(parentElement.children)) {
                    parentElement.children = []
                }
                if (!parentElement.children.includes(duplicatedRootId)) {
                    parentElement.children.push(duplicatedRootId)
                }
            }
        }

        for (const newElement of Object.values(createdElements)) {
            if (!newElement.valueId) { continue }
            const valueObj = this.master.getValueFromId(newElement.valueId)
            if (!valueObj) { continue }

            if (typeof valueObj.addParent === "function") {
                valueObj.addParent(newElement.elementId)
            } else if (Array.isArray(valueObj.parentElements) && !valueObj.parentElements.includes(newElement.elementId)) {
                valueObj.parentElements.push(newElement.elementId)
            }
        }

        if (typeof this.master.drawElements === "function") {
            this.master.drawElements()
        }

        if (this.master.editor?.layoutTree && typeof this.master.editor.layoutTree.drawTree === "function") {
            this.master.editor.layoutTree.drawTree()
        }

        if (this.master.editor && typeof this.master.editor.selectElement === "function") {
            this.master.editor.selectElement(duplicatedRootId)
        }
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

    _collectBranchElementIds(rootElementId = this.elementId) {
        const collectedIds = []
        const visit = (elementId) => {
            const element = this.master.elements?.[elementId]
            if (!element) { return }
            collectedIds.push(elementId)
            for (const childId of Array.isArray(element.children) ? element.children : []) {
                visit(childId)
            }
        }
        visit(rootElementId)
        return collectedIds
    }

    _buildBranchExportData(rootElementId = this.elementId) {
        const elementIds = this._collectBranchElementIds(rootElementId)
        const usedValueIds = new Set()

        const elements = {}
        for (const elementId of elementIds) {
            const element = this.master.elements?.[elementId]
            if (!element || typeof element.toJSON !== "function") { continue }
            elements[elementId] = element.toJSON()
            if (element.valueId) {
                usedValueIds.add(element.valueId)
            }
        }

        const values = {}
        for (const valueId of usedValueIds) {
            const value = this.master.values?.[valueId]
            if (!value || typeof value.toJSON !== "function") { continue }
            values[valueId] = value.toJSON()
        }

        return {
            elements,
            values,
        }
    }

    exportBranch() {
        const exportData = this._buildBranchExportData(this.elementId)
        const content = JSON.stringify(exportData, null, 2)
        const blob = new Blob([content], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = `${this.elementId}-branch.branch`
        document.body.appendChild(a)
        a.click()
        a.remove()

        URL.revokeObjectURL(url)
    }

    _makeUniqueId(baseId, takenIds) {
        let candidate = baseId
        let suffix = 2
        while (takenIds.has(candidate)) {
            candidate = `${baseId}${suffix}`
            suffix += 1
        }
        takenIds.add(candidate)
        return candidate
    }

    _makeImportId(baseId, takenIds) {
        if (!takenIds.has(baseId)) {
            takenIds.add(baseId)
            return baseId
        }
        return this._makeUniqueId(`${baseId}Import`, takenIds)
    }

    async _resolveElementClass(type) {
        const key = (type ?? "Element").toString().trim().toLowerCase()
        const CLASS_LOADERS = {
            element: async () => Element,
            root: async () => (await import("./subclasses/root.js")).Root,
            textarea: async () => (await import("./subclasses/textArea.js")).TextArea,
            checkmark: async () => (await import("./subclasses/checkmark.js")).Checkmark,
            singleline: async () => (await import("./subclasses/singleLine.js")).SingleLine,
            svg: async () => (await import("./subclasses/svg.js")).Svg,
            text: async () => (await import("./subclasses/text.js")).Text,
            button: async () => (await import("./subclasses/button.js")).Button,
            page: async () => (await import("./subclasses/page.js")).Page,
            blank: async () => (await import("./subclasses/blank.js")).Blank,
            css: async () => (await import("./subclasses/css.js")).Css,
            frame: async () => (await import("./subclasses/frame.js")).Frame,
        }

        const loader = CLASS_LOADERS[key] ?? CLASS_LOADERS.element
        return loader()
    }

    _rebuildAllValueReferences() {
        const allValues = Object.values(this.master.values ?? {})

        for (const value of allValues) {
            value.references = []
            value.referencedBy = []
            value.tempReferences = []
        }

        for (const value of allValues) {
            try {
                value.tempReferences = []
                value.getDisplayValue({ stack: [], collectReferences: true })
                value.updateReferences()
            } catch (error) {
                console.warn(`could not rebuild references for valueId: ${value.valueId}`, error)
            }
        }
    }

    async importBranchAsChild() {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".branch,.char,.json,application/json,text/json"

        const selectedFile = await new Promise((resolve) => {
            input.addEventListener("change", () => {
                resolve(input.files?.[0] ?? null)
            }, { once: true })
            input.click()
        })

        if (!selectedFile) { return }

        try {
            const text = await selectedFile.text()
            const parsed = JSON.parse(text)

            const elementsData = parsed?.elements ?? {}
            const valuesData = parsed?.values ?? {}
            const elementIds = Object.keys(elementsData)
            if (elementIds.length === 0) {
                alert("No elements found in imported branch file")
                return
            }

            let sourceRootId = parsed?.rootElementId
            if (!sourceRootId || !elementsData[sourceRootId]) {
                sourceRootId = elementIds.find((id) => {
                    const parentId = elementsData[id]?.parent
                    return !parentId || !(parentId in elementsData)
                }) ?? elementIds[0]
            }

            const takenElementIds = new Set(Object.keys(this.master.elements ?? {}))
            const elementIdMap = {}
            for (const oldId of elementIds) {
                elementIdMap[oldId] = this._makeImportId(oldId, takenElementIds)
            }

            const takenValueIds = new Set(Object.keys(this.master.values ?? {}))
            const valueIdMap = {}
            for (const oldValueId of Object.keys(valuesData)) {
                valueIdMap[oldValueId] = this._makeImportId(oldValueId, takenValueIds)
            }

            const importedValues = {}
            for (const [oldValueId, valueData] of Object.entries(valuesData)) {
                const newValueId = valueIdMap[oldValueId]
                const mappedParents = (Array.isArray(valueData?.parentElements) ? valueData.parentElements : [])
                    .map((parentId) => elementIdMap[parentId])
                    .filter(Boolean)

                importedValues[newValueId] = new Value(
                    this.master,
                    newValueId,
                    valueData?.value ?? "",
                    mappedParents,
                    [],
                    [],
                )
            }

            const createdElements = {}
            for (const oldElementId of elementIds) {
                const elementData = elementsData[oldElementId]
                const ElementClass = await this._resolveElementClass(elementData?.type)

                const mappedElementId = elementIdMap[oldElementId]
                const mappedParent = oldElementId === sourceRootId
                    ? this.elementId
                    : (elementIdMap[elementData?.parent] ?? this.elementId)
                const mappedChildren = (Array.isArray(elementData?.children) ? elementData.children : [])
                    .map((childId) => elementIdMap[childId])
                    .filter(Boolean)
                const mappedValueId = elementData?.valueId
                    ? (valueIdMap[elementData.valueId] ?? elementData.valueId)
                    : null

                const cloneData = {
                    ...elementData,
                    elementId: mappedElementId,
                    parent: mappedParent,
                    children: mappedChildren,
                    valueId: mappedValueId,
                }

                const created = (typeof ElementClass.fromJSON === "function")
                    ? ElementClass.fromJSON(this.master, cloneData)
                    : Element.fromJSON(this.master, cloneData)

                createdElements[mappedElementId] = created
            }

            for (const [newValueId, value] of Object.entries(importedValues)) {
                this.master.values[newValueId] = value
            }

            for (const [newElementId, element] of Object.entries(createdElements)) {
                this.master.elements[newElementId] = element
            }

            const importedRootId = elementIdMap[sourceRootId]
            if (!Array.isArray(this.children)) {
                this.children = []
            }
            if (!this.children.includes(importedRootId)) {
                this.children.push(importedRootId)
            }

            for (const element of Object.values(createdElements)) {
                if (!element.valueId) { continue }
                const valueObj = this.master.getValueFromId(element.valueId)
                if (!valueObj) { continue }
                if (!Array.isArray(valueObj.parentElements)) {
                    valueObj.parentElements = []
                }
                if (!valueObj.parentElements.includes(element.elementId)) {
                    valueObj.parentElements.push(element.elementId)
                }
            }

            this._rebuildAllValueReferences()

            if (typeof this.master.drawElements === "function") {
                this.master.drawElements()
            }
            if (this.master.editor?.layoutTree && typeof this.master.editor.layoutTree.drawTree === "function") {
                this.master.editor.layoutTree.drawTree()
            }
            if (this.master.editor && typeof this.master.editor.selectElement === "function") {
                this.master.editor.selectElement(importedRootId)
            }
        } catch (error) {
            console.error("Could not import branch", error)
            alert("Could not import branch. Check console for details.")
        }
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
            {name: "Export Branch", type: "button", value: null, function: this.exportBranch.bind(this)},
            {name: "Import Branch as Child", type: "button", value: null, function: this.importBranchAsChild.bind(this)},
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
