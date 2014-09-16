  //set a namespace to drop funcs into as needed
  eaw = {}
  eaw.game;
  eaw.savegame;
  eaw.socket;
  eaw.ALL_NATIONS = ['de', 'uk', 'ru', 'fr', 'us', 'it'];
  eaw.UNIT_TYPES = ['infantry', 'fighter', 'armor', 'artillery', 'bomber', 'cruiser', 'battleship', 'carrier', 'transport'];
  eaw.paper;
  eaw.loadGame = function (game) {
  //  eaw.removeAllPieces();

    console.log('Loading data...');
    var model = JSON.parse(game);

    //eaw.game = model;
    console.log(model);
    eaw.game = new eaw.Game();
    //create new nations
    eaw.game.ACTIVE_NATIONS =[];
    for (var i = 0; i < model.ACTIVE_NATIONS.length; i++){

      var new_nation = new eaw.Nation(model.ACTIVE_NATIONS[i]);
      new_nation.cash = model.ACTIVE_NATIONS[i].cash;
      eaw.game.ACTIVE_NATIONS[i] = new_nation;

    }
    //set the game turn
    eaw.game.GAME_TURN = model.GAME_TURN;
    //set the current nation
    for (var i = 0; i < eaw.game.ACTIVE_NATIONS.length; i++){
        if (eaw.game.ACTIVE_NATIONS[i].name === model.CURRENT_NATION.name){
          eaw.game.CURRENT_NATION = eaw.game.ACTIVE_NATIONS[i];
          break;
        }
    }


    /*
    this.ACTIVE_NATIONS = new Array();
    //create nations
    for (var i = 0; i < eaw.ALL_NATIONS.length; i++){
      this.ACTIVE_NATIONS.push(new eaw.Nation(eaw.ALL_NATIONS[i]));
    }
    this.GAME_TURN = 0;
    this.CURRENT_NATION = this.ACTIVE_NATIONS[0];
    this.CURRENT_NATION_INDEX = 0;
    this.INACTIVE_NATIONS = new Array();
    this.GAME_PIECES = [];
    this.ZONE_SET = [];
    */


  }


  eaw.removeAllPieces = function () {
    console.log('Clearing existing game...');
    for (var i = 0; i < eaw.game.ZONE_SET.length; i++){
      var zone = eaw.game.ZONE_SET[i];
      for (var countryname in zone){
        if (countryname !== undefined && countryname.substr(3,11) == 'unit_set'){

          var name = countryname.slice(3,11);

          if(name == 'unit_set'){
            var countryset = zone[countryname];
            for (var unittype in countryset){
              if (unittype !== undefined && eaw.UNIT_TYPES.indexOf(unittype) > -1){
                var unitcollection = countryset[unittype];
                for (var elname in unitcollection){
                  console.log(elname);
                  console.log(elname.substr(0,2));
                  if (elname.substr(0, 2) == 'ge'){
                    var el = unitcollection[elname];
                    console.log('deleting');
                    el.remove();
                    delete zone[countryname][unittype][elname];
                  }
                }
              }
            }
          }
        }
      }
    }
  }

eaw.Game = function() {
  //possible nations

  this.ACTIVE_NATIONS = new Array();
  //create nations
  for (var i = 0; i < eaw.ALL_NATIONS.length; i++){
    this.ACTIVE_NATIONS.push(new eaw.Nation(eaw.ALL_NATIONS[i]));
  }
  this.GAME_TURN = 0;
  this.CURRENT_NATION = this.ACTIVE_NATIONS[0];
  this.CURRENT_NATION_INDEX = 0;
  this.INACTIVE_NATIONS = new Array();
  this.GAME_PIECES = [];
  this.ZONE_SET = [];
}


eaw.Game.prototype = {
  constructor: eaw.Game,
  getCurrentNation: function(){
      if (this.CURRENT_NATION == ''){
        this.CURRENT_NATION = this.ACTIVE_NATIONS[0];
        this.CURRENT_NATION_INDEX = 0;
      }
      return this.CURRENT_NATION;
  },
  nextNation: function(){
    if (this.CURRENT_NATION_INDEX == this.ACTIVE_NATIONS.length - 1){
      this.CURRENT_NATION_INDEX = 0;
    }
    else{
      this.CURRENT_NATION_INDEX++;
    }
    this.CURRENT_NATION = this.ACTIVE_NATIONS[this.CURRENT_NATION_INDEX];
    return this.CURRENT_NATION;
  },
  previousNation: function(){
    if (this.CURRENT_NATION_INDEX == 0){
      this.CURRENT_NATION_INDEX = this.ACTIVE_NATIONS.length - 1;
    }
    else{
      this.CURRENT_NATION_INDEX--;
    }
    this.CURRENT_NATION = this.ACTIVE_NATIONS[this.CURRENT_NATION_INDEX];
    return this.CURRENT_NATION;
  },
  save: function() {
    eaw.savegame = JSON.stringify(this, function (key, value){
      if (key == 'node' || key == 'paper' || key == 'el' || key == '_drag' || key == 'anims' || key == 'events' || key === 'pathstring'){
        //kill any vars we don't want to save time/space
        return;
      }
      return value;
    });

    var model = JSON.parse(eaw.savegame);
    console.log(model);

  }
};


  eaw.Player = function () {


  }
  eaw.Player.prototype = {
    constructor: eaw.Player
  };


  eaw.unitMouseupHandler = function (unit, event, remoteDraw){
    //use the upper left corner of the element
    var b = unit.getBBox();
    var unit_type = unit.data("Unit").unit_type;

  /* FIGURING OUT BEST DROP POINT TO USE
    console.log('BX: ' + b.x);
    console.log('BY: ' + b.y);
    console.log('event.x: ' + event.pageX);
    var py = event.pageY;
    py = py - 125;
    console.log('event.y: ' + py);*/

    /*** Figure out what zone we've been dropped into
         and assign unit to the appropriate array [country][type]  ***/
    for (var i = 0; i < eaw.game.ZONE_SET.length; i++){
      var zone_element = eaw.game.ZONE_SET[i];
      if (Snap.path.isPointInside(zone_element.el.attr('path'), b.x, b.y)){

        zone_element.flash();

        var unit_id = unit.data("Unit").id;

        var country = unit.data("Unit").unit_owner;

        //set the units location to the zone it was dropped on
        unit.data("Unit").location_zone = zone_element;
        var set_name = country + '_unit_set';

        console.log(country + ' ' + unit_type + ' ' + unit_id + ' landed in ' + zone_element.name);
        var country_name = '';
        //increment the alliance counters for this zone
        for (var i = 0; i < eaw.game.ACTIVE_NATIONS.length; i++){
          var nation = eaw.game.ACTIVE_NATIONS[i];
          if (country === nation.id){
            country_name = nation.unit_name;            
            switch (nation.alliance){
              case "allies":
                zone_element.ally_count += 1;
                break;
              case "axis":
                zone_element.axis_count += 1;
                break;
              case "russia":
                zone_element.russia_count += 1;
                break;
              }
          }
        }

        var t = unit.paper.text(b.x, b.y, country_name + ' ' + unit_type + ' added to ' + zone_element.name).animate({ opacity : 0 }, 2000, function () { this.remove() });;

        //build the zone arrays to stack armies
        if (zone_element[set_name] === undefined){
          zone_element[set_name] = {};
        }
        //create an empty array for this unit type if required
        if (zone_element[set_name][unit_type] === undefined){
            zone_element[set_name][unit_type] = {};
        }

        zone_element[set_name][unit_type][unit_id] = unit;
        var unit_set = zone_element[set_name][unit_type];

        var prop_count = 0;

        for(var x in unit_set) {
          prop_count++;
        }

        if (prop_count > 1){
          eaw.redrawChipStack(b.x, b.y + 15, unit_set, unit);
        }
        eaw.game.ZONE_SET[i] = zone_element;
        if (!remoteDraw){
          console.log('Sending move to server.');
          var message_body = {};
          message_body.unitid = unit_id;
          message_body.zonename = zone_element.name;
          message_body.unit_x = unit.matrix.e;
          message_body.unit_y = unit.matrix.f;
          message_body.unit_country = country;
          message_body.unit_path = unit.pathstring;
          message_body.unit_pathstring = unit.data("Unit").pathstring;
          message_body.unit_type = unit_type;
          var message = JSON.stringify(message_body);
          //send the server the zone with its new unit
          eaw.socket.emit('unit_dropped', message);
        }


        //check if zone is now occupied, contested or liberated
        zone_element.checkOwnerStatus();

      //break on the first matching path we find
      break;
      }
    }






  }//end unitMouseupHandler

  eaw.unitMousedownHandler = function (unit, event, remoteDraw){
    //pull it out of the existing unit_set

    var country = unit.data("Unit").unit_owner;
    var zone = unit.data("Unit").location_zone;
    var unit_type = unit.data("Unit").unit_type;
    var set_name = country + '_unit_set';
    var unit_id = unit.data("Unit").id

    console.log('Removing ' + unit_id + ' ' + unit_type + ' from ' + zone.name);

    var the_unit = zone[set_name][unit_type][unit.data("Unit").id];
    delete zone[set_name][unit_type][unit.data("Unit").id];

    //decrement the unit counter for this zone
    for (var i = 0; i < eaw.game.ACTIVE_NATIONS.length; i++){
      var nation = eaw.game.ACTIVE_NATIONS[i];

      if (country === nation.name){
        switch (nation.alliance){
          case "allies":
            zone.ally_count--;
            break;
          case "axis":
            zone.axis_count--;
            break;
          case "russia":
            zone.russia_count--;
            break;
          }
      }
    }

    //remaining units
    var unit_set = zone[set_name][unit_type];

    //count the # of remaining units
    var prop_count = 0;
    //get a reference to a unit to repaint
    var remaining_unit;
    for(var x in unit_set) {
      prop_count++;
      if (x != unit.data("Unit").id){
        remaining_unit = x;
      }
    }
    if (prop_count > 0){
      //find the remaining unit, restyle from chip back to a board piece
      var leftover_unit = unit_set[remaining_unit];
      var unit_obj = leftover_unit.data("Unit");
      var original_path = unit_obj.pathstring;
      leftover_unit.node.setAttribute("d", original_path);
      //leftover_unit.transform('t' + the_unit.x + ',' + the_unit.y);
      leftover_unit.attr({'display': 'initial', fill: unit_obj.country_gradient});
      leftover_unit.drag(unit_obj.move, unit_obj.start, unit_obj.stop);
      var b = leftover_unit.getBBox();
      eaw.redrawChipStack(b.x, b.y + 15, unit_set, leftover_unit);
    }

    if (!remoteDraw){
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
      eaw.socket.emit('unit_dragging', message);
    }


  }//close unitMousedownHandler



  eaw.redrawChipStack = function (xchiploc, ychiploc, unit_set, locked_unit){

    //set the path string for the marker - path of a 10-5 ellipse
    var chip_path_string = 'M-10,0a10,5 0 1,0 20,0a10,5 0 1,0 -20,0';
    var x_chip_location = xchiploc;
    var y_chip_location = ychiploc;

    //this code sets draws numbers on svg elements to count the stack
  /*      var original_path = unit.node.getAttribute("d");
    original_path = original_path + ' ' + getNumberPath(prop_count.toString());
    unit.node.setAttribute("d", original_path);
    unit.attr({path: original_path});*/
    var white_chips = [];
    //for every unit of the dropped type in this zone
    for (var unit_id in unit_set){

      //if you're not referring to the unit i just dropped
        //  - insert after the unit dropped so appears in teh right order
        // - turn the unit into a chip
        // - set the chip to white
        // - move the chip to the right location
      if (unit_id !== locked_unit.data("Unit").id){
        //insert it behind the drawn unit
        unit_set[unit_id].after(locked_unit);
        //turn it into a chip
        unit_set[unit_id].node.setAttribute("d", chip_path_string);
        //color the chip
        unit_set[unit_id].attr({fill: 'white', stroke: 'black', 'visibility': 'initial'});
        //set the location to next to the unit
        unit_set[unit_id].transform('t' + x_chip_location + ',' + y_chip_location);
        //turn off dragging on the individual chips
        unit_set[unit_id].undrag();
        y_chip_location = y_chip_location - 3;
        white_chips[white_chips.length] = unit_set[unit_id];
      }
    }

    //recolor and display chips into red-chip 5s
    if (white_chips.length >= 5){

      var red_chip_count = Math.floor(white_chips.length / 5);
      var white_chip_remainder = Math.floor(white_chips.length % 5);
      var counter = 0;

      //create red chips for every five whites
      for (i = 0; i < red_chip_count; i++){
        var u = white_chips[counter];
        u.attr({fill: 'red'});
        counter++;
      }
      //turn the remainder white ones white
      //we may not need to do this, but it'll guarantee proper
      //stacking when we had them)
      for (i = 0; i < white_chip_remainder; i++){
        var u = white_chips[counter];
        u.attr({fill: 'white'});
        counter++;
      }
      //everything else gets hidden
      for (i = counter; i < white_chips.length; i++){
        var u = white_chips[counter];
        u.attr({'visibility': 'hidden'});
        counter++;
      }
    }
    //not clear to me why i need to do this, but for wahtever reason
    //this was getting hidden (even though it was never a white chip)
    locked_unit.attr({'visibility': 'initial'});
  }

  eaw.zonehoverinHandler = function(zone){
/*
    var timer = window.setTimeout(function () {
      zone.data('timerid', null);
      console.log('go');
      //pop-up the tool-tip window
      var mouseoverstr = '<title>';
      var title = Snap.parse('<title>This is <br/><b>a title 2</b></title>');
      zone.append(title);

    }, 500);
    zone.data('timerid', timer);*/
  }

  eaw.zonehoveroutHandler = function(zone){
    /*var timerid = zone.data('timerid');
    if (timerid != null) {
      //mouse out, didn't timeout. Kill previously started timer
      window.clearTimeout(timerid);
    }*/
  }

  eaw.networkDragHandler = function(data){
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
//    var f = eaw.paper.filter(Snap.filter.shadow(0, 2,'yellow', 3));
    //var f = eaw.paper.filter('');
    console.log('filter created');
    local_unit.el.attr({stroke: 'red'});
    console.log('shadow added');

    eaw.unitMousedownHandler(local_unit.el, event, true);
  }


  //handles drop events from other players
  eaw.networkDropHandler = function(data){
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

  eaw.loadDice = function (){
      console.log('loading dice');

              $.getScript( "dice/dice.js", function(){
                $.getScript( "dice/main.js", function(){
                    dice_initialize(document.body, window.innerWidth - 1, window.innerHeight - 1);
                    console.log('Loaded dice elements.');
                });
              });
    }


    eaw.createUnit = function (type, params){
      console.log('Creating unit');
      var new_unit = '';
      switch (type){
        case 'fighter':
          new_unit = new eaw.Fighter(params);
          break;
        case 'armor':
          new_unit = new eaw.Armor(params);
          break;
        case 'infantry':
          new_unit = new eaw.Infantry(params);
          break;
        case 'carrier':
          new_unit = new eaw.Carrier(params);
          break;
        case 'artillery':
          new_unit = new eaw.Artillery(params);
          break;
        case 'sub':
          new_unit = new eaw.Submarine(params);
          break;
        case 'bomber':
          new_unit = new eaw.Bomber(params);
          break;
        case 'cruiser':
          new_unit = new eaw.Cruiser(params);
          break;
        case 'transport':
          new_unit = new eaw.Transport(params);
          break;
        case 'battleship':
          new_unit = new eaw.Battleship(params);
          break;
      }
      console.log('returning unit');
      eaw.game.GAME_PIECES[eaw.game.GAME_PIECES.length] = new_unit;
      return new_unit;
    }
