//total number of elements
var element_count = 0;
//last map zone created as part of map generation
var LAST_ZONE;

eaw.Nation = function (myName){
  this.name = myName;
  this.occupied = [];
  this.cash = 0;

  switch (myName){
    case "us":
      this.alliance = 'allies';
      break;
    case "ru":
      this.alliance = 'soviets';
      break;
    case "uk":
      this.alliance = 'allies';
      break;
    case "fr":
      this.alliance = 'allies';
      break;
    case "de":
      this.alliance = 'axis';
      break;
    case "it":
      this.alliance = 'axis';
      break;
  }
}

eaw.Nation.prototype.constructor = eaw.Nation;


//Base level game element that encompasses all 'pieces' on the board
//includes chits, zones, units and dice
eaw.GameElement = function (myPath, myPaper) {
  this.pathstring = myPath;
  this.paper = myPaper;
  this.el;
  this.id = 'ge' + element_count;
  element_count++;
}

eaw.GameElement.prototype = {
  constructor: eaw.GameElement,
  drawElement: function () {
                this.el = this.paper.path(this.pathstring).attr(
                                    {
                                        stroke: 'red',
                                        gradient: '90-#d3d3d3-#3f3f3f',
                                        'stroke-width': 2,
                                        'stroke-linejoin': 'round'
                                    }
                              );
                            }
};

/************************ UNITS **********************************************************************/

//unit types of elements
function Unit(myPath, myPaper, myOwner, myGame){
  this.unit_owner = myOwner;
  this.game = myGame;
  this.location_zone = '';
  this.country_gradient = '';

  //implement drag and drop for units - may need an
  //implementation for other non-zone game pieces later
  //surfacing them here so we can enable/renable later
  this.move = function(dx,dy) {this.attr({transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]});}
  this.start = function() {this.data('origTransform', this.transform().local ); eaw.unitMousedownHandler(this, event);}
  this.stop = function() {eaw.unitMouseupHandler(this, event);}
  eaw.GameElement.call(this, myPath, myPaper);
}
Unit.prototype = Object.create(eaw.GameElement.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.drawElement = function (){

  switch(this.unit_owner){
    case 'de':
      this.country_gradient = this.paper.gradient('l(0,0,1,1)-#d3d3d3-#3f3f3f');
    break;
    case 'uk':
      this.country_gradient = this.paper.gradient('l(0,0,1,1)-#A38967-#D6C5AE');
    break;
    case 'fr':
      this.country_gradient = this.paper.gradient('l(0,0,1,1)-#44CCD4-#088D9C');
    break;
    case 'it':
      this.country_gradient = this.paper.gradient('l(0,0,1,1)-#FFBF00-#BA8B00');
    break;
    case 'us':
      this.country_gradient = this.paper.gradient('l(0,0,1,1)-#386928-#3A911D');
    break;
    case 'ru':
      this.country_gradient = this.paper.gradient('l(0,0,1,1)-#4F3B0D-#8C6D41');
    break;
  }

  this.el = this.paper.path(this.pathstring).attr(
                                  {
                                      stroke: 'black',
                                      fill: this.country_gradient,
                                      'stroke-width': 1,
                                      'stroke-linejoin': 'round'
                                  }
                            ).insertAfter(LAST_ZONE);


  this.el.drag(this.move, this.start, this.stop );
  //appent additional object references to the unit element for access later
  this.el.data("Unit", this);
  this.game.GAME_PIECES.push(this);
  this.el.data("unit_owner", this.unit_owner);
};

function Armor(myPath, myPaper, myOwner, myGame) {
  var ps;

  if (myPath === null){
    ps = 'M 1.13,8.78 C 1.13,8.78 0.97,7.81 0.97,7.81 0.97,7.81 1.43,7.37 1.43,7.37 1.43,7.37 2.03,6.85 2.03,6.85 2.03,6.85 3.30,6.77 3.30,6.77 3.30,6.77 3.75,7.21 3.75,7.21 3.75,7.21 15.60,7.37 15.60,7.37 15.60,7.37 21.30,7.29 21.30,7.29 21.30,7.29 21.30,6.85 21.30,6.85 21.30,6.85 26.77,6.70 26.77,6.70 26.77,6.70 27.23,6.25 27.23,6.25 27.23,6.25 29.10,6.25 29.10,6.25 29.10,6.25 29.77,5.51 29.77,5.51 29.77,5.51 32.93,5.58 32.93,5.58 32.93,5.58 33.23,4.91 33.23,4.91 33.23,4.91 36.15,4.83 36.15,4.83 36.15,4.83 37.13,4.46 37.13,4.46 37.13,4.46 37.57,3.57 37.57,3.57 37.57,3.57 37.87,3.05 37.87,3.05 37.87,3.05 39.37,2.98 39.37,2.98 39.37,2.98 40.57,3.27 40.57,3.27 40.57,3.27 42.45,3.27 42.45,3.27 42.45,3.27 42.97,3.94 43.57,2.83 43.57,2.83 43.57,5.51 43.57,5.51 43.57,5.51 47.77,5.43 47.77,5.43 47.77,5.43 47.77,9.45 47.77,9.45 47.77,9.45 44.93,9.60 44.93,9.60 44.93,9.60 44.93,10.64 44.93,10.64 44.93,10.64 45.83,10.19 45.83,10.19 45.83,10.19 49.80,10.19 49.80,10.19 49.80,10.19 55.57,10.12 55.57,10.12 55.57,10.12 56.10,9.60 56.10,9.60 56.10,9.60 58.13,9.60 58.13,9.60 58.13,9.60 58.05,13.54 58.05,13.54 58.05,13.54 57.37,13.69 57.37,13.69 57.37,13.69 57.23,16.52 57.23,16.52 57.23,16.52 54.83,16.52 54.83,16.52 54.83,16.52 54.67,17.33 54.67,17.33 54.67,17.33 55.57,18.01 55.57,18.01 55.57,18.01 55.43,19.79 55.43,19.79 55.43,19.79 54.37,20.98 54.37,20.98 54.37,20.98 53.33,21.36 53.33,21.36 53.33,21.36 51.97,21.80 51.97,21.80 51.97,21.80 50.03,22.25 50.03,22.25 50.03,22.25 25.20,22.17 25.20,22.17 25.20,22.17 23.25,22.17 23.25,22.17 23.25,22.17 21.75,21.65 21.75,21.65 21.75,21.65 20.25,21.20 20.25,21.20 20.25,21.20 18.83,20.54 18.83,20.54 18.83,20.54 17.85,20.01 17.85,20.01 17.85,20.01 16.50,18.82 16.50,18.82 16.50,18.82 15.60,16.96 15.60,16.96 15.60,16.96 15.75,14.58 15.67,14.58 15.60,14.58 16.43,13.84 16.43,13.84 16.43,13.84 19.43,13.39 19.43,13.39 19.43,13.39 20.93,13.24 20.93,13.24 20.93,13.24 20.93,12.50 20.93,12.50 20.93,12.50 18.67,12.27 18.67,12.27 18.67,12.27 20.77,12.20 20.77,12.20 20.77,12.20 20.77,11.61 20.77,11.61 20.77,11.61 21.60,11.16 21.60,11.16 21.60,11.16 22.57,10.27 22.57,10.27 22.57,10.27 25.13,10.19 25.13,10.19 25.13,10.19 25.87,10.64 25.87,10.64 25.87,10.64 27.60,10.71 27.60,10.71 27.60,10.71 29.17,10.57 29.17,10.57 29.17,10.57 28.43,9.89 28.43,9.89 28.43,9.89 26.70,9.08 26.70,9.08 26.70,9.08 22.73,9.08 22.73,9.08 22.73,9.08 20.93,8.78 20.93,8.78 20.93,8.78 15.30,8.86 15.30,8.86 15.30,8.86 15.30,8.48 15.30,8.48 15.30,8.48 5.70,8.40 5.70,8.40 5.70,8.40 5.25,8.78 5.25,8.78 5.25,8.78 3.53,8.93 3.53,8.93 3.53,8.93 2.85,9.38 2.85,9.38 2.85,9.38 2.33,8.93 2.33,8.93 2.33,8.93 1.13,8.86 1.13,8.86';
  }
  else{
    ps = myPath;
  }
  this.unit_type = 'armor';

  Unit.call(this, ps, myPaper, myOwner, myGame);
}
Armor.prototype = Object.create(Unit.prototype);
Armor.prototype.constructor = Armor;

//fighter types of units
function Fighter(myPath, myPaper, myOwner, myGame){
  //provide a default element for fighters
  var ps;
  if (myPath === null){
    ps = "M 22.06,3.95 C 22.06,3.95 22.69,2.65 22.69,2.65 22.69,2.65 23.12,1.54 23.12,1.54 23.12,1.54 23.56,0.68 23.56,0.68 23.56,0.68 24.44,0.68 24.44,0.68 24.44,0.68 25.06,1.36 25.06,1.36 25.06,1.36 25.44,2.65 25.44,2.65 25.44,2.65 25.81,4.13 25.81,4.13 25.81,4.13 26.38,5.62 26.38,5.62 26.38,5.62 26.38,10.24 26.38,10.24 26.38,10.24 28.00,10.86 28.00,10.86 28.00,10.86 31.50,10.98 31.50,10.98 31.50,10.98 37.38,11.42 37.38,11.42 37.38,11.42 43.00,12.09 43.00,12.09 43.00,12.09 45.38,12.71 45.38,12.71 45.38,12.71 46.19,13.64 46.19,13.64 46.19,13.64 46.19,16.41 46.19,16.41 46.19,16.41 45.06,17.40 45.06,17.40 45.06,17.40 42.62,17.59 42.62,17.59 42.62,17.59 39.31,17.96 39.31,17.96 39.31,17.96 36.12,18.39 36.12,18.39 36.12,18.39 32.50,18.94 32.50,18.94 32.50,18.94 28.94,19.38 28.94,19.38 28.94,19.38 27.06,19.81 27.06,19.81 27.06,19.81 26.06,20.49 26.06,20.49 26.06,20.49 25.62,26.91 25.62,26.91 25.62,26.91 25.50,30.18 25.50,30.18 25.50,30.18 28.12,30.92 28.12,30.92 28.12,30.92 29.81,31.66 29.81,31.66 29.81,31.66 30.50,32.21 30.50,32.21 30.50,32.21 30.37,33.57 30.37,33.57 30.37,33.57 29.19,33.94 29.19,33.94 29.19,33.94 25.50,33.94 25.50,33.94 25.50,33.94 25.06,35.24 25.06,35.24 25.06,35.24 24.69,36.35 24.69,36.35 24.69,36.35 24.31,37.33 24.31,37.33 24.31,37.33 24.00,35.17 24.00,35.11 24.00,35.05 23.31,33.88 23.31,33.88 23.31,33.88 19.69,33.88 19.69,33.88 19.69,33.88 18.56,33.45 18.56,33.45 18.56,33.45 18.06,32.83 18.06,32.83 18.06,32.83 18.00,32.09 18.00,32.09 18.00,32.09 20.12,30.92 20.12,30.92 20.12,30.92 21.56,30.73 21.56,30.73 21.56,30.73 22.94,30.30 22.94,30.30 22.94,30.30 22.81,26.47 22.81,26.47 22.81,26.47 22.56,24.99 22.56,24.99 22.56,24.99 22.38,20.55 22.38,20.55 22.38,20.55 21.31,19.69 21.31,19.69 21.31,19.69 18.12,19.38 18.12,19.38 18.12,19.38 14.50,19.07 14.50,19.07 14.50,19.07 10.06,18.39 10.06,18.39 10.06,18.39 6.31,18.08 6.31,18.08 6.31,18.08 3.19,17.46 3.19,17.46 3.19,17.46 2.19,16.78 2.19,16.78 2.19,16.78 2.12,13.45 2.12,13.45 2.12,13.45 3.56,12.71 3.56,12.71 3.56,12.71 6.31,12.47 6.31,12.47 6.31,12.47 9.69,11.97 9.69,11.97 9.69,11.97 14.25,11.66 14.25,11.66 14.25,11.66 19.25,11.11 19.25,11.11 19.25,11.11 21.19,10.55 21.19,10.55 21.19,10.55 21.94,10.00 21.94,10.00 21.94,10.00 22.12,5.74 22.12,5.74 22.12,5.74 22.06,4.01 22.06,4.01";
  }
  else{
    ps = myPath;
  }
  this.unit_type = 'fighter';
  Unit.call(this, ps, myPaper, myOwner, myGame);
}
Fighter.prototype = Object.create(Unit.prototype)
Fighter.prototype.constructor = Fighter;

//fighter types of units
function Bomber(myPath, myPaper, myOwner, myGame){
  //provide a default element for fighters
  var ps;
  if (myPath === null){
    ps = "M 29.52,7.11 C 29.52,7.11 30.00,6.31 30.00,6.31 30.00,6.31 30.72,6.07 30.72,6.07 30.72,6.07 31.28,6.07 31.28,6.07 31.28,6.07 31.84,6.31 31.92,6.31 32.00,6.31 32.32,7.03 32.32,7.03 32.32,7.03 32.72,8.15 32.72,8.23 32.72,8.31 32.72,9.98 32.72,9.98 32.72,9.98 32.80,11.58 32.80,11.58 32.80,11.58 33.04,12.62 33.04,12.62 33.04,12.62 33.04,17.41 33.04,17.41 33.04,17.41 33.20,19.09 33.20,19.09 33.20,19.09 35.68,19.17 35.68,19.17 35.68,19.17 35.60,16.37 35.60,16.37 35.60,16.37 34.64,16.37 34.64,16.37 34.64,16.37 34.72,15.65 34.72,15.65 34.72,15.65 39.36,15.49 39.36,15.49 39.36,15.49 39.28,15.81 39.28,15.81 39.28,15.81 37.28,15.81 37.28,15.81 37.28,15.81 38.72,16.61 38.72,16.61 38.72,16.61 38.80,19.65 38.80,19.65 38.80,19.65 44.00,19.65 44.00,19.65 44.00,19.65 44.00,16.77 44.00,16.77 44.00,16.77 42.96,16.21 42.96,16.21 42.96,16.21 45.60,16.13 45.60,16.13 45.60,16.13 47.44,16.21 47.44,16.21 47.44,16.21 45.76,16.77 45.76,16.77 45.76,16.77 47.04,16.93 47.04,16.93 47.04,16.93 47.12,19.73 47.12,19.73 47.12,19.73 47.84,20.20 47.84,20.20 47.84,20.20 53.44,20.44 53.44,20.44 53.44,20.44 59.12,20.68 59.12,20.68 59.12,20.68 62.48,21.24 62.48,21.24 62.48,21.24 63.12,21.72 63.12,21.80 63.12,21.88 62.96,22.68 62.96,22.68 62.96,22.68 62.64,23.72 62.64,23.72 62.64,23.72 61.52,24.36 61.52,24.36 61.52,24.36 58.16,24.60 58.16,24.60 58.16,24.60 48.56,25.56 48.56,25.56 48.56,25.56 42.64,25.80 42.64,25.80 42.64,25.80 38.56,26.19 38.56,26.19 38.56,26.19 33.04,26.51 33.04,26.51 33.04,26.51 32.80,31.94 32.80,31.94 32.80,31.94 32.56,38.25 32.56,38.25 32.56,38.25 38.72,38.25 38.72,38.25 38.72,38.25 38.96,43.12 38.96,43.12 38.96,43.12 38.24,43.12 38.24,43.12 38.24,43.12 38.08,42.65 38.08,42.65 38.08,42.65 32.24,42.73 32.24,42.73 32.24,42.73 31.84,43.36 31.84,43.36 31.84,43.36 30.64,43.44 30.64,43.44 30.64,43.44 30.24,42.81 30.24,42.81 30.24,42.81 24.64,42.81 24.64,42.81 24.64,42.81 23.76,43.20 23.76,43.20 23.76,43.20 23.76,38.33 23.76,38.33 23.76,38.33 29.52,38.25 29.52,38.25 29.52,38.25 29.52,34.98 29.52,34.98 29.52,34.98 29.52,32.10 29.52,32.10 29.52,32.10 29.28,26.59 29.28,26.59 29.28,26.59 24.96,26.35 24.96,26.35 24.96,26.35 18.56,26.11 18.56,26.11 18.56,26.11 13.44,25.64 13.44,25.64 13.44,25.64 9.68,25.32 9.68,25.32 9.68,25.32 1.12,24.68 1.12,24.68 1.12,24.68 0.32,23.88 0.32,23.88 0.32,23.88 0.32,23.00 0.32,23.00 0.32,23.00 0.72,21.96 0.72,21.96 0.72,21.96 1.52,21.40 1.52,21.40 1.52,21.40 6.08,21.24 6.08,21.24 6.08,21.24 11.52,20.84 11.52,20.84 11.52,20.84 14.72,20.68 14.72,20.68 14.72,20.68 14.72,16.77 14.72,16.77 14.72,16.77 14.00,16.21 14.00,16.21 14.00,16.21 18.48,16.29 18.48,16.29 18.48,16.29 17.68,16.77 17.68,16.77 17.68,16.77 17.92,20.28 17.92,20.28 17.92,20.28 20.72,20.05 20.72,20.05 20.72,20.05 22.08,19.81 22.08,19.81 22.08,19.81 23.04,19.81 23.04,19.81 23.04,19.81 22.96,16.85 22.96,16.85 22.96,16.85 21.84,16.85 21.84,16.85 21.84,16.85 24.72,16.05 24.72,16.05 24.72,16.05 26.32,16.69 26.32,16.69 26.32,16.69 26.24,19.57 26.24,19.57 26.24,19.57 28.88,19.57 28.88,19.57 28.88,19.57 28.88,14.06 28.88,14.06 28.88,14.06 29.20,10.62 29.20,10.62 29.20,10.62 29.44,7.27 29.44,7.27";
  }
  else{
    ps = myPath;
  }
  this.unit_type = 'bomber';
  Unit.call(this, ps, myPaper, myOwner, myGame);
}
Bomber.prototype = Object.create(Unit.prototype)
Bomber.prototype.constructor = Bomber;


//infantry types of units
function Infantry(myPath, myPaper, myOwner, myGame){
  //provide a default element for infantry
  var ps;
  if (myPath === null){
    ps = "M 15.38,8.39 C 15.38,8.39 15.45,6.39 15.45,6.39 15.45,6.39 16.07,5.64 16.07,5.64 16.07,5.64 16.55,4.95 16.55,4.95 16.55,4.95 17.10,4.47 17.10,4.47 17.10,4.47 17.58,4.19 17.58,4.19 17.58,4.19 19.09,4.19 19.09,4.19 19.09,4.19 19.84,4.54 19.84,4.54 19.84,4.54 20.67,5.43 20.67,5.43 20.67,5.43 21.22,6.19 21.29,6.19 21.35,6.19 21.90,7.08 21.90,7.08 21.90,7.08 21.97,7.84 21.97,7.84 21.97,7.84 21.35,8.25 21.35,8.25 21.35,8.25 21.22,9.83 21.22,9.83 21.22,9.83 20.67,10.45 20.67,10.45 20.67,10.45 20.87,11.07 20.87,11.07 20.87,11.07 20.46,11.55 20.46,11.55 20.46,11.55 19.98,11.96 19.98,11.96 19.98,11.96 20.46,12.44 20.46,12.44 20.46,12.44 21.08,12.79 21.08,12.79 21.08,12.79 22.18,13.27 22.18,13.27 22.18,13.27 22.80,13.54 22.80,13.54 22.80,13.54 23.41,14.64 23.41,14.64 23.41,14.64 23.96,15.74 23.96,15.74 23.96,15.74 24.31,17.05 24.31,17.05 24.31,17.05 24.51,18.49 24.51,18.49 24.51,18.49 24.92,19.11 24.92,19.11 24.92,19.11 24.92,21.86 24.92,21.86 24.92,21.86 24.86,23.24 24.86,23.24 24.86,23.24 25.20,24.27 25.20,24.27 25.20,24.27 25.47,25.09 25.47,25.09 25.47,25.09 26.16,25.30 26.16,25.30 26.16,25.30 26.37,25.99 26.37,25.99 26.37,25.99 26.92,26.67 26.92,26.67 26.92,26.67 27.40,27.29 27.40,27.29 27.40,27.29 28.91,28.32 28.91,28.32 28.91,28.32 30.49,29.42 30.49,29.42 30.49,29.42 31.79,30.25 31.79,30.25 31.79,30.25 32.75,30.80 32.75,30.80 32.75,30.80 32.96,31.21 32.96,31.21 32.96,31.21 32.61,31.76 32.61,31.76 32.61,31.76 31.10,30.94 31.10,30.94 31.10,30.94 29.46,29.91 29.46,29.91 29.46,29.91 28.49,29.42 28.49,29.42 28.49,29.42 27.53,29.01 27.53,28.94 27.53,28.87 26.64,28.39 26.64,28.39 26.64,28.39 26.09,28.53 26.02,28.53 25.95,28.53 25.47,28.74 25.47,28.74 25.47,28.74 24.99,28.32 24.99,28.32 24.99,28.32 24.44,27.77 24.44,27.77 24.44,27.77 24.03,27.29 24.03,27.29 24.03,27.29 23.76,27.84 23.69,27.84 23.62,27.84 23.76,28.94 23.76,28.94 23.76,28.94 23.00,29.56 23.00,29.63 23.00,29.70 23.21,30.66 23.21,30.66 23.21,30.66 23.41,31.90 23.41,31.90 23.41,31.90 23.83,33.41 23.83,33.41 23.83,33.41 24.24,34.44 24.24,34.44 24.24,34.44 24.99,35.34 24.99,35.34 24.99,35.34 24.92,36.99 24.92,36.99 24.92,36.99 24.72,37.88 24.72,37.88 24.72,37.88 24.44,38.91 24.44,38.91 24.44,38.91 24.38,39.81 24.38,39.81 24.38,39.81 23.48,40.91 23.48,40.91 23.48,40.91 22.80,42.28 22.80,42.28 22.80,42.28 22.38,43.52 22.38,43.59 22.38,43.66 21.90,44.82 21.90,44.82 21.90,44.82 21.29,46.06 21.29,46.06 21.29,46.06 21.70,46.82 21.70,46.82 21.70,46.82 22.73,47.16 22.73,47.16 22.73,47.16 23.76,47.57 23.76,47.57 23.76,47.57 25.06,47.99 25.06,48.06 25.06,48.12 25.61,48.61 25.61,48.61 25.61,48.61 25.27,49.16 25.27,49.16 25.27,49.16 22.11,49.16 22.11,49.16 22.11,49.16 21.01,48.67 21.01,48.67 21.01,48.67 19.29,48.67 19.29,48.67 19.29,48.67 18.81,47.92 18.81,47.92 18.81,47.92 18.88,46.47 18.88,46.47 18.88,46.47 19.43,45.86 19.43,45.86 19.43,45.86 19.36,44.34 19.36,44.34 19.36,44.34 19.36,42.14 19.36,42.14 19.36,42.14 19.36,40.91 19.36,40.91 19.36,40.91 19.91,40.49 19.91,40.49 19.91,40.49 19.84,39.67 19.84,39.67 19.84,39.67 19.50,39.26 19.50,39.26 19.50,39.26 19.43,38.02 19.43,38.02 19.43,38.02 20.12,37.40 20.12,37.40 20.12,37.40 20.12,36.37 20.12,36.30 20.12,36.23 19.91,35.13 19.91,35.13 19.91,35.13 19.23,34.58 19.23,34.58 19.23,34.58 18.88,34.72 18.74,34.72 18.61,34.72 18.33,35.13 18.33,35.20 18.33,35.27 17.85,36.78 17.85,36.78 17.85,36.78 17.92,37.95 17.92,37.95 17.92,37.95 17.85,38.98 17.85,39.05 17.85,39.12 17.30,40.49 17.30,40.49 17.30,40.49 17.10,42.42 17.10,42.42 17.10,42.42 17.10,44.62 17.10,44.62 17.10,44.62 17.17,46.68 17.10,46.68 17.03,46.68 17.44,48.12 17.44,48.12 17.44,48.12 18.68,49.16 18.68,49.16 18.68,49.16 19.57,49.71 19.57,49.71 19.57,49.71 19.43,50.53 19.43,50.53 19.43,50.53 18.81,50.94 18.81,50.94 18.81,50.94 16.82,51.01 16.82,51.01 16.82,51.01 15.65,50.26 15.65,50.26 15.65,50.26 14.62,49.71 14.62,49.71 14.62,49.71 14.21,48.81 14.21,48.81 14.21,48.81 14.42,46.89 14.42,46.89 14.42,46.89 14.35,44.89 14.35,44.89 14.35,44.89 13.94,44.07 13.94,44.07 13.94,44.07 13.46,42.69 13.46,42.69 13.46,42.69 13.39,41.11 13.39,41.11 13.39,41.11 12.84,40.49 12.84,40.49 12.84,40.49 12.57,39.74 12.57,39.74 12.57,39.74 12.57,37.26 12.57,37.26 12.57,37.26 12.15,36.57 12.15,36.57 12.15,36.57 12.36,35.41 12.36,35.41 12.36,35.41 12.70,34.72 12.70,34.72 12.70,34.72 12.50,32.59 12.50,32.59 12.50,32.59 12.22,30.66 12.22,30.66 12.22,30.66 11.88,29.84 11.88,29.84 11.88,29.84 10.92,29.77 10.92,29.77 10.92,29.77 10.44,30.32 10.44,30.32 10.44,30.32 9.48,30.52 9.48,30.52 9.48,30.52 8.31,30.39 8.31,30.39 8.31,30.39 7.28,29.84 7.28,29.84 7.28,29.84 6.25,28.81 6.25,28.81 6.25,28.81 6.32,27.02 6.32,27.02 6.32,27.02 6.87,26.67 6.87,26.67 6.87,26.67 7.48,25.92 7.48,25.92 7.48,25.92 8.10,24.61 8.10,24.61 8.10,24.61 8.24,23.65 8.24,23.65 8.24,23.65 9.34,23.17 9.41,23.17 9.48,23.17 10.92,22.96 10.92,22.96 10.92,22.96 11.05,22.27 11.05,22.27 11.05,22.27 10.44,21.45 10.44,21.45 10.44,21.45 9.41,20.97 9.41,20.97 9.41,20.97 8.03,19.94 8.03,19.94 8.03,19.94 7.90,18.42 7.90,18.42 7.90,18.42 8.45,17.88 8.45,17.88 8.45,17.88 9.48,16.16 9.48,16.16 9.48,16.16 10.37,15.06 10.37,15.06 10.37,15.06 11.12,13.41 11.12,13.41 11.12,13.41 11.88,12.79 11.88,12.79 11.88,12.79 12.63,12.03 12.63,12.03 12.63,12.03 14.21,11.89 14.21,11.82 14.21,11.76 15.17,11.62 15.17,11.62 15.17,11.62 15.86,11.34 15.86,11.34 15.86,11.34 16.20,10.38 16.20,10.38 16.20,10.38 15.45,10.04 15.45,10.04 15.45,10.04 15.38,8.39 15.38,8.39";
  }
  else{
    ps = myPath;
  }
  this.unit_type = 'infantry';
  Unit.call(this, ps, myPaper, myOwner, myGame);
}
Infantry.prototype = Object.create(Unit.prototype)
Infantry.prototype.constructor = Infantry;

//artillery types of units
function Artillery(myPath, myPaper, myOwner, myGame){
  //provide a default element for infantry
  var ps;
  if (myPath === null){
    ps = "M 1.73,8.93 C 1.73,8.93 2.10,8.18 2.10,8.18 2.10,8.18 18.45,14.33 18.45,14.33 18.45,14.33 19.80,14.18 19.80,14.18 19.80,14.18 35.85,20.32 35.85,20.32 35.85,20.32 37.20,17.33 37.20,17.33 37.20,17.33 38.48,17.40 38.48,17.40 38.48,17.40 39.15,17.70 39.15,17.70 39.15,17.70 39.68,16.95 39.68,16.95 39.68,16.95 39.68,18.23 39.68,18.23 39.68,18.23 42.00,19.05 42.00,19.05 42.00,19.05 42.60,18.90 42.60,18.90 42.60,18.90 43.20,19.12 43.20,19.12 43.20,19.12 43.43,20.25 43.43,20.32 43.43,20.40 44.10,20.55 44.10,20.55 44.10,20.55 44.85,20.62 44.85,20.62 44.85,20.62 45.53,21.53 45.53,21.53 45.53,21.53 45.08,22.05 45.08,22.05 45.08,22.05 44.70,24.23 44.70,24.23 44.70,24.23 45.68,23.70 45.68,23.70 45.68,23.70 48.23,24.53 48.23,24.53 48.23,24.53 47.93,25.50 47.93,25.50 47.93,25.50 49.58,26.10 49.65,26.10 49.73,26.10 50.55,26.48 50.55,26.48 50.55,26.48 50.18,27.38 50.18,27.38 50.18,27.38 49.65,27.98 49.65,27.98 49.65,27.98 50.25,28.28 50.25,28.28 50.25,28.28 48.90,30.90 48.90,30.90 48.90,30.90 48.00,30.68 48.00,30.68 48.00,30.68 47.55,30.08 47.55,30.08 47.55,30.08 44.78,29.10 44.78,29.10 44.78,29.10 44.93,31.58 44.93,31.58 44.93,31.58 45.53,31.58 45.53,31.58 45.53,31.58 45.90,32.33 45.90,32.33 45.90,32.33 47.78,32.33 47.78,32.33 47.78,32.33 47.93,33.30 47.93,33.30 47.93,33.30 44.18,33.30 44.18,33.30 44.18,33.30 44.25,33.83 44.25,33.83 44.25,33.83 40.20,33.90 40.20,33.90 40.20,33.90 40.73,34.73 40.73,34.80 40.73,34.88 58.20,35.78 58.20,35.78 58.20,35.78 58.28,36.98 58.28,36.98 58.28,36.98 16.80,37.13 16.80,37.13 16.80,37.13 16.80,36.00 16.80,36.00 16.80,36.00 33.75,34.80 33.75,34.80 33.75,34.80 34.58,32.78 34.58,32.78 34.58,32.78 34.12,32.40 34.12,32.40 34.12,32.40 32.93,32.25 32.93,32.25 32.93,32.25 32.55,32.70 32.55,32.70 32.55,32.70 29.55,32.70 29.55,32.70 29.55,32.70 28.88,32.10 28.88,32.10 28.88,32.10 27.60,31.80 27.60,31.80 27.60,31.80 27.75,29.03 27.75,29.03 27.75,29.03 28.88,28.58 28.88,28.58 28.88,28.58 28.88,27.98 28.88,27.98 28.88,27.98 28.28,27.60 28.28,27.60 28.28,27.60 28.43,26.70 28.43,26.70 28.43,26.70 28.80,26.03 28.80,26.03 28.80,26.03 31.12,25.43 31.12,25.43 31.12,25.43 34.27,24.98 34.20,24.98 34.12,24.98 33.00,24.30 33.00,24.30 33.00,24.30 23.48,20.70 23.48,20.70 23.48,20.70 23.10,19.73 23.10,19.73 23.10,19.73 23.78,19.28 23.78,19.28 23.78,19.28 24.83,19.28 24.83,19.28 24.83,19.28 25.65,19.20 25.65,19.20 25.65,19.20 25.80,18.68 25.80,18.68 25.80,18.68 18.68,16.05 18.68,16.05 18.68,16.05 18.00,15.30 18.00,15.30 18.00,15.30 1.65,8.93 1.65,8.93";
    }
  else{
    ps = myPath;
  }
  this.unit_type = 'artillery';
  Unit.call(this, ps, myPaper, myOwner, myGame);
}
Artillery.prototype = Object.create(Unit.prototype)
Artillery.prototype.constructor = Artillery;


function Carrier(myPath, myPaper, myOwner, myGame){
  //provide a default element for carrier
  var ps;
  if (myPath === null){
    ps = "M 3.25,50.00 C 3.25,50.00 94.00,49.25 94.00,49.25 94.00,49.25 96.00,46.50 96.00,46.50 96.00,46.50 96.75,44.25 96.75,44.25 96.75,44.25 94.00,43.75 94.00,43.75 94.00,43.75 93.25,41.75 93.25,41.50 93.25,41.25 53.25,41.25 53.25,41.25 53.25,41.25 53.50,33.75 53.50,33.75 53.50,33.75 53.25,27.25 53.25,27.25 53.25,27.25 52.25,27.50 52.25,27.50 52.25,27.50 52.50,34.00 52.50,34.00 52.50,34.00 46.00,33.75 45.75,33.75 45.50,33.75 44.25,35.50 44.25,35.50 44.25,35.50 38.00,36.00 38.00,36.00 38.00,36.00 37.75,38.25 37.75,38.25 37.75,38.25 37.00,40.75 37.00,40.75 37.00,40.75 4.00,41.00 4.00,41.00 4.00,41.00 3.75,43.75 3.75,43.50 3.75,43.25 7.25,43.00 7.25,43.00 7.25,43.00 7.75,45.00 7.75,45.00 7.75,45.00 3.75,45.50 3.50,45.50 3.25,45.50 3.25,50.00 3.25,50.00";
    }
  else{
    ps = myPath;
  }
  this.unit_type = 'carrier';
  Unit.call(this, ps, myPaper, myOwner, myGame);
}
Carrier.prototype = Object.create(Unit.prototype)
Carrier.prototype.constructor = Carrier;

function Cruiser(myPath, myPaper, myOwner, myGame){
  //provide a default element for cruiser
  var ps;
  if (myPath === null){
    ps = "M 10.00,49.00 C 10.00,49.00 88.50,48.75 88.50,48.75 88.50,48.75 89.75,45.88 89.75,45.88 89.75,45.88 89.75,44.12 89.75,44.12 89.75,44.12 78.50,44.00 78.50,44.00 78.50,44.00 78.00,43.25 78.00,43.25 78.00,43.25 80.25,43.25 80.25,43.25 80.25,43.25 73.12,43.12 73.12,43.12 73.12,43.12 74.00,44.38 74.00,44.38 74.00,44.38 71.75,44.50 71.75,44.50 71.75,44.50 71.62,42.12 71.62,42.12 71.62,42.12 70.62,40.88 70.62,40.88 70.62,40.88 69.88,42.00 69.88,42.00 69.88,42.00 69.88,43.88 69.88,43.88 69.88,43.88 68.50,43.88 68.50,43.88 68.50,43.88 67.75,41.25 67.75,41.25 67.75,41.25 65.12,40.88 65.12,40.88 65.12,40.88 64.88,38.88 64.88,38.88 64.88,38.88 63.88,38.88 63.88,38.88 63.88,38.88 63.62,38.12 63.62,38.12 63.62,38.12 61.25,38.12 61.25,38.12 61.25,38.12 61.25,42.38 61.25,42.38 61.25,42.38 60.00,42.88 60.00,42.88 60.00,42.88 60.00,28.50 60.00,28.50 60.00,28.50 58.75,28.38 58.75,28.38 58.75,28.38 58.88,43.12 58.88,43.12 58.88,43.12 57.00,43.00 57.00,43.00 57.00,43.00 56.88,38.50 56.88,38.75 56.88,39.00 54.00,39.12 54.00,39.12 54.00,39.12 53.88,43.25 53.88,43.25 53.88,43.25 50.75,43.12 50.75,43.12 50.75,43.12 44.50,40.00 44.50,40.00 44.50,40.00 44.38,40.75 44.12,40.88 43.88,41.00 46.62,42.50 46.62,42.50 46.62,42.50 45.62,44.12 45.62,44.25 45.62,44.38 43.88,44.50 43.88,44.50 43.88,44.50 42.75,43.50 42.75,43.50 42.75,43.50 43.00,38.88 43.00,38.88 43.00,38.88 40.00,38.88 40.12,38.88 40.25,38.88 40.62,43.38 40.62,43.38 40.62,43.38 38.00,43.00 38.00,43.00 38.00,43.00 38.00,42.00 38.00,42.00 38.00,42.00 36.62,41.88 36.62,41.88 36.62,41.88 36.75,43.62 36.75,43.62 36.75,43.62 34.00,43.62 34.00,43.62 34.00,43.62 34.12,37.62 34.12,37.62 34.12,37.62 34.88,37.75 34.88,37.75 34.88,37.75 34.62,31.00 34.62,31.00 34.62,31.00 33.75,31.00 33.75,31.00 33.75,31.00 33.88,37.00 33.88,37.00 33.88,37.00 33.00,37.38 33.00,37.38 33.00,37.38 33.00,41.25 33.00,41.25 33.00,41.25 31.25,42.00 31.25,42.00 31.25,42.00 31.12,44.50 31.12,44.50 31.12,44.50 29.75,44.50 29.62,44.62 29.50,44.75 29.88,43.12 29.88,43.12 29.88,43.12 25.25,43.12 25.25,43.12 25.25,43.12 26.25,45.00 26.25,45.00 26.25,45.00 25.88,46.00 25.88,46.00 25.88,46.00 25.00,45.75 25.00,45.75 25.00,45.75 24.75,44.12 24.75,44.12 24.75,44.12 20.12,44.38 20.12,44.38 20.12,44.38 22.25,44.50 22.25,44.50 22.25,44.50 22.12,45.88 22.12,45.88 22.12,45.88 16.88,45.88 16.88,45.88 16.88,45.88 15.62,44.25 15.62,44.25 15.62,44.25 14.50,44.12 14.50,44.12 14.50,44.12 14.12,45.62 14.12,45.62 14.12,45.62 10.00,45.62 10.00,45.62 10.00,45.62 9.88,49.00 9.88,49.00";
    }
  else{
    ps = myPath;
  }
  this.unit_type = 'cruiser';
  Unit.call(this, ps, myPaper, myOwner, myGame);
}
Cruiser.prototype = Object.create(Unit.prototype)
Cruiser.prototype.constructor = Cruiser;

function Transport(myPath, myPaper, myOwner, myGame){
  //provide a default element for transport
  var ps;
  if (myPath === null){
    ps = "M 13.00,47.50 C 13.00,47.50 59.62,47.88 59.62,47.88 59.62,47.88 61.00,39.75 61.00,39.75 61.00,39.75 53.00,39.75 53.00,39.75 53.00,39.75 49.75,32.25 49.75,32.25 49.75,32.25 44.00,32.25 44.00,32.25 44.00,32.25 45.75,23.50 45.75,23.50 45.75,23.50 40.25,23.50 40.25,23.50 40.25,23.50 38.75,32.00 38.75,32.00 38.75,32.00 31.00,32.00 31.00,32.00 31.00,32.00 34.00,22.75 34.00,22.75 34.00,22.75 27.75,22.50 27.75,22.50 27.75,22.50 24.50,32.50 24.50,32.50 24.50,32.50 16.00,32.75 16.00,32.75 16.00,32.75 12.25,37.50 12.25,37.50 12.25,37.50 1.50,37.25 1.50,37.25 1.50,37.25 13.25,47.50 13.25,47.50";
    }
  else{
    ps = myPath;
  }
  this.unit_type = 'transport';
  Unit.call(this, ps, myPaper, myOwner, myGame);
}
Transport.prototype = Object.create(Unit.prototype)
Transport.prototype.constructor = Transport;

function Battleship(myPath, myPaper, myOwner, myGame){
  //provide a default element for Battleship
  var ps;
  if (myPath === null){
    ps = "M 0.83,33.25 C 0.83,33.25 1.00,37.11 1.00,37.11 1.00,37.11 6.83,37.28 6.83,37.28 6.83,37.28 10.33,37.28 10.17,37.28 10.00,37.28 18.17,37.28 18.17,37.28 18.17,37.28 18.83,35.93 18.83,35.93 18.83,35.93 13.83,35.76 13.67,35.76 13.50,35.76 13.50,35.26 13.50,35.26 13.50,35.26 19.00,35.09 19.00,35.09 19.00,35.09 20.83,33.92 20.83,33.92 20.83,33.92 23.33,34.42 23.33,34.42 23.33,34.42 24.67,35.93 24.67,36.10 24.67,36.27 23.67,37.11 23.67,37.11 23.67,37.11 26.83,37.11 26.67,37.11 26.50,37.11 26.33,33.08 26.33,33.08 26.33,33.08 27.50,32.57 27.50,32.57 27.50,32.57 27.33,29.38 27.33,29.38 27.33,29.38 29.17,23.51 29.17,23.51 29.17,23.51 29.17,28.04 29.17,28.21 29.17,28.38 30.17,29.22 30.17,29.22 30.17,29.22 30.00,32.57 30.00,32.57 30.00,32.57 32.67,32.91 32.67,32.91 32.67,32.91 28.83,34.76 28.83,34.93 28.83,35.09 29.17,37.11 29.17,37.11 29.17,37.11 31.50,36.77 31.50,36.77 31.50,36.77 32.67,35.76 32.67,35.76 32.67,35.76 35.00,35.76 35.00,35.76 35.00,35.76 36.50,34.59 36.50,34.59 36.50,34.59 38.67,34.59 38.67,34.59 38.67,34.59 38.17,33.41 38.17,33.25 38.17,33.08 36.33,32.24 36.33,32.24 36.33,32.24 36.33,31.06 36.83,31.23 37.33,31.40 40.00,31.40 40.00,31.40 40.00,31.40 42.00,31.40 42.00,31.40 42.00,31.40 42.33,32.41 42.33,32.57 42.33,32.74 43.50,32.91 43.67,32.91 43.83,32.91 43.50,26.70 43.50,26.70 43.50,26.70 47.33,26.53 47.33,26.53 47.33,26.53 47.50,32.07 47.50,32.07 47.50,32.07 49.83,32.41 49.83,32.41 49.83,32.41 49.83,28.71 49.83,28.71 49.83,28.71 51.67,28.54 51.67,28.54 51.67,28.54 51.83,32.24 51.83,32.24 51.83,32.24 54.83,32.41 54.83,32.41 54.83,32.41 54.50,33.92 54.50,33.92 54.50,33.92 56.83,33.92 56.83,33.92 56.83,33.92 57.00,18.97 57.00,18.97 57.00,18.97 55.33,18.97 55.33,18.97 55.33,18.97 56.33,3.86 56.33,3.86 56.33,3.86 57.17,12.93 57.17,12.93 57.17,12.93 59.17,16.12 59.17,16.12 59.17,16.12 57.00,16.29 57.00,16.29 57.00,16.29 59.83,17.29 59.83,17.29 59.83,17.29 59.33,20.65 59.33,20.65 59.33,20.65 58.00,21.49 58.00,21.49 58.00,21.49 58.17,25.19 58.17,25.19 58.17,25.19 59.17,28.04 59.17,28.04 59.17,28.04 59.17,30.56 59.17,30.56 59.17,30.56 60.33,30.90 60.33,30.90 60.33,30.90 60.67,26.53 60.67,26.53 60.67,26.53 63.83,26.53 63.83,26.53 63.83,26.53 64.00,31.40 64.00,31.40 64.00,31.40 65.67,31.40 65.67,31.40 65.67,31.40 65.50,27.20 65.50,27.20 65.50,27.20 68.33,27.20 68.50,27.20 68.67,27.20 68.50,35.93 68.50,35.93 68.50,35.93 69.50,35.93 69.50,35.93 69.50,35.93 70.33,33.75 70.33,33.58 70.33,33.41 73.50,33.25 73.50,33.25 73.50,33.25 74.33,34.42 74.33,34.42 74.33,34.42 78.50,34.25 78.67,34.25 78.83,34.25 80.00,34.25 80.00,34.25 80.00,34.25 74.50,34.59 74.50,34.59 74.50,34.59 74.67,35.93 74.67,35.93 74.67,35.93 82.33,35.60 82.33,35.60 82.33,35.60 97.67,35.09 97.67,35.09 97.67,35.09 98.17,30.90 98.17,30.90 98.17,30.90 98.67,39.12 98.67,39.12 98.67,39.12 99.17,43.49 99.17,43.49 99.17,43.49 98.17,44.16 98.17,44.16 98.17,44.16 10.33,44.33 10.33,44.33 10.33,44.33 10.33,42.31 10.33,42.31 10.33,42.31 5.00,41.81 5.00,41.81 5.00,41.81 4.83,44.16 4.83,44.16 4.83,44.16 3.00,44.33 3.00,44.33 3.00,44.33 2.67,41.81 2.67,41.81 2.67,41.81 0.50,41.81 0.50,41.81 0.50,41.81 0.50,37.28 0.50,37.28";
    }
  else{
    ps = myPath;
  }
  this.unit_type = 'battleship';
  Unit.call(this, ps, myPaper, myOwner, myGame);
}
Battleship.prototype = Object.create(Unit.prototype)
Battleship.prototype.constructor = Battleship;


function Submarine(myPath, myPaper, myOwner, myGame){
  //provide a default element for carrier
  var ps;
  if (myPath === null){
    ps = "M 63.88,8.00 C 63.88,8.00 66.00,7.88 66.00,7.88 66.00,7.88 66.00,6.88 66.00,6.88 66.00,6.88 85.00,6.75 85.00,6.75 85.00,6.75 86.00,6.00 86.00,6.00 86.00,6.00 98.75,6.00 98.75,6.00 98.75,6.00 98.88,9.62 98.88,9.62 98.88,9.62 97.88,10.88 97.88,10.88 97.88,10.88 98.00,12.62 98.00,12.62 98.00,12.62 96.00,14.88 96.00,14.88 96.00,14.88 22.25,14.88 22.25,14.88 22.25,14.88 21.75,13.75 21.75,13.75 21.75,13.75 15.38,13.75 15.38,13.75 15.38,13.75 14.88,12.88 14.88,12.88 14.88,12.88 10.12,12.75 10.12,12.75 10.12,12.75 9.12,11.88 9.12,11.88 9.12,11.88 1.00,11.75 1.00,11.75 1.00,11.75 1.00,9.12 1.00,9.12 1.00,9.12 7.12,9.12 7.12,9.12 7.12,9.12 7.88,8.00 7.88,8.00 7.88,8.00 21.38,8.00 21.38,8.00 21.38,8.00 21.25,6.88 21.25,6.88 21.25,6.88 22.50,6.88 22.50,6.88 22.50,6.88 22.62,8.00 22.62,8.00 22.62,8.00 54.88,8.12 54.88,8.12 54.88,8.12 55.12,6.25 55.12,6.25 55.12,6.25 57.00,6.12 57.00,6.12 57.00,6.12 58.25,5.00 58.25,5.00 58.25,5.00 58.00,0.62 58.00,0.62 58.00,0.62 59.00,0.38 59.00,0.38 59.00,0.38 59.00,3.75 59.00,3.75 59.00,3.75 61.75,3.88 61.75,3.88 61.75,3.88 61.88,1.62 61.88,1.62 61.88,1.62 62.88,1.75 62.88,1.75 62.88,1.75 62.75,3.88 62.75,3.88 62.75,3.88 64.00,3.75 64.00,3.75 64.00,3.75 63.88,8.50 63.88,8.50";
    }
  else{
    ps = myPath;
  }
  this.unit_type = 'submarine';
  Unit.call(this, ps, myPaper, myOwner, myGame);
}
Submarine.prototype = Object.create(Unit.prototype)
Submarine.prototype.constructor = Submarine;

/************************ ZONES **********************************************************************/
/*****************************************************************************************************/

function Zone(myPath, myPaper, myName){
  this.name = myName;
  this.de_unit_set = {};
  this.uk_unit_set = {};
  this.us_unit_set = {};
  this.russian_unit_set = {};
  this.axis_unit_set = {};
  this.neutral_unit_set = {};
  this.ally_unit_set = {};
  this.hoverin = function () {eaw.zonehoverinHandler(this);};
  this.hoverout = function () {eaw.zonehoveroutHandler(this);};
  eaw.GameElement.call(this, myPath, myPaper);
}

Zone.prototype = new eaw.GameElement();
Zone.prototype.constructor = Zone;

//seazone is a type of zone
function SeaZone(myPath, myPaper, myName){
  Zone.call(this, myPath, myPaper, myName);
}
SeaZone.prototype = Object.create(Zone.prototype);
SeaZone.prototype.constructor = SeaZone;

SeaZone.prototype.drawElement = function (){this.el = this.paper.path(this.pathstring).attr(
                                          {
                                            fill: this.paper.gradient('l(0,0,1,1)-#59ABC2-#4680A3'),
                                            stroke: 'black',
                                            'stroke-width': 2,
                                            'stroke-linejoin': 'round'
                                  }
                            );
                            this.el.data("Zone", this);
                            this.el.hover(this.hoverin, this.hoverout);
                      };

//landzone is a type of zone
function LandZone(myPath, myPaper, myName, defaultOwner, hasFactory, pointValue){
  //set the zone owner to the
  this.original_owner = defaultOwner;
  this.current_owner = defaultOwner;
  this.factory = hasFactory;
  this.point_value = pointValue;
  this.zone_gradient;
  switch (defaultOwner){
    case 'de':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#C7C7C7-#ADADAD');
    break;
    case 'uk':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#E6E5BE-#C8D19D');
    break;
    case '':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#FFA33B-#FF8800');
    break;
    case 'fr':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#526c7a-#64a0c1');
    break;
    case 'it':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#E3BB19-#EDD54E');
    break;
    case 'buffer':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#FFCEBA-#FFEBE3');
    break;
    case 'ru':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#632512-#A86C59');
    break;
    case 'fn':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#E3BB19-#EDD54E');
    break;
    case 'hu':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#E3BB19-#EDD54E');
    break;
    case 'bu':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#E3BB19-#EDD54E');
    break;
    case 'rm':
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#E3BB19-#EDD54E');
    break;
    default:
      this.zone_gradient = myPaper.gradient('l(0,0,1,1)-#FFA33B-#FF8800');
    break;
  }
  Zone.call(this, myPath, myPaper, myName);
}
LandZone.prototype = Object.create(Zone.prototype);
LandZone.prototype.constructor = LandZone;

LandZone.prototype.drawElement = function (){
  this.el = this.paper.path(this.pathstring).attr(
                                          {
                                            fill: this.zone_gradient,
                                            stroke: 'black',
                                            'stroke-width': 2,
                                            'stroke-linejoin': 'round'
                                  }
                            );

                            this.el.data("Zone", this);
                            this.el.hover(this.hoverin, this.hoverout);
                      };
