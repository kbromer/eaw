var pg = require('pg');
var params = process.env.DATABASE_URL ? process.env.DATABASE_URL : { host: 'ec2-54-243-48-227.compute-1.amazonaws.com',user: 'pyknnfhllbshxm',password: 'pU30R6b8fwRmLUT_rFGSqm7Jvf',database: 'dd3btnvauc5ffj',ssl: true, port: 5432 };
var client = new pg.Client(params);
module.exports = {

  saveBaseGame: function (msg) {
    client = new pg.Client(params);
    client.connect(function(err) {
      if(err){
        return console.error('could not connect to postgres', err);
      }
      client.query("UPDATE eaw.save_games SET modified_datetime=now(), game_data = '" + msg + "' WHERE name='default_new_game'", function(err, result) {
        if(err) {
          return console.error('Failed to save game.', err);
        }
      client.end();
      });
    });
  },

  saveGame: function (msg) {

    client = new pg.Client(params);
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
  },

  loadGame: function (game, callback) {
    client = new pg.Client(params);
    client.connect(function(err) {
      if(err){
        return callback(console.error('could not connect to postgres', err));
      }
      client.query("SELECT game_data FROM eaw.save_games WHERE name = '" + game + "'", function(err, result) {
        if(err) {
          client.end();
          return callback(console.error('Failed to load game', err));
        } else{
          //(created_datetime, modified_datetime, game_data, name)
          console.log('Sending back: ' + result.rows[0]);
          client.end();
          return callback({status: true, result: result.rows[0] });
        }
      });
    });
  },

  getUserInfo: function (username, callback) {
    console.log('getting user info');
    client = new pg.Client(params);
    client.connect(function(err) {
      if(err){
        return callback(console.error('could not connect to postgres', err));
      }
      var q = "SELECT username, password, displayname FROM eaw.users WHERE username = '" + username + "'";
      console.log(q);
      client.query(q, function(err, result) {
        if (err){
          client.end();
          return callback(console.error('query error', err));
        } else{
          var results = {status: true, data: result.rows[0]};
          client.end();
          callback(results);
        }
      });



      /*client.query("SELECT  '" + username + "'", function(err, result) {
        if(err) {
          return console.error('Failed to load game', err);
        } else{
          //(created_datetime, modified_datetime, game_data, name)
          console.log('Returning ' + result.rows);
          console.log('Returning ' + result.rows[0]);

          return {status: true, result: result.rows[0]};
        }
        client.end();
      });*/
    });

  }
};
