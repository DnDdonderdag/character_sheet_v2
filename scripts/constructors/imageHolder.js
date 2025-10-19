
export function create(id, top, left, width, height, parentDivID, startImage, jsonBool){
    let uploadButton = document.createElement("input")
    uploadButton.type = "file"
    uploadButton.id = id+"UploadButton"
    uploadButton.accept = "image/*"
    uploadButton.style.display = "none"
    uploadButton.className = "imageHolderUploadButton"
    uploadButton.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px;"

    let imageHolder = document.createElement("div")
    imageHolder.className = "imageHolder save calc"
    imageHolder.id = id
    imageHolder.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px;"

    uploadButton.addEventListener("change", () => {
    const file = uploadButton.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result;
            imageHolder.textContent = base64String
            console.log("Base64:", base64String);
        };
        reader.readAsDataURL(file);
    }); 


    const targetDiv = imageHolder;

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList" || mutation.type === "characterData") {
                imageHolder.style.backgroundImage = `url(${imageHolder.textContent})`;
            }
        }
    });

    observer.observe(targetDiv, {
        childList: true,       // detects when children are added/removed
        characterData: true,   // detects text changes
        subtree: true          // ensures nested text nodes are also watched
    });

    imageHolder.textContent = startImage  

    jsonBool = (jsonBool === undefined || jsonBool === null || jsonBool === "null" || jsonBool === "undefined") ? true : jsonBool;
    if(jsonBool){
        imageHolder.className += " json"
        let jsonCode = '"' + id + '":{"function":"imageHolder","args":["'+id+'",'+top+','+left+','+width+','+height+',"'+parentDivID+'","'+startImage+'",'+jsonBool+']},'
        imageHolder.json = jsonCode
    }

    document.getElementById(parentDivID).appendChild(imageHolder)
    document.getElementById(parentDivID).appendChild(uploadButton)
}

