var app = require('express')();
//doing this to get at the static below
//not sure i need this second var though
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = Number(process.env.PORT || 5000);
var logfmt = require("logfmt");

app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('A user connected');
  socket.userid = guid();
  socket.emit('onconnected', {id: socket.userid});
  //Useful to know when someone connects
  console.log('\t socket.io:: player ' + socket.userid + ' connected');

  //When this client disconnects
  socket.on('disconnect', function () {
    //Useful to know when someone disconnects
    console.log('\t socket.io:: client disconnected ' + socket.userid );
  }); //client.on disconnect

  //fired when a unit is dropped on the players board
  //contains the zone which has the unit and other information
  socket.on('unit_dropped', function(msg){
    socket.broadcast.emit('unit_drop_notify', msg);
  });
  //fired when a unit is being dragged
  socket.on('unit_dragging', function (msg){
    socket.broadcast.emit('unit_dragging_notify', msg);
  });
});

http.listen(port, function(){
  console.log('Listening on port ' + port);
});

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
})();
