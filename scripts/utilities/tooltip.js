addEventListener("keydown", showTooltip, false);
addEventListener("keyup", removeTooltip, false);

function showTooltip(event){
    if (event.keyCode == "17" && document.activeElement != document.body){
        let activeElement = document.activeElement;
        const rect = activeElement.getBoundingClientRect(); 

        const tooltip = document.createElement("div");
        tooltip.id = "tooltip"
        tooltip.style.height = "20px";
        tooltip.textContent = activeElement.id;
        if (activeElement.className.includes("sync")){
            let classname = activeElement.className
            let preSliced = classname.slice(activeElement.className.indexOf("syncMe")) // filtering the syncclass from within the enitre class string
            let syncClass = (preSliced.indexOf(" ") == -1) ? preSliced : preSliced.slice(6, preSliced.indexOf(" ")) // finishing filtering (this is a one line if-else)
            tooltip.textContent += "\n" + syncClass
            tooltip.style.height = "40px";
        }
        tooltip.style.top = `${rect.top}px`;
        tooltip.style.left = `${rect.left}px`;
        
        tooltip.style.backgroundColor = "#c5c6c7";
        tooltip.style.fontFamily =  "scalasans";
        tooltip.style.color = "black";
        tooltip.style.position = "absolute";
        tooltip.style.padding = "1px"
        tooltip.style.zIndex = 1001;
        document.body.appendChild(tooltip);
    }
}

function removeTooltip(){
    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
        tooltip.remove();
    }
}