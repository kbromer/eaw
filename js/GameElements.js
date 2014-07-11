//Base level game element that encompasses all 'pieces' on the board
//includes chits, zones, units and dice
function GameElement(myPath, myPaper){
  this.pathstring = myPath;
  this.paper = myPaper;
}

GameElement.prototype = {
  constructor: GameElement,
  drawElement: function () {this.paper.path(this.pathstring).attr(
                                    {
                                        stroke: 'black',
                                        gradient: '90-#d3d3d3-#3f3f3f',
                                        'stroke-width': 2,
                                        'stroke-linejoin': 'round',
                                    }
                              )
                            }
};

//unit types of elements
function Unit(myPath, myPaper){
  this.el;
  this.unit_type;
  this.nation;
  GameElement.call(this, myPath, myPaper);
}
Unit.prototype = Object.create(GameElement);

//fighter types of units
function Fighter(myPath, myPaper){

  //provide a default element for fighters
  var ps;
  if (myPath == null){
    ps = "M47.713,25.019l5.316-7.519c1.437-2.031,2.559-4.755,2.506-6.084c-0.054-1.33-1.177-2.45-2.511-2.506 c-1.333-0.054-4.06,1.067-6.091,2.504l-7.52,5.318L18.417,6.702c-2.244-1.072-5.196-0.517-6.592,1.243 c-1.396,1.76-0.967,4.463,0.958,6.04l16.784,13.748L17.019,41.635l-5.919-1.787c-2.381-0.721-5.048-0.611-5.954,0.242 c-0.907,0.854-0.07,2.809,1.869,4.368l5.371,4.318c0,0-0.202,0.939-0.453,2.098c-0.25,1.158,0.484,1.89,1.641,1.634l2.094-0.465 l4.315,5.369c1.56,1.939,3.516,2.777,4.37,1.872c0.853-0.905,0.963-3.569,0.242-5.951l-1.788-5.921l13.9-12.548l13.75,16.785 c1.576,1.925,4.28,2.354,6.04,0.957c1.759-1.396,2.316-4.349,1.243-6.594L47.713,25.019z";
  }
  else{
    ps = myPath;
  }
  this.unit_type = 'Fighter';
  Unit.call(this, ps, myPaper);
}

Fighter.prototype = Object.create(Unit);

Fighter.prototype.drawElement = function (){this.el = this.paper.path(this.pathstring).attr(
                                  {
                                      stroke: 'black',
                                      gradient: '90-#d3d3d3-#3f3f3f',
                                      'stroke-width': 1,
                                      'stroke-linejoin': 'round',
                                      title: this.unit_type
                                  }
                            ).draggable.enable();

  //attach mouseup handler to the element when drawing
  this.el.mouseup(function(event) {
    event.preventDefault();
    unitMouseupHandler(this);
  });
  this.el.mousedown(function(event){
    event.preventDefault();
    unitMousedownHandler(this);
  });
}

//zone is an element on the page
function Zone(myPath, myPaper){
  //used for path tracking
  this.zonenumber = myPaper.zonecount;
  this.original_owner;

  //Raphael set objects for the collection of units
  this.ally_unit_set;
  this.russian_unit_set;
  this.axis_unit_set;
  GameElement.call(this, myPath, myPaper);
}
Zone.prototype = Object.create(GameElement);

//seazone is a type of zone
function SeaZone(myPath, myPaper){
  Zone.call(this, myPath, myPaper)
}
SeaZone.prototype = Object.create(Zone);

SeaZone.prototype.drawElement = function (){this.paper.path(this.pathstring).attr(
                                          {
                                            gradient: '90-#526c7a-#64a0c1',
                                            stroke: '#3b4449',
                                            'stroke-width': 2,
                                            'stroke-linejoin': 'round'
                                  }
                            );
                            this.paper.zonecount++;
                      };

//landzone is a type of zone
function LandZone(myPath, myPaper){
  Zone.call(this, myPath, myPaper)
}
LandZone.prototype = Object.create(Zone);

LandZone.prototype.drawElement = function (){this.paper.path(this.pathstring).attr(
                                          {
                                            gradient: '90-#526c7a-#64a0c1',
                                            stroke: '#3b4449',
                                            'stroke-width': 2,
                                            'stroke-linejoin': 'round'
                                  }
                            );
                      };

/* UTILITY METHODS */
function unitMouseupHandler(unit){
  //use the upper left corner of the element
  var b = unit.getBBox();

  var new_path = Raphael.transformPath(unit.attr('path'), 's.5');
  unit.attr({path: new_path});

  unit.paper.zone_set.forEach(function (el) {
      el.attr({stroke:'black'});
  });

  for (var i = 0; i < unit.paper.zone_set.length; i++){
    var zone_element = unit.paper.zone_set[i];
    if (Raphael.isPointInsidePath(zone_element.attr('path'), (b.x + (b.width/2)), (b.y + b.height/2))){
      zone_element.attr({stroke: 'red'});
    }
  }
}

function unitMousedownHandler(unit){
  var new_path = Raphael.transformPath(unit.attr('path'), 's2');
  unit.attr({path: new_path});
}
