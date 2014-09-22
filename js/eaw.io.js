  eaw.io = {};

  eaw.io.connectToServer = function () {
    //connect socket
    eaw.io.socket = io.connect();

    eaw.io.socket.on('onconnected', function( data ) {
      //Note that the data is the object we sent from the server, as is. So we can assume its id exists.
      console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
      //when a unit is dropped on another player's board
      //in the same game
      eaw.io.socket.on('unit_drop_notify', function (data){
        eaw.io.networkDropHandler(data);
      });
      eaw.io.socket.on('unit_dragging_notify', function (data){
        eaw.io.networkDragHandler(data);
      });
    });
  }

  eaw.io.sendMove = function (unit, action){

    var country = unit.data("Unit").unit_owner;
    var zone = unit.data("Unit").location_zone;
    var unit_type = unit.data("Unit").unit_type;
    var set_name = country + '_unit_set';
    var unit_id = unit.data("Unit").id

    console.log('Sending click move.');
    var message_body = {};
    message_body.unitid = unit_id;
    message_body.zonename = zone.name;
    message_body.unit_x = unit.matrix.e;
    message_body.unit_y = unit.matrix.f;
    message_body.unit_country = country;
    message_body.unit_path = unit.pathstring;
    message_body.unit_pathstring = unit.data("Unit").pathstring;
    message_body.unit_type = unit_type;
    var message = JSON.stringify(message_body);
    //send the server the zone with its new unit
    if (action === 'drag')
      eaw.io.socket.emit('unit_dragging', message);
    else if (action === 'drop')
      eaw.io.socket.emit('unit_dropped', message);
  }

  eaw.io.networkDragHandler = function(data){
    console.log('Picked a unit up');
    console.log(data);
    var udp = JSON.parse(data);
    var local_unit = '';
    var unitid = udp.unitid;
    for (var i=0; i < eaw.game.GAME_PIECES.length; i++){
      console.log(eaw.game.GAME_PIECES[i] + ' v ' + unitid);
      if (eaw.game.GAME_PIECES[i].id === unitid){
        isExistingPiece = true;
        local_unit = eaw.game.GAME_PIECES[i];
      }
    }
    console.log(local_unit);
    console.log(local_unit.el);
    console.log('creating a shadow');
    //var f = eaw.paper.filter(Snap.filter.shadow(0, 2,'yellow', 3));
    //var f = eaw.paper.filter('');
    console.log('filter created');
    local_unit.el.attr({stroke: 'red'});
    console.log('shadow added');
    eaw.unitMousedownHandler(local_unit.el, event, true);
  }


    //handles drop events from other players
  eaw.io.networkDropHandler = function(data){
    console.log('Dropped data');
    var udp = JSON.parse(data);

    var country_set = udp.unit_country + '_unit_set';
    var type_set = udp.unit_type;
    var unitid = udp.unitid;
    console.log('Step1');
    //does this unit exist already for this game?, look for it
    var isExistingPiece = false;
    var unit = '';
    for (var i=0; i < eaw.game.GAME_PIECES.length; i++){
      if (eaw.game.GAME_PIECES[i].id === unitid){
        isExistingPiece = true;
        unit = eaw.game.GAME_PIECES[i];
      }
    }
    console.log('Step2');
    //if unit is already on the board, just apply a transformation and call unitMouseupHandler
    if (isExistingPiece){
      unit.el = unit.el.transform('t' + udp.unit_x + ',' + udp.unit_y);
    }
    //if its a brand new unit from off-board, create a new unit with the same id, draw, drop it, move it, then call unitMouseupHandler
    else {
      var params = {myPath: null, myOwner: udp.unit_country, myId: unitid};
      unit = eaw.createUnit(type_set, params);
      unit.drawElement();
      unit.el = unit.el.transform('t' + udp.unit_x + ',' + udp.unit_y);
      unit.el.data("Unit", unit);
    }
    unit.el.attr({stroke: 'black'});
    console.log('unitMouseupHandler');
    eaw.unitMouseupHandler(unit.el, event, true);
  }//close networkDropHandler
