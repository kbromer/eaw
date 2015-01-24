

  window.onload = function(){
    'use strict';
    console.log("Window loaded.");

    var myUserId = window.location.search.slice(1);
    eaw.io.clientid = myUserId;
    console.log('Assigned clientid of dicebox-' + eaw.io.clientid);

    eaw.io.connectToServer({userid: 'dicebox-' + eaw.io.clientid });

    console.log("Dicebox window connected to server");

        $.getScript( "dice/dice.js", function(){
          $.getScript( "dice/main.js", function(){

              var dice_div = document.getElementById("dice_container");
                console.log(dice_div);
              dice_initialize(document.body, window.innerWidth - 1, window.innerHeight - 1);
              console.log('Loaded dice elements.');

        //      $("canvas").attr("background-color", "rgba(0, 0, 0, 0.5)");
          });
        });

    };
