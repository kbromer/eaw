  eaw.setupBoard = function(){
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
        $('.subnav:visible').hide(eaw.showMenuItem(bar));
      }
      else{
          eaw.showMenuItem(bar);
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


  eaw.getSvgCoordinates = function (event, paper) {

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

  eaw.showMenuItem = function (selectedItem){

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
        $('.ipcs_subnav').show();//.show('slide', {direction: 'down'}, 1000);
      break;
      case 'Dice':
        eaw.loadDice();
      break;

    }
  }
