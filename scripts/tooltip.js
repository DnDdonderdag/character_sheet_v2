addEventListener("keydown", showTooltip, false);
addEventListener("keyup", removeTooltip, false);

function showTooltip(event){
    if (event.keyCode == "17" && document.activeElement != document.body){
        let activeElement = document.activeElement;
        const rect = activeElement.getBoundingClientRect(); 

        const tooltip = document.createElement("div");
        tooltip.id = "tooltip"
        tooltip.textContent = activeElement.id;
        tooltip.style.top = `${rect.top}px`;
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.height = "20px";
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