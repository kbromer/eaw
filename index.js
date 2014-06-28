var express = require("express");
var logfmt = require("logfmt");
var app = express();
var port = Number(process.env.PORT || 5000);

app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/'));

app.get('/', function ( req, res){
    res.sendfile(__dirname + '/index.html');
});

app.listen(port, function(){
   console.log('Listening on... ' + port);
});
