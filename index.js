//auth
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;


var app = require('express')();
//doing this to get at the static below
//not sure i need this second var though
var express = require("express");

var session = require('express-session');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = Number(process.env.PORT || 5000);
var logfmt = require("logfmt");
var db = require("./js/eaw_db.js");
/*  Authentication services for eaw.js */
var eaw_auth = require("./js/eaw_auth.js");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded());

//app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(session({ secret: 'itcomesforyou' }));
app.use(flash());
app.use(logfmt.requestLogger());
app.use(passport.initialize());
app.use(passport.session());

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
app.get('/login', function(req, res){
  res.sendfile('login.html');
  //res.render('/login.html', { user: req.user });
});

var user;

app.use('/', function(req, res, next){
  eaw_auth.ensureAuthenticated(req, res, next);
  user = req.user;
});
app.use('/', express.static(__dirname + '/'));

io.on('connection', function(socket){
  console.log('A user connected');
  console.log(user);
  socket.userid = guid();
  socket.emit('onconnected', {id: socket.userid, });
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
    var result = db.saveGame(msg);
  });//close new_save_game event


  socket.on('load_save_game', function (save_name){
    var res = db.loadGame(save_name);
    if (res.status === true) { socket.emit('save_game_retrieved', res.result); }
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

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //findById(id, function (err, user) {
  done(null, user);
  //});
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    eaw_auth.checkUserAuth(username, password, function(result){
      console.log(result);
      if (result.status === true){
        console.log("Successful login.");
        var user = username;
        return done(null, user);
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
