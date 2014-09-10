//push aside any elements that are in the drop zone - this needs to be narrowed
/* TO DO:
      1.  Trim the boundary of the bounding box to make the overlap less sensitive
      2.  Only look at the zone the units landed on evaluate collisions
      3.  Move in a smarter direction then the current 'random'
      4.  Don't let other moved units overlap
      */
/*
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
}*/
