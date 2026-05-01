export class Value {
    constructor(master, valueId, value, parentElements, referencedBy, references){
        this.master = master
        this.valueId = valueId // Must be unique
        this.value = value
        this.parentElements = [...new Set(Array.isArray(parentElements) ? parentElements : [])]
        this.referencedBy = [...new Set(Array.isArray(referencedBy) ? referencedBy : [])]
        this.references = [...new Set(Array.isArray(references) ? references : [])]
        this.tempReferences = []
    }

    setValue(newValue) {
        this.value = newValue
        this.tempReferences = []
        this.getDisplayValue({ stack: [], collectReferences: true })
        this.updateReferences()
        this.cascadeChange(true, this.valueId)
        this.master.editor.drawOptions()
    }

    getValue() {
        return this.value
    }

    getDisplayValue(evalContext = null) {
        if (!evalContext) {
            evalContext = { stack: [], collectReferences: false }
        }
        if (!Array.isArray(evalContext.stack)) {
            evalContext.stack = []
        }
        if (typeof evalContext.collectReferences !== "boolean") {
            evalContext.collectReferences = false
        }

        evalContext.stack.push(this.valueId)

        try {
        let trueVal = this.getValue()


        let keywords = {
            "@js" : jsFunc,
            "@lu" : luFunc,
            "@sr" : srFunc,
        }


        function isCommandStart(displayVal, i) {
            const checks = [
                // must be @
                (text, index) => text[index] === "@",
                // must not be escaped (\\@)
                (text, index) => index === 0 || text[index - 1] !== "\\",
                // must have two command letters after @
                (text, index) => index + 2 < text.length,
                // must be followed by opening parenthesis
                (text, index) => text[index + 3] === "(",
                // must be closed later with )xx
                (text, index) => {
                    const cmd = text.slice(index + 1, index + 3)
                    const closingToken = `)${cmd}`
                    return text.indexOf(closingToken, index + 4) !== -1
                },
            ]

            return checks.every((check) => check(displayVal, i))
        }

        let displayVal = trueVal
        let done = false;
        while (!done) {

            //get the index of the last @

            let lastAtIndex = -1
            for (let i = displayVal.length - 1; i >= 0; i--) {
                if (isCommandStart(displayVal, i)) {
                    lastAtIndex = i
                    break
                }
            }
            if (lastAtIndex == -1) {
                done = true
                break
            }

            let command = displayVal.slice(lastAtIndex,lastAtIndex+3)
            let closingToken = `)${command.slice(1)}`
            let argStartIndex = lastAtIndex + 4
            let argEndIndex = displayVal.indexOf(closingToken, argStartIndex)
            let arg = displayVal.slice(argStartIndex,argEndIndex)
            let result
            if (command in keywords) {
                result = keywords[command](arg, this, evalContext)
            } else {
                result = "-unknown function \\" + command + "-"
            }

            displayVal = displayVal.slice(0, lastAtIndex) + result + displayVal.slice(argEndIndex + closingToken.length)
        }

        // Replace all escaped @ markers (\@) with literal @
        displayVal = displayVal.replace(/\\@/g, "@")


        return displayVal
        } finally {
            evalContext.stack.pop()
        }
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
        if (!this.parentElements.includes(elementId)) {
            this.parentElements.push(elementId)
        }
    }

    save() {

    }

    cascadeChange(firstCall, whoChanged) {
        if (whoChanged === this.valueId && !firstCall) {
            throw new Error(`Circular reference detected involving value: ${this.valueId}`)
        }
        this.updateParentsDisplay()
        for (const valueId of this.referencedBy) {
            this.master.getValueFromId(valueId).cascadeChange(false, whoChanged)
        }
    }

    updateReferences() {
        let oldReferences = Array.isArray(this.references) ? this.references : []
        let newReferences = [...new Set(Array.isArray(this.tempReferences) ? this.tempReferences : [])]

        const newSet = new Set(newReferences)
        const oldSet = new Set(oldReferences)

        const removed = oldReferences.filter(id => !newSet.has(id))
        const added = newReferences.filter(id => !oldSet.has(id))

        for (const valueId of removed) {
            const value = this.master.getValueFromId(valueId)
            if (value) {
                value.removeReferencedBy(this.valueId)
            }
        }

        for (const valueId of added) {
            const value = this.master.getValueFromId(valueId)
            if (value) {
                value.addReferencedBy(this.valueId)
            }
        }

        this.references = newReferences
        this.tempReferences = []
    }

    addReferencedBy (valueId) {
        if (!this.referencedBy.includes(valueId)) {
            this.referencedBy.push(valueId)
        }
    }

    removeReferencedBy(valueId) {
        this.referencedBy = this.referencedBy.filter(id => id !== valueId)
    }

    toJSON() {
        return {
            valueId: this.valueId,
            value: this.value,
            parentElements: [...new Set(Array.isArray(this.parentElements) ? this.parentElements : [])],
            referencedBy: [...new Set(Array.isArray(this.referencedBy) ? this.referencedBy : [])],
            references: [...new Set(Array.isArray(this.references) ? this.references : [])],
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


function jsFunc(arg, valueElement) {
    try {
        const result = eval(arg)
        return result
    } catch (error) {
        return `-js error: ${error.message}-`
    }
}

function luFunc(arg, valueElement){
    let keyset = arg.split(",")
    return valueElement.master.lookup.formatLookupFromKeyset(keyset)
}

function srFunc(arg, valueElement, evalContext){
    let result
    if (evalContext?.stack?.includes(arg)) {
        result = "-loopDetected-"
    } else if (valueElement.master.getValueFromId(arg) && arg!=valueElement.valueId){
        if (evalContext?.collectReferences) {
            valueElement.tempReferences.push(arg)
        }
        result =  valueElement.master.getValueFromId(arg).getDisplayValue(evalContext)
    } else {
        result = "-could not find " + arg + "-"
    }

    return result
}