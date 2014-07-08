function Nation(myName){
  this.name = myName;
  this.alliance;
  switch (myName){
    case "US":
      this.alliance = 'Allies';
      break;
    case "USSR":
      this.alliance = 'Soviets';
      break;
    case "UK"
      this.alliance = 'Allies';
      break;
    case "France":
      this.alliance = 'Allies';
      break;
    case "Germany":
      this.alliance = 'Axis';
      break;
    case "Italy":
      this.alliance = 'Axis';
      break;
  }
}


GameElement.prototype = {
  constructor: Nation
};
