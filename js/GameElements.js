//Base level game element that encompasses all 'pieces' on the board
//includes chits, zones, units and dice
function GameElement(myPath, myPaper) {
  this.pathstring = myPath;
  this.paper = myPaper;
  this.el;
}

GameElement.prototype = {
  constructor: GameElement,
  drawElement: function () {
                this.paper.path(this.pathstring).attr(
                                    {
                                        stroke: 'black',
                                        gradient: '90-#d3d3d3-#3f3f3f',
                                        'stroke-width': 2,
                                        'stroke-linejoin': 'round'
                                    }
                              );
                            }
};

//unit types of elements
function Unit(myPath, myPaper, myOwner){
  this.unit_type = '';
  this.unit_owner = myOwner;
  GameElement.call(this, myPath, myPaper);
}
Unit.prototype = Object.create(GameElement.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.drawElement = function (){
  this.el = this.paper.path(this.pathstring).attr(
                                  {
                                      stroke: 'black',
                                      gradient: '90-#d3d3d3-#3f3f3f',
                                      'stroke-width': 1,
                                      'stroke-linejoin': 'round'
                                  }
                            ).draggable.enable();

  //attach mouseup handler to the element when drawing
  this.el.mouseup(function(event) {
    event.preventDefault();
    unitMouseupHandler(this);
  });
  this.el.mousedown(function(event) {
    event.preventDefault();
    unitMousedownHandler(this);
  });
};

function Armor(myPath, myPaper, myOwner) {
  var ps;
  if (myPath === null){
    ps = " M 64.93 47.96 C 68.37 46.93 72.20 46.54 74.85 43.85 C 77.57 43.52 80.33 43.83 83.06 43.85 C 83.41 44.23 84.10 44.99 84.45 45.37 C 88.46 45.71 93.39 44.33 96.65 47.32 C 98.51 50.34 98.27 54.06 98.57 57.46 C 106.05 57.60 113.57 57.10 121.02 57.84 C 123.80 57.93 125.36 60.37 126.69 62.46 C 124.08 62.94 124.42 65.81 123.80 67.70 C 123.38 71.56 119.94 73.85 117.48 76.46 C 113.94 79.69 110.31 84.04 105.07 83.90 C 88.37 84.19 71.67 83.90 54.97 84.22 C 52.78 84.12 50.46 84.46 48.39 83.60 C 41.38 79.67 35.75 73.85 29.54 68.87 C 30.09 67.29 30.65 65.71 31.15 64.11 C 32.70 63.42 34.32 62.84 36.04 62.77 C 41.89 62.37 47.73 61.89 53.58 61.39 C 54.65 60.26 55.73 59.12 56.80 57.97 C 58.57 57.99 60.34 58.03 62.11 58.08 C 59.66 57.06 58.01 55.04 56.93 52.69 C 38.30 52.26 19.67 51.97 1.05 51.35 C 1.23 50.96 1.59 50.18 1.77 49.80 C 19.86 49.52 37.97 50.15 56.07 50.11 C 59.13 49.92 61.99 48.71 64.93 47.96 Z";
  }
  else{
    ps = myPath;
  }
  this.unit_type = 'Armor';

  Unit.call(this, ps, myPaper, myOwner);
}
Armor.prototype = Object.create(Unit.prototype);
Armor.prototype.constructor = Armor;

//fighter types of units
function Fighter(myPath, myPaper, myOwner){
  //provide a default element for fighters
  var ps;
  if (myPath === null){
    ps = "M47.713,25.019l5.316-7.519c1.437-2.031,2.559-4.755,2.506-6.084c-0.054-1.33-1.177-2.45-2.511-2.506 c-1.333-0.054-4.06,1.067-6.091,2.504l-7.52,5.318L18.417,6.702c-2.244-1.072-5.196-0.517-6.592,1.243 c-1.396,1.76-0.967,4.463,0.958,6.04l16.784,13.748L17.019,41.635l-5.919-1.787c-2.381-0.721-5.048-0.611-5.954,0.242 c-0.907,0.854-0.07,2.809,1.869,4.368l5.371,4.318c0,0-0.202,0.939-0.453,2.098c-0.25,1.158,0.484,1.89,1.641,1.634l2.094-0.465 l4.315,5.369c1.56,1.939,3.516,2.777,4.37,1.872c0.853-0.905,0.963-3.569,0.242-5.951l-1.788-5.921l13.9-12.548l13.75,16.785 c1.576,1.925,4.28,2.354,6.04,0.957c1.759-1.396,2.316-4.349,1.243-6.594L47.713,25.019z";
  }
  else{
    ps = myPath;
  }
  this.unit_type = 'Fighter';
  Unit.call(this, ps, myPaper, myOwner);
}
Fighter.prototype = Object.create(Unit.prototype)
Fighter.prototype.constructor = Fighter;

//zone is an element on the page
function Zone(myPath, myPaper, defaultOwner){
  //used for path tracking
  this.zonenumber = myPaper.zonecount;
  this.original_owner = defaultOwner;

  //Raphael set objects for the collection of units
  this.ally_unit_set = new myPaper.set();
  this.russian_unit_set = new myPaper.set();
  this.axis_unit_set = new myPaper.set();
  this.neutral_unit_set = new myPaper.set();
  GameElement.call(this, myPath, myPaper);
}

Zone.prototype = new GameElement();
Zone.prototype.constructor = Zone;

//seazone is a type of zone
function SeaZone(myPath, myPaper){
  Zone.call(this, myPath, myPaper);
}
SeaZone.prototype = Object.create(Zone.prototype);
SeaZone.prototype.constructor = SeaZone;

SeaZone.prototype.drawElement = function (){var this_el = this.paper.path(this.pathstring).attr(
                                          {
                                            gradient: '90-#526c7a-#64a0c1',
                                            stroke: '#3b4449',
                                            'stroke-width': 2,
                                            'stroke-linejoin': 'round'
                                  }
                            );
                            this_el.data("Zone", this);
                      };

//landzone is a type of zone
function LandZone(myPath, myPaper){
  Zone.call(this, myPath, myPaper);
}
LandZone.prototype = Object.create(Zone.prototype);
LandZone.prototype.constructor = LandZone;

LandZone.prototype.drawElement = function (){var this_el = this.paper.path(this.pathstring).attr(
                                          {
                                            gradient: '90-#526c7a-#64a0c1',
                                            stroke: '#3b4449',
                                            'stroke-width': 2,
                                            'stroke-linejoin': 'round'
                                  }
                            );
                            this_el.data("Zone", this);
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
      console.log('UNIT' + unit);
      console.log('UNIT OWNER: ' + unit.unit_owner);
      switch (unit.unit_owner){
        case 'German':
            zone_element.Zone.axis_unit_set.push(unit);
            alert(zone_element.Zone.axis_unit_set);
        break;
      }
    }
  }
}

function unitMousedownHandler(unit){
  var new_path = Raphael.transformPath(unit.attr('path'), 's2');
  unit.attr({path: new_path});
}
