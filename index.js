// SETTINGS
var port = process.env.PORT || 3000

const express = require('express');

const app = express()
const server = app.listen(port, () => console.log(`server listening on port: ${port}`))

const io = require('socket.io')(server)
var connections = [];
io.on('connection', (socket) => {
    var roomID;
    console.log('New connection!')
    socket.on('roomID', function(ID){
        roomID = ID
        connections.push([socket.id, ID])
    })
    
    socket.on('mouseMovement', function(data){
        connections.forEach(user => function(){
            if(user[1] == connections[connections.length-1][1] && user[0] != connections[connections.length-1][0]){
        socket.broadcast.emit('mouseMovement', data)
        socket.broadcast.emit('movementAlert')
        console.log("New mouse movement!")
            }
    })
    });

    socket.on('wave', function(){
        connections.forEach(user => function(){
            if(user[1] == connections[connections.length-1][1] && user[0] != connections[connections.length-1][0]){
        socket.broadcast.emit('wave')
    }
})
    })

    socket.on('disconnected', (evt) => {
        connections.forEach(user => function(){
            if(user[1] == connections[connections.length-1][1] && user[0] != connections[connections.length-1][0]){
        console.log('disconnected')
    }
})
    })

    for(var i = 0; i < connections.length; i++){
        console.log("a")
        if(user[1] == connections[connections.length-1][1] && user[0] != connections[connections.length-1][0]){
    socket.to(user[0]).emit('online')
        }
    }
})