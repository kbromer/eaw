var db = require("./eaw_db.js");
var bcrypt = require('bcrypt');
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    console.log('Ensuring authentication: ' + req.isAuthenticated());
    console.log(req);
    if (req.isAuthenticated()) {
      return next();
    }
    else{
      res.redirect('/login');
    }
  },

  checkUserAuth: function (username, password, callback) {
    db.getUserInfo(username, function (results) {
          var r = {};
          if(results.status){
            var data = results.data;
            if (data){
              r = results;
            }
            else{
              r.status = false;
              r.data = {};
            }
          }else{
            console.log('DATABASE ERROR');
            r.status = 'Error';
          }
        callback(r);
    });
  },

  cryptPassword: function (password, callback) {
     bcrypt.genSalt(10, function(err, salt) {
      if (err)
        return callback(err);

      bcrypt.hash(password, salt, function(err, hash) {
        return callback(err, hash);
      });

    });
  },

  comparePassword: function (password, userPassword) {
     return bcrypt.compareSync(password, userPassword);
     /*
     bcrypt.compare(password, userPassword, function(err, res) {
        if (err)
          return callback(err);
        return callback(null, res);
     });*/
  }
};
