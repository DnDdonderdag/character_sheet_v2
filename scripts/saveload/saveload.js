import { Element } from "../element/element.js"
import { Root } from "../element/subclasses/root.js"
import { TextArea } from "../element/subclasses/textArea.js"
import { Checkmark } from "../element/subclasses/checkmark.js"
import { Value } from "../value/value.js"
import { SingleLine } from "../element/subclasses/singleLine.js"

export class Saveload {
    constructor(master){
        this.master = master
        this.lastServerFilename = null
    }

    // Prompt user for username/password
    _promptCredentials(title = "Authentication") {
        const username = prompt(`${title}\n\nUsername:`);
        if (username === null) return null; // User cancelled
        
        const password = prompt(`${title}\n\nPassword:`);
        if (password === null) return null; // User cancelled
        
        return { username, password };
    }

    async _promptAdminTargetCredentials(adminCredentials) {
        try {
            const response = await fetch(
                `/api/admin/users?username=${encodeURIComponent(adminCredentials.username)}&password=${encodeURIComponent(adminCredentials.password)}`
            )

            if (!response.ok) {
                const err = await response.json().catch(() => ({}))
                throw new Error(err.error || "Admin verification failed")
            }

            const result = await response.json()
            const users = result.users ?? []

            if (users.length === 0) {
                alert("No users available")
                return null
            }

            const displayList = users.map(user => `${user.username} : ${user.password}`).join("\n")
            const selectedUsername = prompt(
                `Pick a user by username:\n\n${displayList}`,
                users[0].username
            )

            if (!selectedUsername) { return null }

            const selectedUser = users.find(user => user.username === selectedUsername)
            if (!selectedUser) {
                alert("Selected username not found")
                return null
            }

            return {
                username: selectedUser.username,
                password: selectedUser.password,
            }
        } catch (error) {
            console.error("Admin user list error:", error)
            alert(`✗ Failed to retrieve users:\n${error.message}`)
            return null
        }
    }

    async _resolveServerCredentials(baseCredentials) {
        if (baseCredentials.username !== "admin") {
            return baseCredentials
        }

        const selectedCredentials = await this._promptAdminTargetCredentials(baseCredentials)
        if (!selectedCredentials) {
            return null
        }

        return selectedCredentials
    }

    exportCurrentFile() {
        const elements = this.master.elements
        const values = this.master.values
        const lookups = this.master.lookups

        const exportFile = {
            "elements" : {

            },
            "values" : {

            },
            "lookups" : {

            }
        }

        for (const elementId of Object.keys(elements)) {
            const element = elements[elementId]
            if (element && typeof element.toJSON === "function") {
                exportFile.elements[elementId] = element.toJSON()
            }
        }

        for (const valueId of Object.keys(values)) {
            const value = values[valueId]
            if (value && typeof value.toJSON === "function") {
                exportFile.values[valueId] = value.toJSON()
            }
        }

        exportFile.lookups = JSON.parse(JSON.stringify(lookups ?? {}))

        return JSON.stringify(exportFile, null, 2)
    }

    saveCurrentFileLocal() {
        const file = this.exportCurrentFile()
        const blob = new Blob([file], { type: "application/octet-stream" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = `character-sheet-${new Date().toISOString().replace(/[:.]/g, "-")}.char`
        document.body.appendChild(a)
        a.click()
        a.remove()

        URL.revokeObjectURL(url)
    }

    async saveCurrentFileServer() {
        const baseCredentials = this._promptCredentials("Save to Server");
        if (!baseCredentials) return; // User cancelled

        const credentials = await this._resolveServerCredentials(baseCredentials)
        if (!credentials) return

        try {
            const listResponse = await fetch(
                `/api/character/list?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`
            )

            if (!listResponse.ok) {
                const err = await listResponse.json().catch(() => ({}))
                throw new Error(err.error || "Could not retrieve saved files")
            }

            const listResult = await listResponse.json()
            const existingFiles = listResult.files ?? []
            const existingFilesText = existingFiles.length > 0
                ? existingFiles.join("\n")
                : "No existing files"

            const filename = prompt(
                `Enter filename to save as.\n\nExisting files for ${credentials.username}:\n${existingFilesText}`,
                this.lastServerFilename || existingFiles[0] || "character-sheet"
            )
            if (!filename) return; // User cancelled

            const fileData = JSON.parse(this.exportCurrentFile());

            fetch('/api/character/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                    filename: filename,
                    data: fileData
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || "Server error");
                    });
                }
                return response.json();
            })
            .then(result => {
                this.lastServerFilename = result.filename;
                alert(`✓ Character saved to server as "${result.filename}"`);
            })
            .catch(error => {
                console.error("Server save error:", error);
                alert(`✗ Failed to save to server:\n${error.message}`);
            });
        } catch (error) {
            console.error("Export error:", error);
            alert("Failed to prepare file for saving");
        }
    }

    loadFile(file) {
        const parsed = typeof file === "string" ? JSON.parse(file) : file
        if (!parsed || typeof parsed !== "object") {
            throw new Error("Could not load file: invalid JSON data")
        }

        const elementTypeMap = {
            Element,
            Root,
            TextArea,
            Checkmark,
            SingleLine,
        }

        const loadedValues = {}
        const loadedElements = {}

        const valuesData = parsed.values ?? {}
        for (const valueId of Object.keys(valuesData)) {
            loadedValues[valueId] = Value.fromJSON(this.master, valuesData[valueId])
        }

        const elementsData = parsed.elements ?? {}
        for (const elementId of Object.keys(elementsData)) {
            const elementData = elementsData[elementId]
            const ElementClass = elementTypeMap[elementData?.type] ?? Element

            if (typeof ElementClass.fromJSON === "function") {
                loadedElements[elementId] = ElementClass.fromJSON(this.master, elementData)
            } else {
                loadedElements[elementId] = Element.fromJSON(this.master, elementData)
            }
        }

        this.master.values = loadedValues
        this.master.elements = loadedElements
        this.master.lookups = parsed.lookups ?? {}

        if (typeof this.master.drawElements === "function") {
            this.master.drawElements()
        }
        if (this.master.editor && typeof this.master.editor.selectElement === "function") {
            this.master.editor.selectElement("characterSheet")
            if (this.master.editor.layoutTree && typeof this.master.editor.layoutTree.drawTree === "function") {
                this.master.editor.layoutTree.drawTree()
            }
        }

    }

    loadLocalFile() {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".char"

        input.addEventListener("change", async () => {
            const selectedFile = input.files && input.files[0]
            if (!selectedFile) { return }

            try {
                const content = await selectedFile.text()
                this.loadFile(content)
            } catch (error) {
                console.error("Could not load local file", error)
                alert("Could not load file. Please select a valid .char file.")
            }
        })

        input.click()
    }

    async loadServerFile() {
        const baseCredentials = this._promptCredentials("Load from Server");
        if (!baseCredentials) return; // User cancelled

        const credentials = await this._resolveServerCredentials(baseCredentials)
        if (!credentials) return

        // First, fetch list of available files
        fetch(`/api/character/list?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || "Server error");
                    });
                }
                return response.json();
            })
            .then(result => {
                if (!result.files || result.files.length === 0) {
                    alert("No saved characters found on server");
                    return;
                }

                // Present file list to user
                const fileList = result.files.join("\n");
                const selectedFile = prompt(
                    `Select a character to load:\n\n${fileList}`,
                    result.files[0]
                );

                if (!selectedFile) return; // User cancelled

                // Load the selected file
                fetch(
                    `/api/character/load?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}&filename=${encodeURIComponent(selectedFile)}`
                )
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.error || "Server error");
                        });
                    }
                    return response.json();
                })
                .then(fileData => {
                    this.loadFile(fileData);
                    this.lastServerFilename = selectedFile;
                    this.latestLoadedFile = JSON.stringify(fileData, null, 2);
                    alert(`✓ Character "${selectedFile}" loaded from server`);
                })
                .catch(error => {
                    console.error("Load error:", error);
                    alert(`✗ Failed to load character:\n${error.message}`);
                });
            })
            .catch(error => {
                console.error("List error:", error);
                alert(`✗ Failed to retrieve file list:\n${error.message}`);
            });
    }

    loadTemplateFile() {
        // First, fetch list of available templates
        fetch('/api/templates/list')
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || "Server error");
                    });
                }
                return response.json();
            })
            .then(result => {
                if (!result.files || result.files.length === 0) {
                    alert("No templates available");
                    return;
                }

                // Present template list to user
                const fileList = result.files.join("\n");
                const selectedTemplate = prompt(
                    `Select a template to load:\n\n${fileList}`,
                    result.files[0]
                );

                if (!selectedTemplate) return; // User cancelled

                // Load the selected template
                fetch(`/api/templates/load?filename=${encodeURIComponent(selectedTemplate)}`)
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => {
                                throw new Error(err.error || "Server error");
                            });
                        }
                        return response.json();
                    })
                    .then(templateData => {
                        this.loadFile(templateData);
                        this.latestLoadedFile = JSON.stringify(templateData, null, 2);
                        alert(`✓ Template "${selectedTemplate}" loaded`);
                    })
                    .catch(error => {
                        console.error("Template load error:", error);
                        alert(`✗ Failed to load template:\n${error.message}`);
                    });
            })
            .catch(error => {
                console.error("Template list error:", error);
                alert(`✗ Failed to retrieve template list:\n${error.message}`);
            });
    }




}
