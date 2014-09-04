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
});

http.listen(port, function(){
  console.log('Listening on port ' + port);
});
