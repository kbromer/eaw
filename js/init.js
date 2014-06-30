window.onload = function(){
	$.getScript("js/zones.js", function() {
  	console.log( "Load was performed." );


		var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);


		var zonetest = new Zone("m397,105l-72,50l72,73l100,-35l-11,-68l-83,26l14,-32l-20,-14z");
		zonetest.drawme(paper);

});

}
