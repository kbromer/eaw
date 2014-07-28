var element_count = 0;

//Base level game element that encompasses all 'pieces' on the board
//includes chits, zones, units and dice
function GameElement(myPath, myPaper) {
  this.pathstring = myPath;
  this.paper = myPaper;
  this.el;
  this.id = 'ge' + element_count;
  element_count++;
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

/************************ UNITS **********************************************************************/

//unit types of elements
function Unit(myPath, myPaper, myOwner){
  this.unit_owner = myOwner;
  this.location_zone = '';
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

  this.el.data("Unit", this);

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

//infantry types of units
function Infantry(myPath, myPaper, myOwner){
  //provide a default element for infantry
  var ps;
  if (myPath === null){
    ps = "m57.30912,-0.62521c-0.93879,0.00588 -1.78559,0.70491 -2.64795,2.15163c-0.59895,1.00482 -2.47592,3.156 -4.50695,5.16214c-1.91523,1.89176 -4.09769,4.10426 -4.84248,4.92308c-3.32336,3.65369 -6.30358,6.60215 -7.74435,7.65025c-2.2734,1.65381 -3.84934,3.22142 -4.42533,4.40952c-0.27817,0.57378 -0.75726,1.35009 -1.061,1.71776l-0.55316,0.66408l-0.60758,-1.00055c-0.3348,-0.55407 -1.13758,-1.33552 -1.78646,-1.73547c-0.64887,-0.39995 -1.18191,-0.82365 -1.18795,-0.93857c-0.00605,-0.11492 -0.59367,-0.6595 -1.30584,-1.20421l-1.29677,-0.98284l0,-2.16048c0,-1.74717 0.10959,-2.27684 0.58038,-2.80686c0.38121,-0.42918 0.58037,-1.05437 0.58037,-1.83287c0,-1.64378 -1.47166,-3.40299 -4.48882,-5.38351c-2.83591,-1.86154 -4.00429,-2.01054 -6.91006,-0.84117c-2.00045,0.80504 -2.79309,1.56266 -3.81776,3.66574c-0.84516,1.73465 -1.27355,5.80867 -0.77081,7.29607c0.34308,1.01503 2.02719,2.19591 3.12857,2.1959c0.49446,0 2.13915,1.95916 2.10385,2.50581c-0.04319,0.66908 -2.13343,2.39669 -3.45502,2.85113c-0.83066,0.28563 -1.7954,0.78742 -2.14012,1.11566c-0.34473,0.32824 -1.1154,0.99973 -1.71391,1.48755c-0.59851,0.48781 -1.0882,1.04302 -1.0882,1.23962c0,0.1966 -0.24569,0.66432 -0.5441,1.03597c-0.29841,0.37165 -0.64392,1.11921 -0.76174,1.66463c-0.11781,0.54544 -0.44514,1.37421 -0.73453,1.84173c-0.31005,0.50089 -0.65216,1.89746 -0.82521,3.4001c-0.16152,1.40255 -0.49353,3.02438 -0.7436,3.60376c-1.47019,3.40624 0.64133,7.42807 4.33466,8.24349c1.60319,0.35396 1.74349,0.44376 1.82273,1.21306c0.07205,0.69954 -0.04983,0.88202 -0.77987,1.15108c-0.99791,0.36779 -2.05692,1.88494 -2.05851,2.94853c-0.0006,0.39878 -0.19948,0.97255 -0.43528,1.27505c-0.345,0.44259 -0.38457,1.12995 -0.23578,3.52407c0.1017,1.6363 0.35493,3.38871 0.57131,3.89596c0.48421,1.13512 2.52198,2.62091 3.59105,2.62091c0.43532,0 0.90858,0.15938 1.061,0.35418c1.12056,1.43221 1.77754,14.68052 0.85242,17.21304c-0.30335,0.83043 -0.4688,2.23305 -0.47155,4.01108l0,2.72717l1.30584,1.54951c1.12146,1.33011 1.30584,1.73264 1.30584,2.83344c0,2.36533 -0.27674,2.98624 -1.82273,4.18817c-0.90929,0.70691 -1.75129,1.12448 -2.25801,1.1245c-1.27118,0 -1.70817,0.27829 -2.32149,1.45212c-0.59808,1.1447 -0.86025,1.26167 -3.27366,1.4787c-1.87105,0.16826 -3.0923,1.25536 -3.0923,2.75374c0,1.1297 0.37623,1.57983 1.65043,1.97455c0.44911,0.13913 1.73023,0.20084 2.84745,0.1328c1.96819,-0.1198 7.25148,-0.16875 21.76396,-0.19478c13.14561,-0.02356 23.60051,-0.40277 24.1852,-0.87659c0.51464,-0.41704 0.27629,-2.64334 -0.3446,-3.24959c-0.29289,-0.28598 -1.20663,-0.48521 -2.64795,-0.57555c-1.21165,-0.07593 -2.29021,-0.27751 -2.4031,-0.45155c-0.11289,-0.17409 -0.22737,-0.89255 -0.24485,-1.59381c-0.01747,-0.70128 -0.24667,-1.68718 -0.51689,-2.19591c-0.51769,-0.97458 -1.03761,-3.36522 -1.79552,-8.28778c-0.41312,-2.68309 -0.953,-4.26498 -2.32149,-6.80022c-1.59814,-2.96068 -2.16443,-4.36937 -2.43031,-5.99446c-0.16822,-1.02821 -0.51672,-2.35477 -0.7708,-2.94852c-0.28893,-0.67517 -0.51473,-2.30727 -0.60758,-4.35638c-0.10477,-2.31232 -0.30717,-3.60965 -0.68013,-4.40953c-1.42492,-3.05613 -1.47284,-3.24978 -1.04285,-4.49805c0.43707,-1.2688 0.20064,-3.48184 -0.55317,-5.13559c-0.65418,-1.43515 -0.77946,-2.12275 -0.8615,-4.64858c-0.04351,-1.33983 -0.15119,-3.96502 -0.23577,-5.83508c-0.08459,-1.87006 -0.08408,-3.68699 0,-4.03763c0.15449,-0.64427 1.06078,-0.87914 1.38745,-0.36303c0.32066,0.5066 2.61684,1.8687 4.02633,2.3907c1.17792,0.43624 1.59197,0.47277 2.51192,0.20365c1.48326,-0.43392 2.78955,-1.9338 3.02882,-3.4798c0.10445,-0.67492 0.39874,-2.13558 0.65292,-3.24073c0.44364,-1.92882 0.44031,-2.08496 -0.14509,-3.96679c-0.42553,-1.36794 -0.62952,-2.83495 -0.66198,-4.85224c-0.04266,-2.65064 0.02029,-2.99294 0.71639,-4.15274c0.41758,-0.69573 0.76174,-1.70065 0.76174,-2.23133c0,-0.53067 0.09093,-1.06278 0.20857,-1.17764c0.11764,-0.11486 0.36218,-1.07088 0.54411,-2.12507c0.40528,-2.3486 1.24543,-3.62284 5.53167,-8.42058c0.71539,-0.80076 1.51277,-1.75704 1.76832,-2.12507c0.25554,-0.36802 0.84681,-1.10633 1.3149,-1.63807c0.73064,-0.82995 0.82805,-1.14132 0.70733,-2.18705c-0.1245,-1.07849 -0.02297,-1.33403 0.84335,-2.28445c1.16306,-1.27595 1.23163,-1.96458 0.25392,-2.39956c-0.33691,-0.14989 -0.65739,-0.22332 -0.97032,-0.22136zm-31.69376,66.78911c0.16842,-0.02091 0.37063,0.64061 0.58944,1.98339c0.19621,1.2041 0.60294,2.58659 0.90683,3.07249c0.30389,0.48592 0.55317,1.11244 0.55317,1.39014c0,0.27773 0.31168,1.15321 0.69826,1.948c0.82176,1.68944 2.49379,6.74918 2.49379,7.55284c0,0.30453 0.26117,1.02998 0.58037,1.61151c0.31921,0.58151 0.58037,1.2608 0.58037,1.5141c0,0.2533 0.32646,0.93115 0.72547,1.50526c0.39901,0.5741 0.72546,1.14754 0.72546,1.26617c0,0.11865 0.32645,0.64072 0.72547,1.16879c0.399,0.52808 0.72546,1.18761 0.72546,1.46098c0,0.27338 0.31778,0.82921 0.70732,1.23962c0.38955,0.41042 1.32813,1.98201 2.08572,3.48866c1.28421,2.55396 1.37959,2.8894 1.39651,5.00278l0.01814,2.26671l-8.17962,0.07971c-5.97874,0.05499 -8.23561,-0.0157 -8.3882,-0.25679c-0.11479,-0.18135 -0.26685,-2.15567 -0.3446,-4.39178c-0.14028,-4.03474 -0.14297,-4.07419 0.61665,-5.14447c0.93256,-1.31393 0.97102,-2.31837 0.19044,-5.58714c-0.61404,-2.57132 -0.72185,-5.58768 -0.28112,-7.93359c0.14638,-0.77917 0.41349,-2.43675 0.58944,-3.68346c0.17596,-1.24669 0.65224,-3.3387 1.06099,-4.64857c0.40876,-1.30986 0.80106,-2.93196 0.87963,-3.61262c0.09737,-0.84356 0.2136,-1.27648 0.3446,-1.29274z";
  }
  else{
    ps = myPath;
  }
  this.unit_type = 'Infantry';
  Unit.call(this, ps, myPaper, myOwner);
}
Infantry.prototype = Object.create(Unit.prototype)
Infantry.prototype.constructor = Infantry;

//artillery types of units
function Artillery(myPath, myPaper, myOwner){
  //provide a default element for infantry
  var ps;
  if (myPath === null){
    ps = "M934.466,662.671l-176.444-71.768c-2.064-8.634-5.132-16.77-9.01-24.526c21.773-7.76,37.604-27.656,39.481-51.62 c46.739,0.719,83.029-24.403,99.359-52.652c2.941,0.938,6.132,1.845,9.449,1.845c16.392,0,29.721-13.265,29.721-29.659 c0-16.486-13.329-29.721-29.721-29.721c-0.126,0-0.313,0.064-0.439,0.064c-4.13-43.393-24.527-99.955-87.534-99.456l-677.942,5.132 c-2.314-15.112-11.699-26.779-23.964-27.812c-13.64-1.097-25.966,11.136-29.469,28.187h-0.563l-0.501,6.039c0,0.062,0,0.062,0,0.062 l-4.569,56.562l-6.693,82.718l0,0c-1.314,19.928,9.511,36.979,24.527,38.199c15.016,1.22,28.468-13.86,30.345-33.727l282,22.963 c-4.003,8.009-6.505,16.957-6.505,26.592c0,33.131,26.903,60.037,60.066,60.037h73.143c-6.819,15.142-10.887,31.973-10.887,49.681 c0,67.261,54.497,121.76,121.698,121.76c48.928,0,90.726-28.908,110.185-70.454l155.11,63.134 c19.646,8.071,42.297-1.439,50.307-21.212C963.688,693.266,954.115,670.742,934.466,662.671z M640.016,650.908 c-17.145,0-31.034-13.891-31.034-31.097c0-17.145,13.89-31.034,31.034-31.034c17.269,0,31.097,13.89,31.097,31.034 C671.112,637.018,657.284,650.908,640.016,650.908z";
    }
  else{
    ps = myPath;
  }
  this.unit_type = 'Artillery';
  Unit.call(this, ps, myPaper, myOwner);
}
Artillery.prototype = Object.create(Unit.prototype)
Artillery.prototype.constructor = Artillery;


function Carrier(myPath, myPaper, myOwner){
  //provide a default element for carrier
  var ps;
  if (myPath === null){
    ps = "m 8.939726,497.69417 c 0,-3.49054 -3.871975,-14.22642 -6.5588,-18.18568 L 0,476 l 16.421589,0 16.421589,0 -1.363714,-3.25 -1.363713,-3.25 -8.588013,-0.28893 c -7.76629,-0.26129 -8.588012,-0.47658 -8.588012,-2.25 0,-1.93078 1.166298,-1.96107 75.5,-1.96107 74.833334,0 75.500004,-0.0177 75.500004,-2 0,-1.73333 0.66667,-2 5,-2 4.66667,0 5,-0.16667 5,-2.5 0,-1.55556 -0.56667,-2.5 -1.5,-2.5 -1.08333,0 -1.5,-1.11111 -1.5,-4 0,-2.2 0.45,-4 1,-4 0.55,0 1,-0.9 1,-2 0,-1.87302 0.66667,-2 10.5,-2 l 10.5,0 0,-7 c 0,-6.33333 -0.19048,-7 -2,-7 -1.1,0 -2,-0.45 -2,-1 0,-0.55 0.9,-1 2,-1 1.46667,0 2,-0.66667 2,-2.5 0,-1.83333 -0.53333,-2.5 -2,-2.5 -1.1,0 -2,-0.45 -2,-1 0,-0.55 0.867,-1 1.92668,-1 1.05967,0 2.13247,-0.7875 2.38399,-1.75 0.43555,-1.66667 0.46285,-1.66667 0.57333,0 0.0693,1.04467 0.9221,1.75 2.116,1.75 1.1,0 2,0.45 2,1 0,0.55 -0.9,1 -2,1 -1.46667,0 -2,0.66667 -2,2.5 0,1.83333 0.53333,2.5 2,2.5 1.1,0 2,0.45 2,1 0,0.55 -0.9,1 -2,1 -1.80952,0 -2,0.66667 -2,7 l 0,7 3.95295,0 c 5.54459,0 8.20724,-1.48687 10.83311,-6.04943 2.04634,-3.55559 2.6706,-3.95057 6.2438,-3.95057 2.18358,0 3.97014,0.45 3.97014,1 0,0.55 1.125,1 2.5,1 1.375,0 2.5,-0.45 2.5,-1 0,-0.55 1.125,-1 2.5,-1 1.375,0 2.5,0.45 2.5,1 0,0.55 1.125,1 2.5,1 1.375,0 2.5,-0.45 2.5,-1 0,-0.55 1.575,-1 3.5,-1 3.48148,0 3.5,0.0238 3.5,4.5 0,3.29499 0.39411,4.5 1.47178,4.5 1.20937,0 1.52685,-2.45153 1.78065,-13.75 l 0.30888,-13.75 0.21934,13.75 c 0.20755,13.01022 0.32695,13.75 2.21935,13.75 2.45171,0 2.83321,4.46629 0.4593,5.37724 -1.24995,0.47965 -1.48584,2.15107 -1.25,8.85699 l 0.2907,8.26577 101,0.24297 c 55.55,0.13364 104.7125,0.24614 109.25,0.25 6.66354,0.006 8.25,0.29548 8.25,1.50703 0,1.2619 -2.22222,1.5 -14,1.5 -13.33333,0 -14,0.0952 -14,2 0,1.85315 0.66667,2 9.07946,2 l 9.07945,0 -0.70098,3.25 c -1.1153,5.17087 -4.20503,12.81608 -7.47659,18.5 l -3.0218,5.25 -217.97977,0 -217.979774,0 0,-2.30583 z";
    }
  else{
    ps = myPath;
  }
  this.unit_type = 'Carrier';
  Unit.call(this, ps, myPaper, myOwner);
}
Carrier.prototype = Object.create(Unit.prototype)
Carrier.prototype.constructor = Carrier;




/************************ ZONES **********************************************************************/

//zone is an element on the page
function Zone(myPath, myPaper){
  //used for path tracking
  //this.zonenumber = myPaper.zonecount;

  //Raphael set objects for the collection of units
  this.ally_unit_set = {};
  this.russian_unit_set = {};
  this.axis_unit_set = {};
  this.neutral_unit_set = {};
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
function LandZone(myPath, myPaper, defaultOwner){
  //set the zone owner to the
  this.original_owner = defaultOwner;
  this.current_owner = defaultOwner;


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


/************************ UTILITIES & HANDLERS **********************************************************************/

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
      /*console.log('UNIT' + unit);//el.data("Unit", this)
      console.log('UNIT OWNER: ' + unit.data("Unit").unit_owner);*/
      var country = unit.data("Unit").unit_owner;
      //set the units location to the zone it was dropped on
      unit.data("Unit").location_zone = zone_element.data("Zone");
      switch (country){
        case 'German':

            zone_element.data("Zone").axis_unit_set[unit.data("Unit").id] = unit;
            console.log(zone_element.data("Zone").axis_unit_set);
        break;
        case 'British':
            zone_element.data("Zone").ally_unit_set.push(unit);
        break;
        case 'French':
            zone_element.data("Zone").ally_unit_set.push(unit);
        break;
        case 'Italian':
            zone_element.data("Zone").axis_unit_set.push(unit);
        break;
        case 'American':
            zone_element.data("Zone").ally_unit_set.push(unit);
        break;
      }
    }
  }
}

function unitMousedownHandler(unit){
  //pull it out of the existing unti_set
  var country = unit.data("Unit").unit_owner;
  var zone = unit.data("Unit").location_zone;
  switch (country){
    case 'German':
        delete zone.axis_unit_set[unit.data("Unit").id];
    break;
    case 'British':
        zone.ally_unit_set.pop(unit);
    break;
    case 'French':
        zone.ally_unit_set.pop(unit);
    break;
    case 'Italian':
        zone.axis_unit_set.pop(unit);
    break;
    case 'American':
        zone.ally_unit_set.pop(unit);
    break;
  }



  var new_path = Raphael.transformPath(unit.attr('path'), 's2');
  console.log(new_path.toString());
  unit.attr({path: new_path});
}
