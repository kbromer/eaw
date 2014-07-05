function inheritPrototype(childObject, parentObject) {
    // Crockford’s method
    var copyOfParent = Object.create(parentObject.prototype);
    copyOfParent.constructor = childObject;
    childObject.prototype = copyOfParent;
}


function Zone(myPath, myPaper){
  this.pathstring = myPath;
  this.paper = myPaper;

  };
Zone.prototype = {
  constructor: Zone,
  drawZone: function () {this.paper.path(this.pathstring).attr(
                                    {
                                        stroke: 'black',
                                        'stroke-width': 2,
                                        'stroke-linejoin': 'round',
                                    }
                              )//.draggable) = false;
                            }
};

function SeaZone(myPath, myPaper){
  Zone.call(this, myPath, myPaper);
}
// inherit the methods and properties from Question
inheritPrototype(SeaZone, Zone);

SeaZone.prototype.drawZone = function (){this.paper.path(this.pathstring).attr(
                                  {
                                      gradient: '90-#526c7a-#64a0c1',
                                      stroke: '#3b4449',
                                      'stroke-width': 2,
                                      'stroke-linejoin': 'round',

                                  }
                            ).draggable.enable();
                          }
