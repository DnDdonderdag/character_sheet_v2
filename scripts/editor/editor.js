import { LayoutTree } from "./layoutTree/layoutTree.js"

export class Editor {
    constructor(master, html){
        this.master = master
        this.html = html
        this.selectedElement = "characterSheet"
        this.layoutTree = new LayoutTree(this, document.getElementById("layoutTree"))
        this.populateBase()
        this.drawOptions()

    }

    populateBase() {
        this.html.style.display = "flex"
        this.html.style.flexDirection = "column"
        this.html.style.height = "100%"

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
        let options = this.master.getElementFromId(this.selectedElement).getEditingOptions()

        const selectedHeader = document.createElement("h3")
        selectedHeader.textContent = `Selected Element: ${this.selectedElement}`
        selectedHeader.style.margin = "12px"
        this.html.appendChild(selectedHeader)

        const optionsContainer = document.createElement("div")
        optionsContainer.style.display = "flex"
        optionsContainer.style.flexDirection = "column"
        optionsContainer.style.gap = "10px"
        optionsContainer.style.padding = "0 12px 12px 12px"
        if (!options) {return}
        for (const option of options) {
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

            field.addEventListener("blur", () => {
                let newValue = field.value
                if (option.type === "Int") {
                    const parsed = parseInt(newValue, 10)
                    newValue = Number.isNaN(parsed) ? 0 : parsed
                }
                option.function(newValue)
                this.drawOptions()
                this.layoutTree.drawTree()
            })

            row.appendChild(label)
            row.appendChild(field)
            optionsContainer.appendChild(row)
        }

        this.html.appendChild(optionsContainer)
        
    }

}
