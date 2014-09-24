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
  $("[id='LoadBTN']").on('click', function(){eaw.loadGame(eaw.savegame);});

  //setup behavior of the menu modal closing
  //bind the hide handler to deselect the item
  $('#menu_modal').on('hidden.bs.modal', function (e) {
      $("[id$='nav_option']").parent().removeClass('active');
  });
}


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
}

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
      $('.ipcs_subnav').show();//.show('slide', {direction: 'down'}, 1000);
    break;
    case 'Dice':
      eaw.loadDice();
    break;

  }
}

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
    $(".subnav").css("background", "linear-gradient(to right, transparent, gray, transparent)");
    break;
    case "uk":
    $(".subnav").css("background", "linear-gradient(to right, transparent, tan, transparent)");
    break;
    case "ru":
    $(".subnav").css("background", "linear-gradient(to right, transparent, crimson, transparent)");
    break;
    case "fr":
    $(".subnav").css("background", "linear-gradient(to right, transparent, blue, transparent)");
    break;
    case "it":
    $(".subnav").css("background", "linear-gradient(to right, transparent, yellow, transparent)");
    break;
    case "us":
    $(".subnav").css("background", "linear-gradient(to right, transparent, green, transparent)");
    break;
  }
}

eaw.ui.displayIPCMarkers = function (){

  $("[id^='marker_logo']").each(function( index, element ) {
    var country_id = element.id.slice(-2);
    console.log(element.id);
    var display_ipcs = 0;
    for (i=0; i < eaw.game.NATIONS.length; i++){
      if (eaw.game.NATIONS[i].id === country_id){
        display_ipcs = eaw.game.NATIONS[i].getIPCs();
        console.log("IPCS: " + display_ipcs);
      }

    }



  });



}
