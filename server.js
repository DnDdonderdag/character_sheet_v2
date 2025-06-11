const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 5000; //CHANGE BEFORE COMITTING (to 5000)

app.set('trust proxy', true);
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/sheet.html");
});



function requestFieldValue(socket, id){
  socket.emit("requestFieldValue", id)
}





io.on('connection', (socket) => {
  //console.log(`Nieuwe verbinding: ${socket.id}`);


  //requestFieldValue(socket, "fullCasterTemplate")
  socket.on("reportFieldValue", data => {
    //console.log(data)
  });



  socket.on('disconnect', () => {
    //console.log('User disconnected');
  });
});









server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});