// ========== Middleware, auth services, parser, eaw auth & db libraries ==========
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var eaw_auth = require("./js/eaw_auth.js");
var db = require("./js/eaw_db.js");
var bodyParser = require('body-parser');

// ========== Express instance and static var ==========
//self executing
var app = require('express')();
//static
var express = require("express");

// ========== Sessions, ports env, cookies, http, sockets & logs ==========
var session = require('express-session');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = Number(process.env.PORT || 5000);
var logfmt = require("logfmt");
var Cookies = require( "cookies" );   //<--------------- STILL NEED TO BE IMPLEMENTED!!!

// ========== listen for requests ==========
http.listen(port, function(){
  console.log('Listening on port ' + port);
});

// ========== User sessions ==========
var users = [];

// ========== App config ==========
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'itcomesforyou',
                  resave: true,
                  saveUninitialized: true,
                  cookie: { maxAge: 100000000}
                }));
app.use(flash());
app.use(logfmt.requestLogger());
app.use(passport.initialize());
app.use(passport.session());

// ========== App Routes ==========
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      //console.log(req);
      var userId = guid();
      users[userId] = info.data;
      return res.redirect('/?' + userId);
    });
  })(req, res, next);
});
app.get('/login', function(req, res){
  res.sendfile('login.html');
});
app.use('/', function(req, res, next){
  eaw_auth.ensureAuthenticated(req, res, next);
});
app.use('/', express.static(__dirname + '/'));

// ========== socket.io messaging ==========
io.on('connection', function(socket){

  console.log(socket.request.url);

  var user_id = socket.request.url.split('id=')[1];

  var ap = user_id.indexOf('&');
  if(ap > 0) {
    user_id = user_id.substring(0, ap);
  }

  console.log('userid: ' + user_id);
  var user = users[user_id];

  if (user !== undefined){
    console.log(user.username + ' has connected.');
    socket.userid = user_id;
  } else{
    console.log('SOMETHING BETTER------------');
    var mycookieid = socket.request.headers.cookie;
    console.log(mycookieid);
    mycookieid = mycookieid.split('connect.sid=')[1];
    console.log(mycookieid);
  }

  socket.emit('onconnected', {id: socket.userid, user: user});

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
    console.log('Saving games....');
    var result = db.saveGame(msg);
  });//close new_save_game event

  socket.on('new_default_save_game', function (msg){
    console.log('Saving base game....');
    var result = db.saveBaseGame(msg);
  });//close new_save_game event


  socket.on('request_save_game', function (save_name, callback){
      console.log('Loading game ' + save_name);
      db.loadGame(save_name, function(res){
          console.log('res status' + res.status);
          console.log('res result ' + res.result);
          if (res.status === true) { callback(res.result); }
      });
  });//close new_save_game event

});//close io.on

// ========== Auth config - passport.js ==========
passport.serializeUser(function(user, done) {done(null, user);});
passport.deserializeUser(function(user, done) {done(null, user);});

passport.use(new LocalStrategy(
  function(username, password, done) {
    eaw_auth.checkUserAuth(username, password, function(result){
      console.log(result);
      if (result.status === true){
        console.log("Successful login.");
        var user = username;
        return done(null, user, result);
      } else if (result.status === false) {
        console.log("Failed login.");
         return done(null, false, { message: 'Incorrect un/pw' });
      } else {
        console.log("Failed, server error");
        return done(err);
      }
    });
  }
));

// ========== util funcs ==========
var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
})();
