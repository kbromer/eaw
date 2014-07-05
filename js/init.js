window.onload = function(){
	$.getScript("js/zones.js", function() {
  	console.log( "Load was performed." );


		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var paper = new Raphael(document.getElementById('canvas_container'), w, h);
		//fix raphael inheritance
		paper.fixNS();
		//enable draggability for elements on the Canvas
		paper.draggable.enable();
		var viewport = getViewport();

		paper.setViewBox(0, 0, w, h, false);
//    paper.canvas.setAttribute('preserveAspectRatio', 'none');
//		var zpd = new RaphaelZPD(paper, { zoom: true, pan: false, drag: false });
//	  paper.setViewBox(0, 0, 500, 600, true);
//		var background = paper.image('images/eaw.jpg', 0, 0, '100%', '100%');
//		background.node.draggable = false;

		var seaZone1 = new SeaZone("m397,105l-72,50l72,73l100,-35l-11,-68l-83,26l14,-32l-20,-14z", paper);
		seaZone1.drawZone();

		//var zonetest = new Zone("m397,105l-72,50l72,73l100,-35l-11,-68l-83,26l14,-32l-20,-14z");
		var zonetest = new Zone("M47.713,25.019l5.316-7.519c1.437-2.031,2.559-4.755,2.506-6.084c-0.054-1.33-1.177-2.45-2.511-2.506 c-1.333-0.054-4.06,1.067-6.091,2.504l-7.52,5.318L18.417,6.702c-2.244-1.072-5.196-0.517-6.592,1.243 c-1.396,1.76-0.967,4.463,0.958,6.04l16.784,13.748L17.019,41.635l-5.919-1.787c-2.381-0.721-5.048-0.611-5.954,0.242 c-0.907,0.854-0.07,2.809,1.869,4.368l5.371,4.318c0,0-0.202,0.939-0.453,2.098c-0.25,1.158,0.484,1.89,1.641,1.634l2.094-0.465 l4.315,5.369c1.56,1.939,3.516,2.777,4.37,1.872c0.853-0.905,0.963-3.569,0.242-5.951l-1.788-5.921l13.9-12.548l13.75,16.785 c1.576,1.925,4.28,2.354,6.04,0.957c1.759-1.396,2.316-4.349,1.243-6.594L47.713,25.019z", paper);
		zonetest.drawZone();
	});

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
