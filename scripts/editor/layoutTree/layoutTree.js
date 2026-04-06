export class LayoutTree {
    constructor(editor, html){
        this.editor = editor
        this.html = html
        this.populateBase()
        this.drawTree()
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
        headerContainer.style.justifyContent = "flex-end"
        headerContainer.style.boxSizing = "border-box"
        headerContainer.style.padding = "0 12px"

        const header = document.createElement("h2")
        header.textContent = "Layout"
        header.style.margin = "0"

        headerContainer.appendChild(header)

        const contentContainer = document.createElement("div")
        contentContainer.style.width = "100%"
        contentContainer.style.flex = "1"
        contentContainer.style.minHeight = "0"
        contentContainer.style.overflowY = "auto"
        contentContainer.style.overflowX = "auto"
        contentContainer.style.whiteSpace = "nowrap"
        
        this.html.appendChild(headerContainer)
        this.html.appendChild(contentContainer)

        this.contentContainer = contentContainer
        this.html = contentContainer
    }

    drawTree() {
        const gatherTree = (elementId) => {
            const element = this.editor.master.getElementFromId(elementId)
            const childTree = element.children.reduce((acc, childId) => {
                return { ...acc, ...gatherTree(childId) }
            }, {})

            return { [elementId]: childTree }
        }

        let tree = gatherTree("characterSheet")

        this.html.textContent = ""
        const fragment = document.createDocumentFragment()

        const drawBranch = (branch, depth) => {
            if (!branch || Object.keys(branch).length === 0) return

            for (const key of Object.keys(branch)) {
                const row = document.createElement("div")
                row.textContent = " • ".repeat(depth) + key
                row.style.paddingLeft = `10px`
                row.style.lineHeight = "24px"
                row.style.whiteSpace = "nowrap"
                row.style.cursor = "pointer"
                if (key == this.editor.selectedElement) {row.style.color = "blue"}
                row.addEventListener("click", () => this.selectElement(key))
                fragment.appendChild(row)

                drawBranch(branch[key], depth + 1)
            }
        }

        drawBranch(tree, 0)
        this.html.appendChild(fragment)
    }

    highlightElement(elementId) {
        let overlay = document.getElementById("selectionOverlay")
        if (!overlay) {
            overlay = document.createElement("div")
            overlay.id = "selectionOverlay"
            overlay.style.position = "absolute"
            overlay.style.inset = "0"
            document.body.appendChild(overlay)
        }

        const target = this.editor.master.getElementFromId(elementId)
        if (!target || !target.html || elementId === "characterSheet") {
            overlay.classList.remove("active")
            return
        }

        target.html.appendChild(overlay)
        overlay.classList.add("active")
    }

    selectElement(elementId) {
        this.editor.selectElement(elementId)
        this.highlightElement(elementId)
        this.drawTree()
    }
}
