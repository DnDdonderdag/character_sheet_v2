import { Editor } from "./editor/editor.js"
import { Lookup } from "./lookup/lookup.js"
import { Root } from "./element/subclasses/root.js"
import { Saveload } from "./saveload/saveload.js"

export class Master {
    constructor(){
        this.saveFile = null
        this.elements = {"characterSheet": new Root(this, "characterSheet", null, null, [], 0, 0, 0, 0)}
        this.values = {}
        this.lookups = {}
        this.editor = null
        this.lookup = null
        this.editorActive = false
        this.lookupActive = false
        this.populateStartup()
        this.editor = new Editor(this, document.getElementById("editor"))
        this.lookup = new Lookup(this, document.getElementById("lookup"))
        this.saveload = new Saveload(this)
        this.drawElements()
    }

    populateStartup() {
        // toolbar
        // =====================================
        const toolbar = document.createElement("div");
        toolbar.className = "toolbar"
        document.body.appendChild(toolbar);

        // Save button
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Download";
        saveBtn.onclick = () => this.saveToFile();
        toolbar.appendChild(saveBtn);

        // Load button
        const loadBtn = document.createElement("button");
        loadBtn.textContent = "Upload";
        loadBtn.onclick = () => this.loadFromFile();
        toolbar.appendChild(loadBtn);

        // Save to Server button
        const saveServerBtn = document.createElement("button");
        saveServerBtn.textContent = "Save to Server";
        saveServerBtn.onclick = () => this.saveToServer();
        toolbar.appendChild(saveServerBtn);

        // Load from Server button
        const loadServerBtn = document.createElement("button");
        loadServerBtn.textContent = "Load from Server";
        loadServerBtn.onclick = () => this.loadFromServer();
        toolbar.appendChild(loadServerBtn);

        // Load from template button
        const loadTemplateBtn = document.createElement("button");
        loadTemplateBtn.textContent = "Load Template";
        loadTemplateBtn.onclick = () => this.loadFromTemplate();
        toolbar.appendChild(loadTemplateBtn);

        // Enable Editor toggle button
        const editorBtn = document.createElement("button");
        editorBtn.textContent = "Enable Editor";
        editorBtn.onclick = () => {
            this.editorActive = !this.editorActive;
            editorBtn.textContent = this.editorActive ? "Disable Editor" : "Enable Editor";
            this.toggleEditor(this.editorActive);
        };
        toolbar.appendChild(editorBtn);

        // Enable Lookup button
        const lookupBtn = document.createElement("button");
        lookupBtn.textContent = "Lookup";
        lookupBtn.onclick = () => {
            this.lookupActive = !this.lookupActive;
            this.toggleLookup(this.lookupActive);
        };
        toolbar.appendChild(lookupBtn);
        // =====================================

        // Container wrapper for the three sections (editor, charSheet, tree)
        // =====================================
        const containerWrapper = document.createElement("div");
        containerWrapper.className = "containerWrapper";
        document.body.appendChild(containerWrapper);
        // =====================================

        // characterSheet
        // =====================================
        const characterSheet = document.createElement("div");
        characterSheet.id = "characterSheet";
        characterSheet.className = "container";
        containerWrapper.appendChild(characterSheet);
        // =====================================

        // editor
        // =====================================
        const editor = document.createElement("div");
        editor.id = "editor";
        editor.className = "container";
        containerWrapper.appendChild(editor);
        // =====================================

        // layoutTree
        // =====================================
        const layoutTree = document.createElement("div");
        layoutTree.id = "layoutTree";
        layoutTree.className = "container";
        containerWrapper.appendChild(layoutTree);
        // =====================================

        // lookup
        // =====================================
        const lookup = document.createElement("div");
        lookup.id = "lookup";
        lookup.className = "floatingContainer";

        const lookupDragHandle = document.createElement("div");
        lookupDragHandle.className = "dragHandle";

        const lookupTitle = document.createElement("span");
        lookupTitle.textContent = "Lookup";
        lookupDragHandle.appendChild(lookupTitle);

        const lookupCloseBtn = document.createElement("button");
        lookupCloseBtn.type = "button";
        lookupCloseBtn.textContent = "×";
        lookupCloseBtn.style.marginLeft = "auto";
        lookupCloseBtn.style.cursor = "pointer";
        lookupCloseBtn.addEventListener("pointerdown", (event) => {
            event.stopPropagation();
        });
        lookupCloseBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            this.lookupActive = false;
            lookup.classList.remove("active");
        });
        lookupDragHandle.appendChild(lookupCloseBtn);

        lookup.appendChild(lookupDragHandle);

        this.makeDraggable(lookup, lookupDragHandle);
        containerWrapper.appendChild(lookup);
        // =====================================

    }

    uploadSaveFile(file) {
        // activated by upload button
        // set elements, values and lookup from file
        // set root elements as children of master
        // drawElements()
    }

    addElement(element) {
        // add element to this.elements
        // add element to element.parent.children
        // drawElements() or element.draw()
    }

    addValue(value) {
        if (!value || !value.valueId) {
            console.warn("could not add value, invalid value object")
            return
        }

        this.values[value.valueId] = value
    }

    drawElements() {
        document.getElementById("characterSheet").innerHTML = ""
        this.elements["characterSheet"].draw()
        // clear DOM
        // for element in children {element.draw}
    }

    getElementFromId(elementId) {
        if (this.elements[elementId]){return this.elements[elementId]}
        else console.warn("no element found with elementId: " + elementId)
    }

    getValueFromId(valueId) {
        if (this.values[valueId]) {return this.values[valueId]}
        return null
    }

    getLookupFromKey(key) {

    }

    loadFromFile() {
        this.saveload.loadLocalFile()
    }

    loadFromServer() {
        this.saveload.loadServerFile()
    }

    loadFromTemplate() {
        this.saveload.loadTemplateFile()
    }

    saveToFile() {
        this.saveload.saveCurrentFileLocal()
    }

    saveToServer() {
        this.saveload.saveCurrentFileServer()
    }

    makeDraggable(container, handle) {
        let dragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        handle.addEventListener("pointerdown", (event) => {
            dragging = true;
            startX = event.clientX;
            startY = event.clientY;

            const rect = container.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            handle.setPointerCapture(event.pointerId);
        });

        handle.addEventListener("pointermove", (event) => {
            if (!dragging) return;

            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            const maxLeft = window.innerWidth - container.offsetWidth;
            const maxTop = window.innerHeight - container.offsetHeight;

            const nextLeft = Math.min(Math.max(0, startLeft + dx), Math.max(0, maxLeft));
            const nextTop = Math.min(Math.max(0, startTop + dy), Math.max(0, maxTop));

            container.style.left = `${nextLeft}px`;
            container.style.top = `${nextTop}px`;
        });

        const stopDrag = (event) => {
            if (!dragging) return;
            dragging = false;
            if (event && event.pointerId !== undefined) {
                handle.releasePointerCapture(event.pointerId);
            }
        };

        handle.addEventListener("pointerup", stopDrag);
        handle.addEventListener("pointercancel", stopDrag);
    }

    toggleEditor(enabled) {
        let editor = document.getElementById("editor")
        let layoutTree = document.getElementById("layoutTree")
        let overlay = document.getElementById("selectionOverlay")
        
        if (enabled) {
            editor.classList.add("active")
            layoutTree.classList.add("active")
            if (this.editor?.layoutTree && this.editor.selectedElement) {
                this.editor.layoutTree.highlightElement(this.editor.selectedElement)
            } else if (overlay) {
                overlay.classList.add("active")
            }
        } else {
            editor.classList.remove("active")
            layoutTree.classList.remove("active")
            if (overlay){overlay.classList.remove("active")}
        }
    }

    toggleLookup(enabled) {
        let lookup = document.getElementById("lookup")

        if (enabled) {
            lookup.classList.add("active")
        }
        if (!enabled) {
            lookup.classList.remove("active")
        }
    }

}
