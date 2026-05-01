export class LayoutTree {
    constructor(editor, html){
        this.editor = editor
        this.html = html
        this.expandedNodeIds = new Set(["characterSheet"])
        this.populateBase()
        this.drawTree()
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
        this.html.textContent = ""
        const rootId = "characterSheet"
        const rootElement = this.editor.master.getElementFromId(rootId)
        if (!rootElement) {
            return
        }

        const treeContainer = document.createElement("div")
        treeContainer.style.fontFamily = "monospace"
        treeContainer.style.padding = "5px"
        this.html.appendChild(treeContainer)

        const createNode = (elementId, depth = 0) => {
            const element = this.editor.master.getElementFromId(elementId)
            if (!element) {
                return document.createElement("div")
            }

            const node = document.createElement("div")
            const row = document.createElement("div")
            row.style.paddingLeft = `${depth * 16}px`
            row.style.whiteSpace = "pre-wrap"
            row.style.wordBreak = "break-word"
            row.style.cursor = "pointer"
            row.style.userSelect = "none"
            row.style.lineHeight = "22px"

            const childIds = Array.isArray(element.children) ? element.children : []
            const isExpandable = childIds.length > 0
            const isOpen = this.expandedNodeIds.has(elementId)

            const arrow = document.createElement("span")
            arrow.textContent = isExpandable ? (isOpen ? "▼ " : "▶ ") : "• "
            arrow.style.cursor = isExpandable ? "pointer" : "default"
            row.appendChild(arrow)

            const label = document.createElement("span")
            label.textContent = elementId
            label.style.cursor = "pointer"
            if (elementId === this.editor.selectedElement) {
                label.style.color = "blue"
                label.style.fontWeight = "700"
            }
            row.appendChild(label)

            const childrenContainer = document.createElement("div")
            childrenContainer.style.display = isExpandable && isOpen ? "block" : "none"

            for (const childId of childIds) {
                childrenContainer.appendChild(createNode(childId, depth + 1))
            }

            arrow.addEventListener("click", (event) => {
                event.stopPropagation()
                if (isExpandable) {
                    if (this.expandedNodeIds.has(elementId)) {
                        this.expandedNodeIds.delete(elementId)
                    } else {
                        this.expandedNodeIds.add(elementId)
                    }
                }
                this.drawTree()
            })

            label.addEventListener("click", (event) => {
                event.stopPropagation()
                this.selectElement(elementId)
            })

            node.appendChild(row)
            node.appendChild(childrenContainer)
            return node
        }

        treeContainer.appendChild(createNode(rootId, 0))
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

    expandPathToElement(elementId) {
        let currentId = elementId
        while (currentId) {
            this.expandedNodeIds.add(currentId)
            const currentElement = this.editor.master.getElementFromId(currentId)
            currentId = currentElement?.parent ?? null
        }
        this.expandedNodeIds.add("characterSheet")
    }

    selectElement(elementId) {
        this.editor.selectElement(elementId)
        this.expandPathToElement(elementId)
        this.highlightElement(elementId)
        this.drawTree()
    }
}
