var app = require('express')();
//doing this to get at the static below
//not sure i need this second var though
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = Number(process.env.PORT || 5000);
var logfmt = require("logfmt");
var pg = require('pg');
var params = process.env.DATABASE_URL ? process.env.DATABASE_URL : { host: 'ec2-54-243-48-227.compute-1.amazonaws.com',user: 'pyknnfhllbshxm',password: 'pU30R6b8fwRmLUT_rFGSqm7Jvf',database: 'dd3btnvauc5ffj',ssl: true, port: 5432 };

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
  socket.on('new_save_game', function (msg){
    var client = new pg.Client(params);

    client.connect(function(err) {
      if(err){
        return console.error('could not connect to postgres', err);
      }
      client.query("INSERT INTO eaw.save_games(created_datetime, modified_datetime, game_data, name) VALUES (now(), now(), '" + msg + "', 'The save game')", function(err, result) {
        if(err) {
          return console.error('Failed to save game.', err);
        }
        client.end();
      });
    });
  });//close new_save_game event


  socket.on('load_save_game', function (save_name){
    var client = new pg.Client(params);

    client.connect(function(err) {
      if(err){
        return console.error('could not connect to postgres', err);
      }
      client.query("SELECT game_data FROM eaw.save_games WHERE name = '" + save_name + "'", function(err, result) {
        if(err) {
          return console.error('Failed to load game', err);
        } else{
          //(created_datetime, modified_datetime, game_data, name)
          socket.emit('save_game_retrieved', result[0]);
          return console.log('Returning data for ' + save_name);
        }
        client.end();
      });
    });
  });//close new_save_game event


});//close io.on

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
