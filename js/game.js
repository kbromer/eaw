function Game(){


  //possible nations
  this.ALL_NATIONS = {'uk', 'de'};
  this.ACTIVE_NATIONS = new Array();
  console.log('HERE!!!');
  //create nations
  for (var i = 0; i < ALL_NATIONS.length; i++){
    ACTIVE_NATIONS.push(new Nation(ALL_NATIONS[i]));
  }

  console.log(ACTIVE_NATIONS);


  this.GAME_TURN = 0;
  this.CURRENT_PLAYER = '';

  this.INACTIVE_NATIONS;

}


Game.prototype = {
  constructor: Game,
  getCurrentPlayer: function(){
    if (this.CURRENT_PLAYER == ''){
      this.CURRENT_PLAYER = this.ALL_NATIONS[0];
    }
    return this.CURRENT_PLAYER;
  }

};
