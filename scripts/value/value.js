export class Value {
    constructor(master, valueId, value, parentElements, referencedBy, references){
        this.master = master
        this.valueId = valueId // Must be unique
        this.value = value
        this.parentElements = parentElements
        this.referencedBy = referencedBy
        this.references = references
    }

    setValue(newValue) {
        this.value = newValue
        this.updateReferences()
        this.cascadeChange(true, this.valueId)
        this.master.editor.drawOptions()
    }

    getValue() {
        return this.value
    }

    getDisplayValue() { //TO BE IMPLEMENTED
        return this.value
        // calculate based on value
    }

    updateParentsDisplay() {
        // should only be called by cascadeChange()
        // parent.Elements.draw() // or some similar update
        for (const elementId of this.parentElements) {
            this.master.getElementFromId(elementId).draw()
        }
    }

    removeParent(elementId) {
        this.parentElements = this.parentElements.filter(id => id !== elementId)
        if (this.parentElements.length === 0) {
            for (const valueId of this.references) {
                this.master.getValueFromId(valueId).removeReferencedBy(this.valueId)
            }
            delete this.master.values[this.valueId]
        }
    }

    addParent(elementId) {
        this.parentElements.push(elementId)
    }

    save() {

    }

    cascadeChange(firstCall, whoChanged) {
        // WRONG NEEDS FIXING
        // THE CASCADE SHOULD NOT CHECK THIS, WHEN A VALUE IS SET LOOPS SHOULD BE CHECKED
        if (whoChanged === this.valueId && !firstCall) {
            throw new Error(`Circular reference detected involving value: ${this.valueId}`)
        }
        this.updateParentsDisplay()
        for (const valueId of this.referencedBy) {
            this.master.getValueFromId(valueId).cascadeChange(false, whoChanged)
        }
    }

    updateReferences() {
        // check who were the old references
        // check who are the new references and set this.references
        // those who are not a reference anymore: value.removeReferencedBy(this.valueId)
        // those who are new: value.addReferencedBy(this.valueId)
    }

    addReferencedBy (valueId) {
        this.referencedBy.push(valueId)
    }

    removeReferencedBy(valueId) {
        this.referencedBy = this.referencedBy.filter(id => id !== valueId)
    }

    toJSON() {
        return {
            valueId: this.valueId,
            value: this.value,
            parentElements: Array.isArray(this.parentElements) ? [...this.parentElements] : [],
            referencedBy: Array.isArray(this.referencedBy) ? [...this.referencedBy] : [],
            references: Array.isArray(this.references) ? [...this.references] : [],
        }
    }

    static fromJSON(master, data) {
        return new Value(
            master,
            data.valueId,
            data.value,
            Array.isArray(data.parentElements) ? data.parentElements : [],
            Array.isArray(data.referencedBy) ? data.referencedBy : [],
            Array.isArray(data.references) ? data.references : [],
        )
    }


}
