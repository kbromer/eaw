eaw.nations = {};
eaw.nations.ALL_NATIONS = ['de', 'uk', 'ru', 'fr', 'us', 'it'];

eaw.nations.Nation = function (id, cash){
  this.id = id;
  switch (this.id){
    case "us":
      this.name = 'United States';
      this.alliance = 'allies';
      this.unit_name = 'US';
      break;
    case "ru":
      this.name = 'Soviet Union';
      this.alliance = 'russia';
      this.unit_name = 'Soviet';
      break;
    case "uk":
      this.name = 'United Kingdom';
      this.alliance = 'allies';
      this.unit_name = 'British';
      break;
    case "fr":
      this.name = 'France';
      this.alliance = 'allies';
      this.unit_name = 'French';
      break;
    case "de":
      this.name = 'Germany';
      this.alliance = 'axis';
      this.unit_name = 'German';
      break;
    case "it":
      this.name = 'Italy';
      this.alliance = 'axis';
      this.unit_name = 'Italian';
      break;
  }
//  this.occupied = [];
  this.cash = cash;
  this.status = status;
  //owner for purposes of adding up ipcs
  //could be minor allies, etc.
  this.ipc_owner = this.id;
}

eaw.nations.Nation.prototype.constructor = eaw.Nation;
eaw.nations.Nation.prototype.getIPCs = function () {
  var ipcs = 0;

  for (i = 0; i < eaw.game.ZONE_SET.length; i++){
    var zone = eaw.game.ZONE_SET[i];
    if (zone.current_owner === this.ipc_owner && zone.point_value > 0) {
      ipcs = ipcs + zone.point_value;
    }
  }

  //handle boxes, special cases, offboard IPCs, 
  //damaged factories, etc.
  return ipcs;
}


/*
roperties = {
// Off Map Areas
OffMapPersia: {type: "land", owner: "na", hasFactory: false, pointValue: 0},
OffMapRussia: {type: "land", owner: "na", hasFactory: false, pointValue: 0},
// Norway
Oslo: {type: "land", owner:"nr", hasFactory: true, pointValue: 1},
/** Finland
Helsinki: {type: "land", owner:"fn", hasFactory: true, pointValue: 2},
//* Hungary
Budapest: {type: "land", owner:"hu", hasFactory: true, pointValue: 2},
//* Bulgaria
Sofia: {type: "land", owner:"bu", hasFactory: true, pointValue: 2},
//* Single-Zone Neutrals
Denmark: {type: "land", owner:"dk", hasFactory: true, pointValue: 1},
Ireland: {type: "land", owner:"ei", hasFactory: true, pointValue: 1},
Belgium: {type: "land", owner:"be", hasFactory: true, pointValue: 2},
Netherlands: {type: "land", owner:"ne", hasFactory: true, pointValue: 1},
Switzerland: {type: "land", owner: "sz", hasFactory: true, pointValue: 3},
Qatar: {type: "land", owner: "qa", hasFactory: true, pointValue: 3},
//* Sweden
Sundsvall: {type: "land", owner: "sw", hasFactory: true, pointValue: 1},
//* Poland
Danzig: {type: "land", owner:"po", hasFactory: true, pointValue: 1},
//* Greece
Rhodes: {type: "land", owner:"gr", hasFactory: false, pointValue: 0},
//* Yugoslavia
Zagreb: {type: "land", owner: "yu", hasFactory: true, pointValue: 1},
//* Iraq
Baghdad: {type: "land", owner: "iq", hasFactory: true, pointValue: 1},
//* Iran
Khoi: {type: "land", owner: "ir", hasFactory: false, pointValue: 0},
//* Spain
Spanish_Morocco: {type: "land", owner: "sp", hasFactory: false, pointValue: 0},
//* Portugal
Porto: {type: "land", owner: "pr", hasFactory: true, pointValue: 1},

//* Romania
Galati: {type: "land", owner: "rm", hasFactory: false, pointValue: 0},

//* Saudi Arabia
AlJawf: {type: "land", owner: "sa", hasFactory: false, pointValue: 0},

//* Turkey
Istanbul: {type: "land", owner: "tr", hasFactory: true, pointValue: 1},

*/
