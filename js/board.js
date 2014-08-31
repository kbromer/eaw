function setupBoard(){
  //hide the default hidden items on teh screen
  //before loading game engine so it doesn't appear broken
  $(".default_hide").hide();

  //add behaviors to tap menu bar
  $("[id$='nav_option']").on('click', function() {
    //deactive all selected menu items
    $("[id$='nav_option']").parent().removeClass('active');
    //check the clicked one
    $(this).parent().addClass('active');

    var bar = this.text;

    if ($('.subnav').is(':visible')){
      console.log('vis');
      $('.subnav:visible').hide(showMenuItem(bar));
    }
    else{
        showMenuItem(bar);
    }
  });
}
