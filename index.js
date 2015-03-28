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
// ========== Express Init ==========
var express = require("express");
var app = express();
// ========== Sessions, ports env, cookies, http, sockets & logs ==========
var http = require('http').Server(app);
var session = require('express-session');
var io = require('socket.io')(http);
var port = Number(process.env.PORT || 5000);
var logfmt = require("logfmt");
//var Cookies = require( "cookies" );
// ========== Session support for sockets.io ==========
//var cookieParser = require('cookie-parser');
//app.use(cookieParser());
// ========== Redis for session store ==========
var RedisStore = require('connect-redis')(session);
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var redis = require('redis').createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
redis.auth(redisURL.auth.split(":")[1]);
// ========== listen for requests ==========
http.listen(port, function(){
  console.log('Listening on port ' + port);
});

// ========== User sessions ==========
var users = [];

var sessionstore = new RedisStore({ host: redisURL.hostname, port: redisURL.port, client: redis });
// ========== App config ==========
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'itcomesforyou',
                  store: sessionstore,
                  resave: true,
                  saveUninitialized: true,
                  cookie: { /*maxAge: 10000000*/}
                }));
app.use(flash());
app.use(logfmt.requestLogger());
app.use(passport.initialize());
app.use(passport.session());

// ========== App Routes ==========
app.get('/logout', function(req, res){
  req.logout();
  users = [];
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
      //append the cookie to the user data
      var mycookieid = req.headers.cookie;
      mycookieid = mycookieid.split('connect.sid=')[1];
      info.data.mycookie = mycookieid;
      //add the user session data
      info.data.session = userId;
      users[userId] = info.data;
      return res.redirect('/');
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
    //set to client provided socket id
    var user_id = socket.id;

    //clear out the 'dice' portion of the user guid if this is coming from the dice tab
    if (user_id.substring(0, 4) === 'dice'){ user_id = user_id.split('dicebox-')[1]; }

    //check if a client w/ this socket id is already active
    var user = users[user_id];

    //if not active, try and find the user based on the cookie id
    if (typeof user === "undefined") {
      console.log('Socket id not found - searching for matching cookie to link to an active user...');
      var mycookieid = socket.request.headers.cookie;
      mycookieid = mycookieid.split('connect.sid=')[1];
      //loop through existing users and connect this user
      //to their cookie set during the authentication
      for (var x in users){
        var u = users[x];
        console.log(u);
        //found our entry in the users table via
        //cookie match. reset to new user_id
        if (u.mycookie === mycookieid){
          console.log('Found user with a matching cookie.  Welcome ' + u.displayname);
          //changing user id to new socket id
          users[user_id] = u;
          user = u;
          console.log('Setting users new socket id to ' + user_id);
          socket.userid = user_id;
          break;
        }
      }
      //still haven't found a user session to connect to, this is an invalid user, logout the client and run teh auth flow
      if (typeof user === "undefined"){
        console.log('Logging out invalid client...');
        socket.emit('logout_client');
      }else{
        console.log('\t socket.io:: player ' + user_id + ' connected');
        socket.emit('onconnected', {id: user_id, user: user});
      }
    }
    //found the user id, set the socket to the user (it should already be set)
    else{
      console.log('Found user based on socket id ' + socket.userid);
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
        //found user, check password
        eaw_auth.comparePassword(password, result.data.password, function (err, res){
          if(!err){
            if (res === true){
              console.log(username + ' has successfully logged in');
              return done(null, username, result);
            }else{
              console.log('Incorrect password for ' + username);
              return done(null, false, { message: 'Incorrect password' });
            }
          }
          else{
            console.log('Authentication error');
            return done(null, false, { message: 'Authentication error' });
          }
        });
      } else if (result.status === false) {
        console.log(username + " not found");
        return done(null, false, { message: 'Username not found' });
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
