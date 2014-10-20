var db = require("./eaw_db.js");
module.exports = {

  ensureAuthenticated: function (req, res, next) {
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
  }
};
