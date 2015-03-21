//Configure nodetime for heroku monitoring
if(process.env.NODETIME_ACCOUNT_KEY) {
  require('nodetime').profile({
    accountKey: process.env.NODETIME_ACCOUNT_KEY,
    appName: 'EAW Main Process'
  });
}
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
var Cookies = require( "cookies" );
// ========== Session support for sockets.io ==========
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// ========== Redis for session store ==========
var redis = require('redis');
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

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
var SessionSockets = require('session.socket.io');
sessionSockets = new SessionSockets(io, client, cookieParser());

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
      console.log('logIn user ' + user);
      var userId = guid();
      //lock this user to this cookie?
      var mycookieid = req.headers.cookie;
      mycookieid = mycookieid.split('connect.sid=')[1];
      info.data.mycookie = mycookieid;
      req.session.userId = userId;
      console.log('COOKIE:' + mycookieid);
      console.log('USERID: ' + userId);

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
sessionSockets.on('connection', function(err, socket, session){

  console.log(socket.request.url);
  console.log(session);
  var user_id = socket.request.url.split('id=')[1];


  //var otherid = socket.request.session.userId;


  //console.log('OTHERID: ' + otherid);
  var ap = user_id.indexOf('&');
  if(ap > 0) {
    user_id = user_id.substring(0, ap);
  }

  var lookupid = user_id;
  if (user_id.substring(0, 4) === 'dice'){ lookupid = user_id.split('dicebox-')[1]; }
  var user = users[lookupid];

  if (typeof user === "undefined") {
    console.log('No valid ID, attempting cookie match');
    var mycookieid = socket.request.headers.cookie;

    mycookieid = mycookieid.split('connect.sid=')[1];
    console.log(mycookieid);

    for (var x in users){
      var u = users[x];
      console.log(u);
      //found our entry in the users table via
      //cookie match. reset to new user_id
      console.log(u.mycookie + '    +++and+++    ' + mycookieid);
      if (u.mycookie === mycookieid){
        //create a new id and assign it to user_id
        user_id = guid();
        users[user_id] = u;
        user = u;
        break;
      }
    }
  }
  else{
    console.log('Found Id');
    socket.userid = user_id;
  }
  //still haven't found a user session to connect to, logout the client
  if (typeof user === "undefined"){
    socket.emit('logout_client');
  } else{
    socket.emit('onconnected', {id: user_id, user: user});
    //Useful to know when someone connects
    console.log('\t socket.io:: player ' + user_id + ' connected');
  }


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
