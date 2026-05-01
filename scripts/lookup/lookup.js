export class Lookup {
    constructor(master){
        this.master = master
        this.lookups = {}
        this.ready = Promise.all([
            this.addObjectFromFile("../../V2/auxiliaryFiles/features5E.json", "features5e"),
            this.addObjectFromFile("../../V2/auxiliaryFiles/spells5E.json", "spells5e"),
        ])
    }

    toggleLookupManager() {
        const floatingWindow = this.master.floatingWindow.getFloatingWindow("lookupManager")

        if (!floatingWindow) {
            this.master.floatingWindow.createFloatingWindow(
                "lookupManager",
                "Lookup Manager",
                ({ content }) => this.populateManager(content)
            )
            this.master.floatingWindow.openFloatingWindow("lookupManager")
            return
        }

        this.master.floatingWindow.closeFloatingWindow("lookupManager")
    }

    populateManager(lookupDiv) {
        lookupDiv.innerHTML = ""

        const controls = document.createElement("div")
        controls.style.display = "flex"
        controls.style.gap = "8px"
        controls.style.marginBottom = "8px"

        const exportButton = document.createElement("button")
        exportButton.textContent = "Export"
        exportButton.addEventListener("click", () => {
            this.exportLookups([])
        })

        controls.appendChild(exportButton)
        lookupDiv.appendChild(controls)

        const treeContainer = document.createElement("div")
        treeContainer.style.fontFamily = "monospace"
        treeContainer.style.marginTop = "8px"
        lookupDiv.appendChild(treeContainer)

        treeContainer.appendChild(
            this.createLookupExplorerNode("Lookups", this.lookups, 0, [], lookupDiv, [])
        )
    }

    createLookupExplorerNode(key, value, depth = 0, parentKeyset = [], lookupDiv = null, explicitKeyset = null) {
        const node = document.createElement("div")
        const keyset = explicitKeyset ?? [...parentKeyset, key]

        const row = document.createElement("div")
        row.style.paddingLeft = `${depth * 16}px`
        row.style.whiteSpace = "pre-wrap"
        row.style.wordBreak = "break-word"
        row.style.cursor = "pointer"
        row.style.userSelect = "none"

        const isExpandable = value !== null && typeof value === "object"
        const isInitiallyOpen = isExpandable && keyset.length === 0
        const arrow = document.createElement("span")
        arrow.textContent = isExpandable ? (isInitiallyOpen ? "▼ " : "▶ ") : "• "
        row.appendChild(arrow)

        const keySpan = document.createElement("span")
        keySpan.style.fontWeight = "700"
        keySpan.textContent = `${String(key)}:`
        row.appendChild(keySpan)

        row.addEventListener("contextmenu", (event) => {
            event.preventDefault()
            this.openLookupContextMenu(event, keyset, lookupDiv)
        })

        if (!isExpandable) {
            row.appendChild(document.createTextNode(` ${String(value)}`))
            row.style.cursor = "default"
            node.appendChild(row)
            return node
        }

        const children = document.createElement("div")
        children.style.display = isInitiallyOpen ? "block" : "none"

        const entries = Array.isArray(value)
            ? value.map((item, index) => [index, item])
            : Object.entries(value)

        if (entries.length === 0) {
            const emptyLine = document.createElement("div")
            emptyLine.style.paddingLeft = `${(depth + 1) * 16}px`
            emptyLine.textContent = Array.isArray(value) ? "(empty array)" : "(empty object)"
            children.appendChild(emptyLine)
        } else {
            for (const [childKey, childValue] of entries) {
                children.appendChild(this.createLookupExplorerNode(childKey, childValue, depth + 1, keyset, lookupDiv))
            }
        }

        row.addEventListener("click", () => {
            const isOpen = children.style.display !== "none"
            children.style.display = isOpen ? "none" : "block"
            arrow.textContent = isOpen ? "▶ " : "▼ "
        })

        node.appendChild(row)
        node.appendChild(children)
        return node
    }

    openLookupContextMenu(event, keyset, lookupDiv) {
        const existing = document.getElementById("lookupContextMenu")
        if (existing) {
            existing.remove()
        }

        const menu = document.createElement("div")
        menu.id = "lookupContextMenu"
        menu.style.position = "fixed"
        menu.style.left = `${event.clientX}px`
        menu.style.top = `${event.clientY}px`
        menu.style.background = "#fff"
        menu.style.border = "1px solid #aaa"
        menu.style.boxShadow = "0 4px 12px rgba(0,0,0,0.18)"
        menu.style.zIndex = "20000"
        menu.style.padding = "4px"
        menu.style.minWidth = "180px"
        menu.style.display = "flex"
        menu.style.flexDirection = "column"

        const addItem = (label, onClick) => {
            const item = document.createElement("button")
            item.type = "button"
            item.textContent = label
            item.style.display = "block"
            item.style.width = "100%"
            item.style.textAlign = "left"
            item.style.margin = "0"
            item.style.padding = "6px 8px"
            item.style.border = "none"
            item.style.background = "transparent"
            item.style.cursor = "pointer"
            item.addEventListener("click", async () => {
                menu.remove()
                try {
                    await onClick()
                } catch (error) {
                    alert(error.message)
                }
            })
            menu.appendChild(item)
        }

        addItem("remove branch", async () => {
            const okay = confirm(`Are you sure you want to remove branch: ${JSON.stringify(keyset)} ?`)
            if (!okay) {
                return
            }
            this.removeBranch(keyset)
            if (lookupDiv) {
                this.populateManager(lookupDiv)
            }
        })

        addItem("export branch", async () => {
            this.exportLookups(keyset)
        })

        addItem("open window from here", async () => {
            this.openFloatingWindowFromKeyset(keyset)
        })

        addItem("import branch here", async () => {
            const file = await this.promptForLuFile()
            if (!file) {
                return
            }
            await this.importJson(file, keyset)
            if (lookupDiv) {
                this.populateManager(lookupDiv)
            }
        })

        addItem("create new branch", async () => {
            const name = prompt("Enter new branch key name:")
            if (name === null) {
                return
            }
            const keyName = name.trim()
            if (!keyName) {
                throw new Error("Branch name cannot be empty")
            }

            const contentInput = prompt("Enter content (leave empty for empty object):", "")
            if (contentInput === null) {
                return
            }

            const result = this.getLookupFromKeyset(keyset)
            if (!result.ok) {
                throw new Error(result.message)
            }
            if (result.value == null || typeof result.value !== "object") {
                throw new Error("Selected endpoint is not an object")
            }

            const isEmptyContent = contentInput.trim() === ""
            result.value[keyName] = isEmptyContent ? {} : contentInput

            if (lookupDiv) {
                this.populateManager(lookupDiv)
            }
        })

        document.body.appendChild(menu)

        const closeMenu = (closeEvent) => {
            if (!menu.contains(closeEvent.target)) {
                menu.remove()
                document.removeEventListener("pointerdown", closeMenu)
            }
        }
        setTimeout(() => document.addEventListener("pointerdown", closeMenu), 0)
    }

    promptForLuFile() {
        return new Promise((resolve) => {
            const fileInput = document.createElement("input")
            fileInput.type = "file"
            fileInput.accept = ".lu,.json,application/json,text/json"
            fileInput.addEventListener("change", () => {
                resolve(fileInput.files?.[0] ?? null)
            }, { once: true })
            fileInput.click()
        })
    }

    removeBranch(keyset) {
        if (!Array.isArray(keyset) || keyset.length === 0) {
            throw new Error("Cannot remove root lookup object")
        }

        const parentKeyset = keyset.slice(0, -1)
        const branchKey = keyset[keyset.length - 1]
        const parentResult = this.getLookupFromKeyset(parentKeyset)
        if (!parentResult.ok) {
            throw new Error(parentResult.message)
        }

        const parent = parentResult.value
        if (parent == null || typeof parent !== "object") {
            throw new Error("Parent branch is not an object")
        }

        if (Array.isArray(parent)) {
            const index = Number(branchKey)
            if (!Number.isInteger(index) || index < 0 || index >= parent.length) {
                throw new Error("Invalid array index")
            }
            parent.splice(index, 1)
            return
        }

        delete parent[branchKey]
    }


    importObjectToLookups(objectToImport, key, keyset = []) {
        if (objectToImport == null || typeof objectToImport !== "object") {
            throw new Error("objectToImport must be an object")
        }

        if (typeof key !== "string" || key.length === 0) {
            throw new Error("key must be a non-empty string")
        }

        if (!Array.isArray(keyset)) {
            throw new Error("keyset must be an array")
        }

        let current = this.lookups

        // Build/normalize the path described by keyset.
        for (const pathKey of keyset) {
            const next = current[pathKey]
            if (next == null || typeof next !== "object") {
                current[pathKey] = {}
            }
            current = current[pathKey]
        }

        // Insert at endpoint with provided key.
        current[key] = objectToImport
        return current[key]
    }

    
    getLookupFromKeyset(keyset, root = this.lookups) {
        if (!Array.isArray(keyset)) {
            throw new Error("keyset must be an array")
        }

        let current = root

        for (let i = 0; i < keyset.length; i++) {
            const key = keyset[i]
            if (current == null) {
                return {
                    ok: false,
                    value: undefined,
                    failedCheck: "current-nullish",
                    failedAtKey: key,
                    failedAtIndex: i,
                    message: `Path failed at index ${i} (key \"${String(key)}\"): current is null/undefined`,
                }
            }

            const isIndexable = typeof current === "object" || typeof current === "function"
            if (!isIndexable) {
                return {
                    ok: false,
                    value: undefined,
                    failedCheck: "current-not-indexable",
                    failedAtKey: key,
                    failedAtIndex: i,
                    message: `Path failed at index ${i} (key \"${String(key)}\"): current is not indexable`,
                }
            }

            if (!(key in current)) {
                const possibleKeys = Object.keys(current)
                const possibleKeysText = possibleKeys.length > 0
                    ? possibleKeys.join(", ")
                    : "(none)"

                return {
                    ok: false,
                    value: undefined,
                    failedCheck: "missing-key",
                    failedAtKey: key,
                    failedAtIndex: i,
                    message: `Path failed at index ${i}\nKey not found: "${String(key)}".\nPossible keys are: ${possibleKeysText}`,
                }
            }

            current = current[key]
        }

        // endpoint can be any type: object, array, string, number, boolean, etc.
        return {
            ok: true,
            value: current,
            failedCheck: null,
            failedAtKey: null,
            failedAtIndex: null,
            message: null,
        }
    }


    renderLookupTree(content, value, depth = 0, label = null) {
        const makeLine = (text, lineDepth) => {
            const line = document.createElement("div")
            line.textContent = text
            line.style.paddingLeft = `${lineDepth * 16}px`
            line.style.whiteSpace = "pre-wrap"
            line.style.wordBreak = "break-word"
            content.appendChild(line)
        }

        const makeKeyLine = (keyText, lineDepth, valueText = null) => {
            const line = document.createElement("div")
            line.style.paddingLeft = `${lineDepth * 16}px`
            line.style.whiteSpace = "pre-wrap"
            line.style.wordBreak = "break-word"

            const keySpan = document.createElement("span")
            keySpan.style.fontWeight = "700"
            keySpan.textContent = `${String(keyText)}:`
            line.appendChild(keySpan)

            if (valueText !== null) {
                line.appendChild(document.createTextNode(` ${String(valueText)}`))
            }

            content.appendChild(line)
        }

        if (value === null) {
            if (label !== null) {
                makeKeyLine(label, depth, "null")
            } else {
                makeLine("null", depth)
            }
            return
        }

        if (typeof value !== "object") {
            if (label !== null) {
                makeKeyLine(label, depth, String(value))
            } else {
                makeLine(String(value), depth)
            }
            return
        }

        if (label !== null) {
            makeKeyLine(label, depth)
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                makeLine("(empty array)", depth + 1)
                return
            }

            for (let i = 0; i < value.length; i++) {
                this.renderLookupTree(content, value[i], depth + 1, `[${i}]`)
            }
            return
        }

        const entries = Object.entries(value)
        if (entries.length === 0) {
            makeLine("(empty object)", depth + 1)
            return
        }

        for (const [key, child] of entries) {
            this.renderLookupTree(content, child, depth + 1, key)
        }
    }

    formatLookupFromKeyset(keyset) {
        const result = this.getLookupFromKeyset(keyset)
        if (!result.ok) {
            return result.message
        }

        if (this.isLookupValueVeryLarge(result.value)) {
            return this.formatDirectKeysOnly(result.value)
        }

        return this.formatLookupValueToString(result.value, 0, null).trimEnd()
    }

    isLookupValueVeryLarge(value, maxNodes = 100, maxDepth = 8) {
        if (value == null || typeof value !== "object") {
            return false
        }

        const stack = [{ node: value, depth: 0 }]
        let visitedNodes = 0

        while (stack.length > 0) {
            const { node, depth } = stack.pop()
            visitedNodes += 1

            if (visitedNodes > maxNodes) {
                return true
            }

            if (depth >= maxDepth) {
                continue
            }

            const children = Array.isArray(node) ? node : Object.values(node)
            for (const child of children) {
                if (child != null && typeof child === "object") {
                    stack.push({ node: child, depth: depth + 1 })
                }
            }
        }

        return false
    }

    formatDirectKeysOnly(value, maxKeysToShow = 200) {
        if (value === null) {
            return "null"
        }

        if (typeof value !== "object") {
            return String(value)
        }

        const allKeys = Array.isArray(value)
            ? value.map((_, index) => `[${index}]`)
            : Object.keys(value)

        if (allKeys.length === 0) {
            return Array.isArray(value) ? "(empty array)" : "(empty object)"
        }

        const shownKeys = allKeys.slice(0, maxKeysToShow)
        const remainingCount = allKeys.length - shownKeys.length

        let output = "Large lookup detected; showing direct keys only:\n"
        output += shownKeys.join("\n")
        if (remainingCount > 0) {
            output += `\n... and ${remainingCount} more keys`
        }

        return output
    }

    formatLookupValueToString(value, depth = 0, label = null) {
        const indent = " ".repeat(depth * 4)
        let output = ""
        const childDepth = label === null ? depth : depth + 1

        const appendLine = (text) => {
            output += `${indent}${text}\n`
        }

        if (value === null) {
            if (label !== null) {
                appendLine(`${String(label)}: null`)
            } else {
                appendLine("null")
            }
            return output
        }

        if (typeof value !== "object") {
            if (label !== null) {
                appendLine(`${String(label)}: ${String(value)}`)
            } else {
                appendLine(String(value))
            }
            return output
        }

        if (label !== null) {
            appendLine(`${String(label)}:`)
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                output += `${" ".repeat(childDepth * 4)}(empty array)\n`
                return output
            }

            for (let i = 0; i < value.length; i++) {
                output += this.formatLookupValueToString(value[i], childDepth, `[${i}]`)
            }
            return output
        }

        const entries = Object.entries(value)
        if (entries.length === 0) {
            output += `${" ".repeat(childDepth * 4)}(empty object)\n`
            return output
        }

        for (const [key, child] of entries) {
            output += this.formatLookupValueToString(child, childDepth, key)
        }

        return output
    }

    openFloatingWindowFromKeyset(keyset){
        const result = this.getLookupFromKeyset(keyset)
        const rootLabel = keyset.length > 0 ? String(keyset[keyset.length - 1]) : "result"
        const windowSuffix = keyset.length > 0 ? keyset.join("_") : "root"
        const windowKey = `lookup_${windowSuffix}`
        const windowTitle = keyset.length > 0
            ? `Lookup: ${keyset.join(" > ")}`
            : "Lookup: root"
        

        this.master.floatingWindow.createFloatingWindow(
                windowKey,
                windowTitle,
                ({ content }) => {
                    content.innerHTML = ""
                    content.style.fontFamily = "monospace"

                    const exportButton = document.createElement("button")
                    exportButton.textContent = "Export"
                    exportButton.style.marginBottom = "8px"
                    exportButton.addEventListener("click", () => {
                        this.exportLookups(keyset)
                    })
                    content.appendChild(exportButton)

                    const output = document.createElement("div")
                    content.appendChild(output)

                    if (!result.ok) {
                        output.style.whiteSpace = "pre-wrap"
                        output.textContent = `-error in keyset-\n${String(keyset)}\n${result.message}`
                        return
                    }

                    output.style.whiteSpace = "normal"
                    this.renderLookupTree(output, result.value, 0, rootLabel)
                }
            )
            this.master.floatingWindow.openFloatingWindow(windowKey)
    }

    getOrCreateLookupPath(keyset) {
        if (!Array.isArray(keyset)) {
            throw new Error("keyset must be an array")
        }

        let current = this.lookups

        for (const key of keyset) {
            const next = current[key]
            if (next == null || typeof next !== "object") {
                current[key] = {}
            }
            current = current[key]
        }

        return current
    }

    exportLookups(keyset = [], filename = null) {
        const result = this.getLookupFromKeyset(keyset)
        if (!result.ok) {
            throw new Error(result.message)
        }

        const baseName = filename
            ?? (keyset.length === 0
                ? "lookups-export"
                : `${keyset.join("_")}-export`)
        const exportName = baseName.endsWith(".lu") ? baseName : `${baseName}.lu`

        const payload = keyset.length === 0
            ? result.value
            : { [String(keyset[keyset.length - 1])]: result.value }

        const jsonString = JSON.stringify(payload, null, 2)
        const blob = new Blob([jsonString], { type: "text/plain" })
        const url = URL.createObjectURL(blob)

        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = exportName
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        URL.revokeObjectURL(url)
    }

    async importJson(jsonFile, keyset = []) {
        if (!jsonFile || typeof jsonFile.text !== "function") {
            throw new Error("jsonFile must be a File-like object")
        }

        const fileName = typeof jsonFile.name === "string" ? jsonFile.name.toLowerCase() : ""
        const isLu = fileName.endsWith(".lu")
        const isJson = fileName.endsWith(".json")
        if (!(isLu || isJson)) {
            throw new Error("Import file must use .lu or .json extension")
        }

        if (!Array.isArray(keyset)) {
            throw new Error("keyset must be an array")
        }

        let parsed
        try {
            const fileText = await jsonFile.text()
            parsed = JSON.parse(fileText)
        } catch (error) {
            throw new Error(`Invalid lookup file content: ${error.message}`)
        }

        if (parsed == null || typeof parsed !== "object") {
            throw new Error("Imported JSON root must be an object")
        }

        const result = this.getLookupFromKeyset(keyset)
        if (!result.ok) {
            throw new Error(result.message)
        }

        const target = result.value
        if (target == null || typeof target !== "object") {
            throw new Error("Import target endpoint must be an object")
        }

        Object.assign(target, parsed)
        return target
    }

    async addObjectFromFile(path, key) {
        if (typeof path !== "string" || path.length === 0) {
            throw new Error("path must be a non-empty string")
        }

        if (typeof key !== "string" || key.length === 0) {
            throw new Error("key must be a non-empty string")
        }

        let response
        try {
            response = await fetch(path)
        } catch (error) {
            throw new Error(`Failed to fetch JSON from ${path}: ${error.message}`)
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch JSON from ${path}: ${response.status} ${response.statusText}`)
        }

        let parsed
        try {
            parsed = await response.json()
        } catch (error) {
            throw new Error(`Invalid JSON in ${path}: ${error.message}`)
        }

        this.lookups[key] = parsed
        return this.lookups[key]
    }
}


