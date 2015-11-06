eaw.ui = {};

eaw.ui.setupBoard = function(){
  //hide the default hidden items on the screen
  //before loading game engine so it doesn't appear broken
  $(".default_hide").hide();

  //add behaviors to top menu bar
  $("[id$='nav_option']").on('click', function() {
    //deactive all selected menu items
    $("[id$='nav_option']").parent().removeClass('active');
    //check the clicked one
    $(this).parent().addClass('active');

    var bar = this.text;

    if ($('.subnav').is(':visible')){
      console.log('vis');
      $('.subnav:visible').hide(eaw.ui.showMenuItem(bar));
    }
    else{
        eaw.ui.showMenuItem(bar);
    }
  });

  $("[id='SaveBTN']").on('click', function(){eaw.game.save();});
  $("[id='LoadBTN']").on('click', function(){eaw.loadGame(eaw.savegame);});//<---temporary hack
  $("[id='LoadDefaultBTN']").on('click', function(){eaw.loadGame('default_new_game');});//<---temporary hack
  $("[id='SaveDefaultBTN']").on('click', function(){eaw.game.saveDefault();});

  //setup behavior of the menu modal closing
  //bind the hide handler to deselect the item
  $('#menu_modal').on('hidden.bs.modal', function (e) {
      $("[id$='nav_option']").parent().removeClass('active');
  });
};


eaw.ui.getSvgCoordinates = function (event, paper) {

  var x, y;

  x = event.pageX;
  y = event.pageY;

//	p.x = x;
//	p.y = y;
//	p = p.matrixTransform(m.inverse());

  x = x - 25;
  y = y - 25;

  x = parseFloat(x.toFixed(3));
  y = parseFloat(y.toFixed(3));

  return {x: x, y: y};
};

eaw.ui.showMenuItem = function (selectedItem){

  switch (selectedItem){
    case 'Units':
      $('.units_subnav').show();//.show('slide', {direction: 'down'}, 1000);
    break;
    case 'Tech':
      $('#tech_modal').modal('show');
    break;
    case 'Cards':
    break;
    case 'Diplomacy':
    break;
    case 'Menu':
      $('#menu_modal').modal('show');
    break;
    case 'IPCs':
      eaw.ui.displayIPCMarkers();
      $('#ipc_modal').modal('show');//.show('slide', {direction: 'down'}, 1000);
    break;
    case 'Dice':
      eaw.loadDice();
    break;

  }
};
eaw.ui.switchNation = function (nation){
  console.log('Switching nation to ' + nation.name);
  $("img[class^='unit_'], img[class^='icon_']").each(function( index ) {
    var old_src = $(this).attr("src");
    var image_type = old_src.substring(old_src.length - 3, old_src.length);
    var new_src = old_src.substring(0, old_src.length - 6) + nation.id + "." + image_type;
    $( this ).attr("src", new_src);
    var old_id = $(this).attr("id");
    var new_id = old_id.substring(0, old_id.length - 2) + nation.id;
    $( this ).attr("id", new_id);
  });

  switch (nation.id){
    case "de":
    $(".subnav").css("background", "linear-gradient(to right, gray, transparent, gray)");
    break;
    case "uk":
    $(".subnav").css("background", "linear-gradient(to right, tan, transparent, tan)");
    break;
    case "ru":
    $(".subnav").css("background", "linear-gradient(to right, crimson, transparent, crimson)");
    break;
    case "fr":
    $(".subnav").css("background", "linear-gradient(to right, blue, transparent, blue)");
    break;
    case "it":
    $(".subnav").css("background", "linear-gradient(to right, yellow, transparent, yellow)");
    break;
    case "us":
    $(".subnav").css("background", "linear-gradient(to right, green, transparent, green)");
    break;
  }
};

eaw.ui.displayIPCMarkers = function (){

  var ipcObj = eaw.nations.getIPCs();
  console.log(ipcObj);
  var marker_placements = [];

  function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && !isNaN(obj[prop])) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return a.value - b.value; });
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    return arr; // returns array
  }

  var arr = sortObject(ipcObj);
  console.log(arr);

  for (var i = 0; i < arr.length; i++){
    console.log(arr[i].key + ' ' + arr[i].value);

    var display_perc = arr[i].value;
    for (var j = 0; j < marker_placements.length; j++){
      if (Math.abs(marker_placements[j] - arr[i].value) < 7){
          console.log("moving");
          display_perc = arr[i].value + 8;
      }
    }
    marker_placements.push(display_perc);
    $("[id^='marker_logo_" + arr[i].key + "']").css( "left", display_perc + '%' );
    var spanid = 'disipc_' + arr[i].key;

    $('#' + spanid).text(arr[i].value);
  }

/*  $("[id^='marker_logo']").each(function( index, element ) {
    var country_id = element.id.slice(-2);
    var display_ipcs = ipcObj[country_id];

    //var perc = (display_ipcs/100) * 100;
    var perc = display_ipcs;
    for (var i = 0; i < marker_placements.length; i++){
      if (Math.abs(marker_placements[i] - perc) < 10){
          console.log("moving");
          perc = perc + 15;
      }
    }
    marker_placements.push(perc);
    console.log(perc);
    this.style.left = perc + '%';
    var spanid = 'disipc_' + country_id;

    $('#' + spanid).text(display_ipcs);

    /*
    for (i=0; i < eaw.game.PLAYABLE_NATIONS.length; i++){
      if (eaw.game.PLAYABLE_NATIONS[i].id === country_id){
        display_ipcs = eaw.game.PLAYABLE_NATIONS[i].getIPCs();
        console.log("IPCS: " + display_ipcs);
      }
    }*/

    //now display the IPCs and move the marker an appropriate distance along the bar




  //}); */






};
