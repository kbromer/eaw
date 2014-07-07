window.onload = function(){
		console.log("Window loaded...");
	$.getScript("js/GameElements.js", function() {
  	console.log( "Game elements engine loaded..." );

		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var paper = new Raphael(document.getElementById('canvas_container'), w,h);
		//fix raphael inheritance
		paper.fixNS();
		//enable draggability for elements on the Canvas
		paper.draggable.enable();
		paper.zonecount = 0;
		var viewport = getViewport();
		paper.setViewBox(0, 0, w, h, false);
//    paper.canvas.setAttribute('preserveAspectRatio', 'none');
//		var zpd = new RaphaelZPD(paper, { zoom: true, pan: false, drag: false });
//	  paper.setViewBox(0, 0, 500, 600, true);
//	var background = paper.image('images/eaw.jpg', 0, 0, '100%', '100%');
//		background.node.draggable = false;
		paper.setStart();
		var seaZone1 = new SeaZone("m4,4l-0.5,114.5l95,0l41.5,-88l-0.5,-26l-135.5,-0.5z", paper);
		seaZone1.drawElement();
		var seaZone2 = new SeaZone("m139,4l107,-0.5l3,122.5l-151.5,-6.5l42.5,-90l-1,-25.5z", paper);
		seaZone2.drawElement();
		var seaZone3 = new SeaZone("m3.5,118.5l0.5,116l97,0l-4,-114.5l-93.5,-1.5z", paper);
		seaZone3.drawElement();
		var seaZone4 = new SeaZone("m102,235l149,2l-3.5,-111.5l-150.5,-6l5,115.5z", paper);
		seaZone4.drawElement();
		paper.zone_set = paper.setFinish();

		paper.coll = {};//new Array();
		paper.coll[0] = seaZone1;
		paper.coll[1] = seaZone2;
		paper.coll[2] = seaZone3;
		paper.coll[3] = seaZone4;

		//var zonetest = new Zone("m397,105l-72,50l72,73l100,-35l-11,-68l-83,26l14,-32l-20,-14z");
		var fighter = new Fighter(null, paper);
		fighter.drawElement();
	});


}


//fix for Raphael inheritance issue
Raphael.fn.fixNS = function(){
	var r = this;
	for (var ns_name in Raphael.fn) {
			var ns = Raphael.fn[ns_name];
			if (typeof ns == 'object') for (var fn in ns) {
					var f = ns[fn];
					ns[fn] = function(){ return f.apply(r, arguments); }
			}
	}
}

function getViewport() {

var viewPortWidth;
var viewPortHeight;

// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
if (typeof window.innerWidth != 'undefined') {
	viewPortWidth = window.innerWidth,
	viewPortHeight = window.innerHeight
}

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
else if (typeof document.documentElement != 'undefined'
&& typeof document.documentElement.clientWidth !=
'undefined' && document.documentElement.clientWidth != 0) {
		viewPortWidth = document.documentElement.clientWidth,
		viewPortHeight = document.documentElement.clientHeight
}

// older versions of IE
else {
	viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
	viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
}
return [viewPortWidth, viewPortHeight];
}
