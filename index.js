// SETTINGS
var serverName = "My spousemouse server!"
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
    var serverInfo = {
      "name": serverName,
      "onlineUsers": connections
    }
    io.to(socket.id).emit("serverInfo", serverInfo)
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
    var connectionss = connections
    or (var i = 0; i < connections.length; i++) {
        if(connectionss[i][0] == socket.id){
            connections.splice(i, 1)
        }
        if (
          connectionss[i][1] == connectionss[connectionss.length - 1][1] &&
          connectionss[i][0] != socket.id
        ) {
          socket.to(connections[i][0]).emit("disconnected");
        }
    }
  });
});
