import * as layoutRenderer from "./utilities/layoutRenderer.js"
import * as playground from "./pages/presetTestPage.js"
import * as update from "./utilities/updater.js"
import * as tooltip from "./utilities/tooltip.js"


function unpackJson(){
    this.style.setProperty("visibility", "hidden")
    const file = this.files[0];
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function() {
        layoutRenderer.render(JSON.parse(reader.result).layout)
    }
    reader.onerror = function() {
        console.log(reader.error);
        alert("Error loading file")
    };
}


document.addEventListener("DOMContentLoaded", function () {

    //temporary setup while testing
    const loadButton = document.createElement("input");
    loadButton.id = "loadLayoutButton"
    loadButton.type = "file"
    loadButton.textContent = "Browse...";
    loadButton.style.position = "absolute"
    loadButton.style.top = 10 + "px";
    loadButton.style.left = 10 + "px";
    loadButton.style.width = ("200px");
    loadButton.style.heigt = ("100px");
    loadButton.draggable = false;
    loadButton.style.zIndex = 0;
    loadButton.accept = "application/JSON"
    loadButton.addEventListener('change', unpackJson, false);

    document.body.appendChild(loadButton);


    
    //for testing
    fetch('/layoutTemplate.json')
        .then(res => res.json())
        .then(data => {
            layoutRenderer.render(data.layout);
            update.onPageLoad()
        })
        loadButton.style.setProperty("visibility", "hidden")

    


    
    update.onPageLoad()
});
