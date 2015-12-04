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
  var marker_placements = [];
  var arr = [];

  for (var prop in ipcObj) {
      if (ipcObj.hasOwnProperty(prop) && !isNaN(ipcObj[prop])) {
          arr.push({
              'key': prop,
              'value': ipcObj[prop]
          });
      }
  }
  arr.sort(function(a, b) { return a.value - b.value; });

  for (var i = 0; i < arr.length; i++){
    console.log(arr[i].key + ' ' + arr[i].value);

    var display_perc = arr[i].value;
    for (var j = 0; j < marker_placements.length; j++){
      if (Math.abs(marker_placements[j] - arr[i].value) < 10){
          console.log("moving");
          display_perc = arr[i].value + 20;
      }
    }
    marker_placements.push(display_perc);
    $("[id^='marker_logo_" + arr[i].key + "']").css( "left", display_perc + '%' );
    var spanid = 'disipc_' + arr[i].key;

    $('#' + spanid).text(arr[i].value);
  }
};
