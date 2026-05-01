import { LayoutTree } from "./layoutTree/layoutTree.js"

export class Editor {
    constructor(master, html){
        this.master = master
        this.html = html
        this.selectedElement = "characterSheet"
        this.layoutTree = new LayoutTree(this, document.getElementById("layoutTree"))
        this.enabled = false
        this.populateBase()
        this.drawOptions()
        this.initializeClickDetection()

    }

    populateBase() {
        this.html.style.display = "flex"
        this.html.style.flexDirection = "column"
        this.html.style.height = "100%"
        this.html.style.userSelect = "none"
        this.html.style.webkitUserSelect = "none"

        const headerContainer = document.createElement("div")
        headerContainer.style.width = "100%"
        headerContainer.style.height = "48px"
        headerContainer.style.display = "flex"
        headerContainer.style.alignItems = "center"
        headerContainer.style.justifyContent = "flex-start"
        headerContainer.style.boxSizing = "border-box"
        headerContainer.style.padding = "0 12px"

        const header = document.createElement("h2")
        header.textContent = "Editor"
        header.style.margin = "0"

        headerContainer.appendChild(header)

        const contentContainer = document.createElement("div")
        contentContainer.style.width = "100%"
        contentContainer.style.flex = "1"
        contentContainer.style.minHeight = "0"
        contentContainer.style.overflow = "auto"

        this.html.appendChild(headerContainer)
        this.html.appendChild(contentContainer)

        this.contentContainer = contentContainer
        this.html = contentContainer

    }

    selectElement(elementId) {
        this.selectedElement = elementId
        this.drawOptions()
    }

    drawOptions() {
        this.html.textContent = ""
        const selectedElementObj = this.master.getElementFromId(this.selectedElement)
        let options = selectedElementObj.getEditingOptions()

        const selectedHeader = document.createElement("h3")
        selectedHeader.textContent = `Selected Element: ${this.selectedElement}`
        selectedHeader.style.margin = "12px"
        this.html.appendChild(selectedHeader)

        if (this.selectedElement !== "characterSheet") {
            const typeLine = document.createElement("div")
            typeLine.textContent = `Type: ${selectedElementObj?.constructor?.name ?? "Unknown"}`
            typeLine.style.margin = "-6px 12px 10px 12px"
            typeLine.style.fontSize = "12px"
            typeLine.style.opacity = "0.85"
            this.html.appendChild(typeLine)
        }

        const optionsContainer = document.createElement("div")
        optionsContainer.style.display = "flex"
        optionsContainer.style.flexDirection = "column"
        optionsContainer.style.gap = "10px"
        optionsContainer.style.padding = "0 12px 12px 12px"
        if (!options) {return}
        let optionIndex = 0
        for (const option of options) {
            const currentOptionIndex = optionIndex
            optionIndex += 1
            const row = document.createElement("div")
            row.style.display = "flex"
            row.style.flexDirection = "column"
            row.style.gap = "4px"


            const label = document.createElement("label")
            label.textContent = option.name
            label.style.fontSize = "12px"

            let field

            if (option.type === "button" || option.type === "Button") {
                const buttonField = document.createElement("button")
                buttonField.type = "button"
                buttonField.textContent = option.name
                buttonField.addEventListener("click", () => {
                    const action = option.funciton || option.function
                    if (typeof action === "function") {
                        action()
                    }
                    this.drawOptions()
                    this.layoutTree.drawTree()
                })

                row.appendChild(buttonField)
                optionsContainer.appendChild(row)
                continue
            }
            if (option.type === "Multiline") {
                field = document.createElement("textarea")
                field.rows = 4
                field.style.resize = "vertical"
            } else {
                field = document.createElement("input")
                if (option.type === "Int") {
                    field.type = "text"
                    field.inputMode = "numeric"
                } else {
                    field.type = "text"
                }
            }

            field.value = option.value == null ? "" : String(option.value)
            field.dataset.editorOptionIndex = String(currentOptionIndex)

            if (field.tagName === "INPUT") {
                field.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        event.preventDefault()
                        field.blur()
                    }
                })
            }

            field.addEventListener("blur", (event) => {
                const nextOptionIndex = event.relatedTarget?.dataset?.editorOptionIndex ?? null

                let newValue = field.value
                if (option.type === "Int") {
                    const parsed = parseInt(newValue, 10)
                    newValue = Number.isNaN(parsed) ? 0 : parsed
                }
                option.function(newValue)
                this.drawOptions()
                this.layoutTree.drawTree()

                if (nextOptionIndex !== null) {
                    requestAnimationFrame(() => {
                        const fields = this.html.querySelectorAll("input[data-editor-option-index], textarea[data-editor-option-index]")
                        const nextField = Array.from(fields).find((item) => item.dataset.editorOptionIndex === nextOptionIndex)
                        if (nextField) {
                            nextField.focus()
                        }
                    })
                }
            })

            row.appendChild(label)
            row.appendChild(field)
            optionsContainer.appendChild(row)
        }

        this.html.appendChild(optionsContainer)
        
    }

    initializeClickDetection() {
        const handleSelectionEvent = (event) => {
            if (!this.enabled) {
                return
            }

            const characterSheetDiv = document.getElementById("characterSheet")
            if (!characterSheetDiv || !characterSheetDiv.contains(event.target)) {
                return
            }

            const clickedDiv = event.target?.closest?.("div")
            const clickedId = clickedDiv?.id

            if (clickedId && this.master.elements && clickedId in this.master.elements && clickedId != "characterSheet") {
                this.layoutTree.selectElement(clickedId)
                requestAnimationFrame(() => {
                    this.layoutTree.highlightElement(clickedId)
                })
            }

        }

        document.addEventListener("contextmenu", (event) => {
            if (!this.enabled) {
                return
            }

            const characterSheetDiv = document.getElementById("characterSheet")
            if (!characterSheetDiv || !characterSheetDiv.contains(event.target)) {
                return
            }

            event.preventDefault()
            handleSelectionEvent(event)
        }, true)
    }

}
