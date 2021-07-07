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
  console.log("New connection!");
  socket.on("roomID", function (ID) {
    roomID = ID;
    console.log(ID)
    connections.push([socket.id, ID]);
  });

  socket.on("mouseMovement", function (data) {
    for (var i = 0; i < connections.length; i++) {
      if (
        connections[i][1] == connections[connections.length - 1][1] &&
        connections[i][0] != socket.id
      ) {
        socket.broadcast.emit("mouseMovement", data);
        socket.broadcast.emit("movementAlert");
        console.log("New mouse movement!");
      }
    }
  });

  socket.on("wave", function () {
    for (var i = 0; i < connections.length; i++) {
      if (
        connections[i][1] == connections[connections.length - 1][1] &&
        connections[i][0] != socket.id
      ) {
        socket.broadcast.emit("wave");
      }
    }
  });

  socket.on("disconnected", (evt) => {
    for (var i = 0; i < connections.length; i++) {
      if (
        connections[i][1] == connections[connections.length - 1][1] &&
        connections[i][0] != socket.id
      ) {
        console.log("disconnected");
      }
    }
  });
  for (var i = 0; i < connections.length; i++) {
    console.log(connections);
    if (
      connections[i][1] == connections[connections.length - 1][1] &&
      connections[i][0] != socket.id
    ) {
      socket.to(connections[i][0]).emit("online");
    }
  }
});
