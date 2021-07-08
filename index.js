// SETTINGS
var port = process.env.PORT || 3000;

const express = require("express");

const app = express();
const server = app.listen(port, () =>
  console.log(`server listening on port: ${port}`)
);

const io = require("socket.io")(server);
var connections = [];
io.on("connection", (socket) => {
  var roomID;

  socket.on("roomID", function (ID) {
    roomID = ID;
    connections.push([socket.id, ID]);
    io.to(socket.id).emit("updateUsers", connections)
    console.log("New connection under ID " + roomID + "!");
    for (var i = 0; i < connections.length; i++) {
      if (
        connections[i][1] == connections[connections.length - 1][1] &&
        connections[i][0] != socket.id
      ) {
        io.to(connections[i][0]).emit("online");
      }
    }
  });

  socket.on("mouseMovement", function (data) {
    for (var i = 0; i < connections.length; i++) {
      if (
        connections[i][1] == connections[connections.length - 1][1] &&
        connections[i][0] != socket.id
      ) {
        socket.to(connections[i][0]).emit("mouseMovement", data);
        socket.to(connections[i][0]).emit("movementAlert");
        console.log("New mouse movement under ID " + roomID + "!");
      }
    }
  });

  socket.on("wave", function () {
    for (var i = 0; i < connections.length; i++) {
      if (
        connections[i][1] == connections[connections.length - 1][1] &&
        connections[i][0] != socket.id
      ) {
        socket.to(connections[i][0]).emit("wave");
      }
    }
  });

  socket.on("disconnect", (evt) => {
    console.log("Someone disconnected from ID " + roomID + "!");
    for (var i = 0; i < connections.length; i++) {
        if(connections[i][0] == socket.id){
            connections.splice(i, 1)
        }
    }
  });
});
