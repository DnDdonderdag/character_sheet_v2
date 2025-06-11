const socket = io();

function reportFieldValue(id){
    if (document.getElementById(id)){
        socket.emit("reportFieldValue", document.getElementById(id).value)
    }
    
}


socket.on("requestFieldValue", id => {
    reportFieldValue(id)
});