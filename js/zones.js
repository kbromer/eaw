function Zone(mypath){
  this.pathstring = function() {return mypath;};


  };
Zone.prototype = {
  constructor: Zone,
  drawme: function (mypaper) {var tetronimo = mypaper.path(this.pathstring());

  tetronimo.attr(
      {
          gradient: '90-#526c7a-#64a0c1',
          stroke: '#3b4449',
          'stroke-width': 10,
          'stroke-linejoin': 'round',
          rotation: -90
      }
  );

  }
};
