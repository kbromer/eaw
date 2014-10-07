var app = require('express')();
//doing this to get at the static below
//not sure i need this second var though
var express = require("express");

//auth
var passport = require("passport");
var flash = require("connect-flash");
var LocalStrategy = require("passport-local").Strategy;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = Number(process.env.PORT || 5000);
var logfmt = require("logfmt");
var pg = require('pg');
var params = process.env.DATABASE_URL ? process.env.DATABASE_URL : { host: 'ec2-54-243-48-227.compute-1.amazonaws.com',user: 'pyknnfhllbshxm',password: 'pU30R6b8fwRmLUT_rFGSqm7Jvf',database: 'dd3btnvauc5ffj',ssl: true, port: 5432 };
//var params = "postgres://kbromer:pradip14@local:5432/eaw"
/*  Authentication services for eaw.js */
eaw_server = {};
eaw_server.auth = {};






eaw_server.auth.users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

eaw_server.auth.findById = function (id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
};

eaw_server.auth.findByUsername = function (username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
eaw_server.auth.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};


app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/'));
/*
app.get('/',  function(req, res){
  var que = eaw_server.auth.ensureAuthenticated(req, res);
  console.log('Serving it up: ');
  console.log(que);
  res.render('index.html', { user: req.user });
});*/
app.get('/login', function(req, res){
  res.render('login.html', { user: req.user });
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  });


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
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

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      eaw_server.auth.findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));
