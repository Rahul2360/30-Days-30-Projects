// Make Connection

var socket = io.connect("http://192.168.0.162:5001");

socket.emit('create','room1');
// Query DOM
var messgae = document.getElementById('message'),
  handle = document.getElementById('handle'),
  btn = document.getElementById('send'),
  output = document.getElementById('output'),
  feedback = document.getElementById('feedback');

  add_room = document.getElementById('add-room');
  room_name = document.getElementById('room-name');
  table_body = document.getElementById('table-body');

// Emit Events
btn.addEventListener('click', function() {
  socket.emit('chat',{
    messgae: messgae.value,
    handle: handle.value
  });
});

add_room.addEventListener('click', function() {
  if (room_name.value != '') {
    socket.emit('join_room', room_name.value);
    room_name.value = '';
    get_rooms_list();
  } else {
    alert("Enter room name");
  }
});

function get_rooms_list() {
  table_body.innerHTML = '';
  socket.on('rooms_list', function(data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      table_body.innerHTML += '<tr><td> ' + data[i] + '</td><td><button id="join_' + i + '" class="btn btn-sm btn-primary">Join</button></td></tr>'
    }
  });
}

// Listen for events
messgae.addEventListener('keypress', function(){
  socket.emit('typing', handle.value);
});

socket.on('chat', function(data) {
  feedback.innerHTML = '';
 output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.messgae + '</p>';
});

socket.on('typing',function(data) {
  feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
});