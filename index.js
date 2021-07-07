// SETTINGS
var port = process.env.PORT || 3000
var password = ""; // No password by default

const express = require('express');

const app = express()
const server = app.listen(port, () => console.log(`server listening on port: ${port}`))

var sentPassword;
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    if(password != "" && sentPassword != password){
    socket.to(socket.id).emit('sentPassword', true)
    socket.on('sentPassword', function(){
        sentPassword = password
    })
}
    if(sentPassword == password){
    console.log('New connection!')
    socket.on('mouseMovement', function(data){
        socket.broadcast.emit('mouseMovement', data)
        socket.broadcast.emit('movementAlert')
        console.log("New mouse movement!")
    });
    socket.on('wave', function(){
        socket.broadcast.emit('wave')
    })
    socket.on('disconnected', (evt) => {
        console.log('disconnected')
    })
    socket.broadcast.emit('online')
}
})