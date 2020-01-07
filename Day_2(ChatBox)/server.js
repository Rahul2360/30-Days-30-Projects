var express = require('express');
var socket = require('socket.io');

// App Setup
var app = express();
var server = app.listen(5001, function () {
  console.log("Listening to Port 3001");
});

// Static files
app.use(express.static('front_end'));

// Socket Setup
var io = socket(server);

rooms = [];

io.on('connection', function (socket) {
  console.log("Made Socket Connection");
 
  socket.on('chat', function(data) {
    io.sockets.emit('chat', data);
  });

  socket.on('typing', function(data) {
    socket.broadcast.emit('typing', data);
  });

  socket.on("join_room", function(room) {
    socket.join(room);
    rooms.push(room);
    emitRooms();
  });


  socket.on("message", function (room, message) {
    // message and room
    socket.to(room).emit("message", {
      message,
      name: "Friend"
    });
  });

  socket.on('room_typing', function(room) {
    socket.to(room).emit('room_typing', "Someone is typing");
  });

  socket.on('stopped_typing', function(room) {
    socket.to(room).emit('stopped_typing');
  });

  socket.on('disconnect', function() {
    console.log('User Disconected');
    // emitVistors();
    // for (var i = 0 ;i< users.length; i++) {
    //   if (socket.id == users[i].id) {
    //     users.splice(i,1);
    //   }
    // }
  });

});

// function getVisitors() {
//   var clients = io.sockets.clients().connected;
//   var sockets = Object.values(clients);
//   var users = sockets.map(s => s.user);
//   return users;
// }

function emitRooms() {
  io.emit("rooms_list", rooms);
}