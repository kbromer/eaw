  //set a namespace to drop funcs into as needed
  eaw = {}

  eaw.unitMouseupHandler = function (unit, event){
    //use the upper left corner of the element
    var b = unit.getBBox();
    var unit_type = unit.data("Unit").unit_type;


    unit.paper.zone_set.forEach(function (el) {
        el.attr({stroke:'black'});
    });


  /* FIGURING OUT BEST DROP POINT TO USE
    console.log('BX: ' + b.x);
    console.log('BY: ' + b.y);
    console.log('event.x: ' + event.pageX);
    var py = event.pageY;
    py = py - 125;
    console.log('event.y: ' + py);*/


    //CREATE GROUPS IN EACH ZONE
    //ENTIRE GROUP GETS SAME TRANSFORMATION APPLIED
    //EACH GROUP GETS AN ELEMENT ADDED AFTER UNIT THAT HAS NUMBER OF UNIT IN GROUP



    /*** Figure out what zone we've been dropped into
         and assign unit to the appropriate array [country][type]  ***/

    for (var i = 0; i < unit.paper.zone_set.length; i++){
      var zone_element = unit.paper.zone_set[i];

      if (Snap.path.isPointInside(zone_element.attr('path'), b.x, b.y)){

        zone_element.attr({stroke: 'red'});

        var unit_id = unit.data("Unit").id;

        var country = unit.data("Unit").unit_owner;

        //set the units location to the zone it was dropped on
        unit.data("Unit").location_zone = zone_element.data("Zone");
        var set_name = country + '_unit_set';
        console.log(country + ' ' + unit_type + ' ' + unit_id + ' landed in ' + zone_element.data("Zone").name);

        var t = unit.paper.text(b.x, b.y, country + ' ' + unit_type + ' added to ' + zone_element.data("Zone").name).animate({ opacity : 0 }, 2000, function () { this.remove() });;

        //build the zone arrays to stack armies
        if (zone_element.data("Zone")[set_name] === undefined){
          zone_element.data("Zone")[set_name] = {};
        }
        //create an empty array for this unit type if required
        if (zone_element.data("Zone")[set_name][unit_type] === undefined){
            zone_element.data("Zone")[set_name][unit_type] = {};
        }

        zone_element.data("Zone")[set_name][unit_type][unit_id] = unit;
        var unit_set = zone_element.data("Zone")[set_name][unit_type];

        var prop_count = 0;

        for(var x in unit_set) {
          prop_count++;
        }

        if (prop_count > 1){
          eaw.redrawChipStack(b.x, b.y + 15, unit_set, unit);
        }
      //break on the first matching path we find
      break;
      }
    }

      //push aside any elements that are in the drop zone - this needs to be narrowed
      /* TO DO:
            1.  Trim the boundary of the bounding box to make the overlap less sensitive
            2.  Only look at the zone the units landed on evaluate collisions
            3.  Move in a smarter direction then the current 'random'
            4.  Don't let other moved units overlap
            */

      //each element in play on the board
      for (var i = 0; i < unit.data("Unit").game.GAME_PIECES.length; i++){

        var game_piece = unit.data("Unit").game.GAME_PIECES[i];

        //if there's an element and its not the same id as the unit
        //being dropped and its not of an identical type
        if (game_piece && game_piece.id != unit.data("Unit").id && unit_type != game_piece.unit_type){
          var bx1 = unit.getBBox();
          var bx2 = game_piece.el.getBBox();

          //while the bounding boxes intersect, the unit has been
          //dropped on top of another gamepiece and the existing
          //game piece should be moved out from underneath it

          var xmove = Math.random() * Math.random() < 0.5 ? -1 : 1;
          var ymove = Math.random() * Math.random() < 0.5 ? -1 : 1;

          while (Snap.path.isBBoxIntersect(bx1, bx2)){
            var ex = bx2.x;
            var ey = bx2.y;
            ex = ex + xmove;
            ey = ey + ymove;
            bx2.x = ex;
            bx2.y = ey;
            var tstring = "T" + ex + 10 + "," + ey + 10;
            game_piece.el = game_piece.el.animate({transform: tstring}, 2500, mina.backout);
          }
        }
      }
  }//end unitMouseupHandler

  eaw.unitMousedownHandler = function (unit, event){
    //pull it out of the existing unit_set

    var country = unit.data("Unit").unit_owner;
    var zone = unit.data("Unit").location_zone;
    var unit_type = unit.data("Unit").unit_type;
    var set_name = country + '_unit_set';

    console.log('Removing ' + unit.data("Unit").id + ' ' + unit_type + ' from ' + zone.name);

    var the_unit = zone[set_name][unit_type][unit.data("Unit").id];
    delete zone[set_name][unit_type][unit.data("Unit").id];

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

    console.log('Units left ' + prop_count);
    if (prop_count > 0){
      console.log('redrawing a new unit...');
      //find the remaining unit, restyle from chip back to a board piece
      var leftover_unit = unit_set[remaining_unit];
      var unit_obj = leftover_unit.data("Unit");
      var original_path = unit_obj.pathstring;
      leftover_unit.node.setAttribute("d", original_path);
      console.log(the_unit);
      //leftover_unit.transform('t' + the_unit.x + ',' + the_unit.y);
      leftover_unit.attr({'display': 'initial', fill: unit_obj.country_gradient});
      leftover_unit.drag(unit_obj.move, unit_obj.start, unit_obj.stop);
      console.log('leftover_unit '  + leftover_unit.data("Unit").id);
      var b = leftover_unit.getBBox();
      eaw.redrawChipStack(b.x, b.y + 15, unit_set, leftover_unit);

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
        console.log(locked_unit.data("Unit").id + ' v ' + unit_id);
      if (unit_id !== locked_unit.data("Unit").id){
        console.log('Not equal');
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
        console.log('Making a red chip out of ' + u.data("Unit").id);
        counter++;
      }
      //turn the remainder white ones white
      //we may not need to do this, but it'll guarantee proper
      //stacking when we had them)
      for (i = 0; i < white_chip_remainder; i++){
        var u = white_chips[counter];
        u.attr({fill: 'white'});
        console.log('Making a white chip out of ' + u.data("Unit").id);
        counter++;
      }
      //everything else gets hidden
      for (i = counter; i < white_chips.length; i++){
        var u = white_chips[counter];
        console.log('Hiding ' + u.data("Unit").id);
        u.attr({'visibility': 'hidden'});
        counter++;
      }

    }
    //not clear to me why i need to do this, but for wahtever reason
    //this was getting hidden (even though it was never a white chip)
    locked_unit.attr({'visibility': 'initial'});
  }



  eaw.zonehoverinHandler = function(zone){

    var timer = window.setTimeout(function () {
      zone.data('timerid', null);
      console.log('go');
      //pop-up the tool-tip window
      var title = Snap.parse('<title>This is <br/><b>a title 2</b></title>');
      zone.append(title);

    }, 500);
    zone.data('timerid', timer);
  }

  eaw.zonehoveroutHandler = function(zone){
    var timerid = zone.data('timerid');
    if (timerid != null) {
      //mouse out, didn't timeout. Kill previously started timer
      window.clearTimeout(timerid);
    }
  }






  /*
  //    var last_count = prop_count + 1;
  //    var second_path_start = original_path.toLowerCase().indexOf('m', 1);
      //trim the end of hte path
  //    original_path = original_path.substr(0, second_path_start);
  //    original_path = original_path + ' ' + getNumberPath(prop_count.toString());

    //also clear the number of the selected unit
    var the_unit_path = unit.node.getAttribute("d");
    var number_path_start = the_unit_path.toLowerCase().indexOf('m', 1);
    //if there's a m after 1st (a number drawn)
    if (number_path_start > 5){
      the_unit_path = the_unit_path.substr(0, number_path_start);
      unit.node.setAttribute("d", the_unit_path);
    }
  function getNumberPath(number_for_path){
    var number_path = '';
    switch (number_for_path){
      case '2':
        number_path = 'M14.12,38.00 C 14.12,38.00 7.88,38.12 7.88,38.12 7.88,38.12 11.88,36.25 11.88,36.25 11.88,36.25 13.88,33.75 13.88,33.75 13.88,33.75 14.00,31.50 14.00,31.25 14.00,31.00 11.88,29.62 11.75,29.50 11.62,29.38 8.50,28.25 8.50,28.25 8.50,28.25 5.62,28.38 5.62,28.38 5.62,28.38 2.62,29.25 2.62,29.25 2.62,29.25 2.62,31.12 2.62,31.12 2.62,31.12 5.88,30.00 5.88,30.00 5.88,30.00 8.38,30.00 8.38,30.00 8.38,30.00 10.62,30.88 10.62,30.88 10.62,30.88 11.25,33.62 11.25,33.50 11.25,33.38 8.25,36.00 8.25,36.00 8.25,36.00 6.38,37.25 6.38,37.25 6.38,37.25 2.75,39.88 2.75,39.88 2.75,39.88 5.75,40.00 5.75,40.00 5.75,40.00 9.75,40.00 10.12,40.00 10.50,40.00 14.00,40.25 14.12,40.25 14.25,40.25 14.00,37.88 14.00,37.88';
      break;
      case '3':
        number_path = 'M2.25,38.88 C 2.25,38.88 2.12,41.50 2.12,41.50 2.12,41.50 5.62,41.75 5.62,41.75 5.62,41.75 12.25,41.88 12.25,41.88 12.25,41.88 14.00,40.62 14.00,40.62 14.00,40.62 14.38,37.25 14.38,37.25 14.38,37.25 14.38,34.38 14.38,34.38 14.38,34.38 14.50,32.12 14.50,32.12 14.50,32.12 13.88,30.00 13.88,29.88 13.88,29.75 12.38,28.38 12.38,28.38 12.38,28.38 10.00,26.88 10.00,26.88 10.00,26.88 8.25,26.62 8.25,26.62 8.25,26.62 5.88,26.38 5.88,26.38 5.88,26.38 2.38,27.00 2.38,27.00 2.38,27.00 2.62,29.50 2.62,29.50 2.62,29.50 6.12,28.12 6.12,28.12 6.12,28.12 9.25,28.50 9.25,28.50 9.25,28.50 11.62,30.12 11.62,30.12 11.62,30.12 12.38,33.38 12.38,33.38 12.38,33.38 10.88,34.38 10.88,34.38 10.88,34.38 8.38,35.00 8.00,35.00 7.62,35.00 4.75,35.00 4.75,35.00 4.75,35.00 10.75,35.00 10.75,35.00 10.75,35.00 12.12,36.25 12.12,36.38 12.12,36.50 12.38,38.38 12.38,38.38 12.38,38.38 11.12,40.38 11.12,40.38 11.12,40.38 7.25,40.12 7.00,40.25 6.75,40.38 4.00,40.38 4.00,40.38 4.00,40.38 2.00,38.75 2.00,38.75';
      break;
      case '4':
        number_path = 'M13,30.38 C 13.00,30.38 4.62,30.25 4.62,30.25 4.62,30.25 4.75,23.25 4.75,23.25 4.75,23.25 3.38,23.25 3.38,23.25 3.38,23.25 3.38,31.62 3.38,31.62 3.38,31.62 13.12,31.88 13.12,31.88 13.12,31.88 13.12,23.75 13.12,23.75 13.12,23.75 13.25,40.25 13.25,40.25 13.25,40.25 14.75,40.12 14.75,40.12 14.75,40.12 14.62,23.75 14.62,23.62 14.62,23.50 13.00,23.75 13.00,23.75';
      break;
      case '5':
        number_path = 'M2.75,39.00 C 2.75,39.00 2.75,40.25 2.75,40.25 2.75,40.25 7.62,40.25 7.75,40.25 7.88,40.25 11.25,40.25 11.25,40.25 11.25,40.25 13.50,39.75 13.50,39.75 13.50,39.75 14.25,37.88 14.25,37.75 14.25,37.62 14.88,36.38 14.88,36.38 14.88,36.38 15.25,33.75 15.25,33.75 15.25,33.75 15.00,31.50 15.00,31.38 15.00,31.25 14.00,29.38 13.88,29.25 13.75,29.12 12.50,27.75 12.50,27.75 12.50,27.75 4.00,27.25 4.00,27.25 4.00,27.25 4.12,24.62 4.12,24.62 4.12,24.62 13.00,24.62 13.00,24.62 13.00,24.62 12.88,23.12 12.88,23.12 12.88,23.12 2.75,23.12 2.75,23.12 2.75,23.12 2.75,28.62 2.75,28.62 2.75,28.62 12.12,29.12 12.12,29.12 12.12,29.12 13.50,31.88 13.50,31.88 13.50,31.88 13.75,35.50 13.75,35.50 13.75,35.50 13.38,37.50 13.38,37.50 13.38,37.50 11.75,38.75 11.75,38.75 11.75,38.75 10.38,38.88 10.38,38.88 10.38,38.88 2.88,38.88 2.88,38.88';
      break;
      case '6':
        number_path = 'M14.88,24.50 C 14.88,24.50 7.88,24.50 7.88,24.50 7.88,24.50 4.62,26.38 4.62,26.38 4.62,26.38 3.62,30.50 3.62,30.50 3.62,30.50 3.88,33.75 4.00,34.25 4.12,34.75 5.25,37.00 5.25,37.00 5.25,37.00 7.12,38.00 7.12,38.00 7.12,38.00 9.62,38.88 10.38,38.75 11.12,38.62 14.12,38.25 14.12,38.25 14.12,38.25 16.00,34.88 16.00,34.75 16.00,34.62 14.00,31.62 14.00,31.62 14.00,31.62 11.38,31.25 11.38,31.25 11.38,31.25 8.75,31.38 8.62,31.38 8.50,31.38 6.50,32.12 6.50,32.12 6.50,32.12 7.50,33.50 7.50,33.50 7.50,33.50 9.88,33.12 9.88,33.12 9.88,33.12 11.38,32.75 11.50,32.75 11.62,32.75 12.75,33.38 12.88,33.38 13.00,33.38 13.62,34.50 13.62,34.50 13.62,34.50 12.25,36.25 12.25,36.25 12.25,36.25 10.62,37.12 10.50,37.12 10.38,37.12 7.25,36.00 7.25,36.00 7.25,36.00 5.88,34.62 5.88,34.62 5.88,34.62 5.12,32.00 5.12,32.00 5.12,32.00 5.62,29.75 5.62,29.75 5.62,29.75 6.38,28.38 6.50,28.25 6.62,28.12 7.12,27.00 7.25,27.00 7.38,27.00 9.12,26.38 9.25,26.38 9.38,26.38 12.62,26.50 12.75,26.50 12.88,26.50 14.62,26.50 14.62,26.50 14.62,26.50 14.62,24.50 14.75,24.50';
      break;
      case '7':
        number_path = 'M4.50,40.75 C 4.50,40.75 2.50,40.75 2.50,40.75 2.50,40.75 12.25,26.88 12.25,26.88 12.25,26.88 2.62,26.88 2.62,26.88 2.62,26.88 2.38,25.12 2.50,25.12 2.62,25.12 15.25,25.38 15.25,25.38 15.25,25.38 4.38,40.75 4.38,40.75';
      break;
      case '8':
        number_path = 'M9.50,29.50 C 9.50,29.50 12.00,30.75 12.00,30.75 12.00,30.75 13.38,29.25 13.38,29.25 13.38,29.25 14.38,27.50 14.38,27.50 14.38,27.50 14.38,25.38 14.38,25.25 14.38,25.12 14.12,23.75 14.12,23.75 14.12,23.75 11.25,23.38 11.12,23.38 11.00,23.38 8.75,23.75 8.75,23.75 8.75,23.75 6.75,24.38 6.75,24.38 6.75,24.38 6.50,26.25 6.50,26.25 6.50,26.25 6.88,28.50 6.88,28.50 6.88,28.50 9.38,29.50 9.38,29.50 9.38,29.50 8.38,31.25 8.38,31.25 8.38,31.25 6.38,30.88 6.25,30.75 6.12,30.62 4.75,28.75 4.75,28.75 4.75,28.75 4.62,25.88 4.62,25.88 4.62,25.88 4.75,24.38 4.88,24.25 5.00,24.12 7.75,22.12 7.75,22.12 7.75,22.12 9.88,22.00 10.12,21.88 10.38,21.75 13.88,21.75 13.88,21.75 13.88,21.75 15.00,22.00 15.25,22.12 15.50,22.25 16.12,23.25 16.25,23.38 16.38,23.50 16.25,24.75 16.38,25.00 16.50,25.25 16.50,26.50 16.50,26.50 16.50,26.50 16.38,28.12 16.38,28.12 16.38,28.12 14.12,30.50 14.12,30.50 14.12,30.50 12.62,32.00 12.38,32.12 12.12,32.25 10.38,31.88 10.38,31.88 10.38,31.88 8.25,33.12 8.25,33.12 8.25,33.12 6.25,34.88 6.12,35.00 6.00,35.12 5.50,36.12 5.50,36.12 5.50,36.12 5.25,37.38 5.25,37.38 5.25,37.38 5.25,38.50 5.38,38.50 5.50,38.50 6.88,40.00 6.88,40.00 6.88,40.00 8.62,40.38 8.75,40.50 8.88,40.62 12.88,40.88 13.00,40.88 13.12,40.88 16.88,39.12 16.88,39.12 16.88,39.12 17.62,36.62 17.62,36.50 17.62,36.38 15.50,32.88 15.50,32.88 15.50,32.88 12.50,32.00 12.50,32.00M 10.62,33.75 C 10.62,33.75 8.75,35.00 8.75,35.12 8.75,35.25 7.88,36.38 7.88,36.38 7.88,36.38 8.00,37.50 8.12,37.62 8.25,37.75 9.25,38.38 9.38,38.38 9.50,38.38 11.00,38.62 11.00,38.62 11.00,38.62 12.75,38.75 12.75,38.75 12.75,38.75 13.62,38.25 13.75,38.25 13.88,38.25 15.12,37.88 15.12,37.75 15.12,37.62 15.38,36.75 15.38,36.62 15.38,36.50 15.12,35.50 15.12,35.38 14.88,34.50 14.25,33.88 14.25,33.88 14.25,33.88 10.75,33.75 10.75,33.75';
      break;
      case '9':
        number_path = 'M14.38,22.25 C 14.38,22.25 9.12,22.00 9.12,22.00 9.12,22.00 6.12,24.25 6.12,24.25 6.12,24.25 5.38,27.12 5.38,27.38 5.38,27.62 5.38,30.50 5.38,30.50 5.38,30.50 7.62,31.12 8.75,31.25 12.50,30.38 12.50,30.50 12.50,30.38 12.50,30.25 15.50,29.38 15.75,29.38 16.00,29.38 16.00,23.88 16.00,23.88 16.00,23.88 16.12,40.62 16.12,40.62 16.12,40.62 17.88,40.50 17.88,40.50 17.88,40.50 17.38,20.88 17.38,20.88 17.38,20.88 11.38,20.62 11.38,20.62 11.38,20.62 6.00,21.25 6.00,21.25 6.00,21.25 4.50,23.38 4.50,23.38 4.50,23.38 3.75,27.12 3.88,27.12 4.00,27.12 3.88,29.88 3.88,29.88 3.88,29.88 5.38,32.38 5.62,32.38 5.88,32.38 7.62,32.75 7.62,32.75 7.62,32.75 10.50,32.88 10.50,32.88 10.50,32.88 14.12,31.88 14.12,31.88 14.12,31.88 16.12,31.00 16.12,31.00';
      break;
      case '10':
        number_path = 'M8.50,40.25 C 8.38,40.25 8.25,38.12 8.25,38.12 8.25,38.12 6.62,38.38 6.62,38.38 6.62,38.38 6.88,24.38 6.88,24.38 6.88,24.38 5.38,22.25 5.38,22.25 5.38,22.25 3.88,22.75 3.88,22.75 3.88,22.75 1.88,26.00 1.88,26.00 1.88,26.00 2.75,27.00 2.75,27.00 2.75,27.00 5.12,23.88 5.12,23.88 5.12,23.88 5.12,40.00 5.12,40.00 5.12,40.00 1.62,40.00 1.62,40.00 1.62,40.00 8.12,40.12 8.12,40.12M 13.00,40.25 C 13.00,40.25 10.75,36.25 10.75,36.25 10.75,36.25 9.62,32.50 9.62,32.38 9.62,32.25 10.12,28.12 10.12,28.12 10.12,28.12 12.12,24.88 12.12,24.88 12.12,24.88 15.12,24.12 15.25,24.12 15.38,24.12 17.38,24.88 17.62,24.88 17.88,24.88 20.25,28.25 20.38,28.62 20.50,29.00 20.50,34.75 20.62,34.88 20.75,35.00 19.75,37.38 19.50,37.75 19.25,38.12 17.00,40.50 16.62,40.50 16.25,40.50 13.25,40.25 13.25,40.25 13.25,40.25 14.75,37.50 14.75,37.50 14.75,37.50 13.00,35.12 13.00,35.12 13.00,35.12 11.75,32.38 11.75,32.38 11.75,32.38 11.38,29.50 11.38,29.50 11.38,29.50 11.62,27.75 11.88,27.62 12.12,27.50 14.62,26.50 14.62,26.50 14.62,26.50 17.50,27.12 17.50,27.12 17.50,27.12 19.12,28.50 19.12,28.62 19.12,28.75 19.00,32.12 19.12,32.50 19.25,32.88 18.75,36.00 18.75,36.12 18.75,36.25 15.12,37.75 15.12,37.75M 1.62,38.12 C 1.62,38.12 5.12,38.12 5.12,38.12';
      break;
    }
    return number_path;
  }*/
