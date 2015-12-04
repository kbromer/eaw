eaw.nations = {};
eaw.nations.ALL_NATIONS = ['de', 'uk', 'ru', 'fr', 'us', 'it'];

eaw.nations.Nation = function (obj){
  this.id = obj.id;
  this.name = obj.name;
  this.alliance = obj.alliance;
  this.unit_name = obj.unit_name;

//  this.occupied = [];
  this.cash = obj.cash;
  this.status = obj.status;
  //owner for purposes of adding up ipcs
  //could be minor allies, etc.
  this.ipc_owner = this.id;
};

eaw.nations.getIPCs = function () {

  //set any offboard points
  var ipcs = {de: 0, us: 60, fr: 0, uk: 0, ru: 0, it: 0};

  for (i = 0; i < eaw.game.ZONE_SET.length; i++){
    var zone = eaw.game.ZONE_SET[i];
    if (zone.type === 'LandZone'){
      if (zone.point_value > 0){
        ipcs[zone.current_owner] = ipcs[zone.current_owner] + zone.point_value;
      }
    }
  }

  //handle boxes, special cases, offboard IPCs,
  //damaged factories, etc.


  return ipcs;
};

eaw.nations.StartingNationProperties = {

  na: {name: "OFF MAP", alliance: "neutral", unit_name: "", cash: 0, id: "na"},
  nr: {name: "Norway", alliance: "neutral", unit_name: "Norwegian", cash: 0, id: "nr"},
  fn: {name: "Finland", alliance: "neutral", unit_name: "Finnish", cash: 0, id: "fn"},
  hu: {name: "Hungary", alliance: "neutral", unit_name: "Hungarian", cash: 0, id: "hu"},
  bu: {name: "Bulgaria", alliance: "neutral", unit_name: "Bulgarian", cash: 0, id: "bu"},
  dk: {name: "Denmark", alliance: "neutral", unit_name: "Danish", cash: 0, id: "dk"},
  ei: {name: "Ireland", alliance: "neutral", unit_name: "Irish", cash: 0, id: "ei"},
  be: {name: "Belgium", alliance: "neutral", unit_name: "Belgian", cash: 0, id: "be"},
  ne: {name: "Netherlands", alliance: "neutral", unit_name: "Dutch", cash: 0, id: "ne"},
  sz: {name: "Switzerland", alliance: "neutral", unit_name: "Swiss", cash: 0, id: "sz"},
  qa: {name: "Qatar", alliance: "neutral", unit_name: "Qatari", cash: 0, id: "qa"},
  sw: {name: "Sweden", alliance: "neutral", unit_name: "Swedish", cash: 0, id: "sw"},
  po: {name: "Poland", alliance: "neutral", unit_name: "Polish", cash: 0, id: "po"},
  gr: {name: "Greece", alliance: "neutral", unit_name: "Greek", cash: 0, id: "gr"},
  yu: {name: "Yugoslavia", alliance: "neutral", unit_name: "Yugo", cash: 0, id: "yu"},
  iq: {name: "Iraq", alliance: "neutral", unit_name: "Iraqi", cash: 0, id: "iq"},
  ir: {name: "Iran", alliance: "neutral", unit_name: "Ayatolla of Rock'n'Rolla", cash: 0, id: "ir"},
  sp: {name: "Spain", alliance: "neutral", unit_name: "Spanish", cash: 0, id: "sp"},
  pr: {name: "Portugal", alliance: "neutral", unit_name: "Portugeuse", cash: 0, id: "pr"},
  rm: {name: "Romania", alliance: "neutral", unit_name: "Romanian", cash: 0, id: "rm"},
  sa: {name: "Saudi Arabia", alliance: "neutral", unit_name: "Saudi", cash: 0, id: "sa"},
  tr: {name: "Turkey", alliance: "neutral", unit_name: "Turkish", cash: 0, id: "tr"},
  de: {name: "Germany", alliance: "axis", unit_name: "German", cash: 0, id: "de"},
  fr: {name: "France", alliance: "allies", unit_name: "French", cash: 0, id: "fr"},
  uk: {name: "United Kingdom", alliance: "allies", unit_name: "British", cash: 0, id: "uk"},
  us: {name: "United States", alliance: "allies", unit_name: "US", cash: 0, id: "us"},
  ru: {name: "Soviet Union", alliance: "russia", unit_name: "Soviet", cash: 0, id: "ru"},
  it: {name: "Italy", alliance: "axis", unit_name: "Italian", cash: 0, id: "it"},
  buffer: {name: "Unoccupied Soviet Zones", alliance: "neutral", unit_name: "", cash: 0, id: "buffer"},
};
