import * as calc from "../decorators/calculate/calculations.js";
import * as sync from "../decorators/syncronising.js";
import * as formfield  from "../constructors/formfield.js";
import * as text from "../constructors/text.js"
import * as autoSize from "../decorators/autoSize.js";

export function create(id, top, left, width, height, parentDivID,labelText, syncClass, alignment){
    /*
        syncClass optional, if left out form will not sync
        LabelText optional, if left out form will fill box
    */
    let frame = document.createElement("div")
    frame.id = id+"Frame"
    frame.className = "not-selectable frame"
    frame.style = "--top:"+String(top)+"px; --left:"+String(left)+"px; --width:"+String(width)+"px; --height:"+String(height)+"px;; --bevel:7.5px;"

    document.getElementById(parentDivID).appendChild(frame)

    let frameFormField
    if(labelText){
        frameFormField = 
            autoSize.autoSizeDecorator(
                formfield.create(id, 7, 10, width-20, height-22, id+"Frame", undefined, alignment)
            )
        text.create(id+"FrameLabel", labelText, height-13, 0, width, 8, id+"Frame", "Scalasans")
    } else{
        frameFormField = 
            autoSize.autoSizeDecorator(
                formfield.create(id, 7, 10, width-20, height-14, id+"Frame", undefined, alignment)
            )
    }

    frameFormField = calc.calcDecorator(frameFormField)

    if (syncClass){
        frameFormField =
            sync.syncDecorator(syncClass, frameFormField)
    }
    

    //create corners
    const rotations = ["scale(-1,1)","scale(1,1)","scale(1,-1)","scale(-1,-1)"];
    const positions = ["--top:0px; --left:0px;"," --top:0px; --left:"+String(width-20)+"px;"," --top:"+String(height-20)+"px; --left:"+String(width-20)+"px;"," --top:"+String(height-20)+"px; --left:0px;"];
    for(let i=0; i<4; i++){
        const corner = document.createElement("img");
        corner.className="corner not-selectable"
        corner.src="assets/svg/FrameCorner.svg";
        corner.alt="corner";
        corner.draggable = false;
        corner.style="--rotate:"+rotations[i]+"; --width:20px; "+positions[i]
        frame.appendChild(corner);
    }
    //Create sides
    const scales = ["--scale:scale("+String((width-15)/20)+",1);","--scale:scale("+String((width-15)/20)+",-1);","--scale:scale(1,"+String((height-38)/20)+");","--scale:scale(-1,"+String((height-38)/20)+");"];
    const tops = ["--top:0px;"," --top:"+String(height-20)+"px;"," --top:"+String(height/2-10)+"px;"," --top:"+String(height/2-10)+"px;"];
    const lefts = ["--left:"+String((width-20)/2)+"px;","--left:"+String((width-20)/2)+"px;","--left:"+String(width-20)+"px;","--left:0px;"];
    for (let i=0 ; i<4; i++){
        const line = document.createElement("img");
        line.className = "horizontalline not-selectable"
        if(i<2){
            line.src="assets/svg/HorizontalLine.svg";
        }
        else{
            line.src="assets/svg/VerticalLine.svg";
        }
        line.alt="line";
        line.draggable = false;
        line.style = tops[i]+lefts[i]+scales[i]
        frame.appendChild(line);
    }
    return frameFormField
}