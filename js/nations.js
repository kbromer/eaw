eaw.Nation = function (id, cash){
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

}

eaw.Nation.prototype.constructor = eaw.Nation;
