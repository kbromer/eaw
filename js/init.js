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

		$("#fighter_img").draggable();
		$("#fighter_img").draggable("option", "helper", 'clone' );

		$("#armor_img").draggable();
		$("#armor_img").draggable("option", "helper", 'clone' );


		//-------------------- Code for Raphael---------------------

    // Making SVG droppable
    $("#canvas_container").droppable({
        drop: function (event, ui) {
            var svgXY = getSvgCoordinates(event, paper);
					console.log(event.originalEvent.target /*"Window X: " + event.originalEvent.target.x + "Window Y: " + event.originalEvent.target.y + "SVG X: " + svgXY.x + "SVG Y: " + svgXY.y*/);
						console.log(event.originalEvent.target.id);
				//	var fighterpathstring = "M" + svgXY.x + "," + svgXY.y + "M`47.713,25.019l5.316-7.519c1.437-2.031,2.559-4.755,2.506-6.084c-0.054-1.33-1.177-2.45-2.511-2.506 c-1.333-0.054-4.06,1.067-6.091,2.504l-7.52,5.318L18.417,6.702c-2.244-1.072-5.196-0.517-6.592,1.243 c-1.396,1.76-0.967,4.463,0.958,6.04l16.784,13.748L17.019,41.635l-5.919-1.787c-2.381-0.721-5.048-0.611-5.954,0.242 c-0.907,0.854-0.07,2.809,1.869,4.368l5.371,4.318c0,0-0.202,0.939-0.453,2.098c-0.25,1.158,0.484,1.89,1.641,1.634l2.094-0.465 l4.315,5.369c1.56,1.939,3.516,2.777,4.37,1.872c0.853-0.905,0.963-3.569,0.242-5.951l-1.788-5.921l13.9-12.548l13.75,16.785 c1.576,1.925,4.28,2.354,6.04,0.957c1.759-1.396,2.316-4.349,1.243-6.594L47.713,25.019z";
						var target_id = event.originalEvent.target.id;

						var new_unit;
						switch (target_id){
							case 'fighter':
								new_unit = new Fighter(null, paper);
								break;
							case 'armor':
								new_unit = new Armor(null, paper);
								break;
						}


						paper.setStart();
						new_unit.drawElement();
						paper.setFinish();
						new_unit.el.attr({transform: ['t', svgXY.x, svgXY.y]});
						unitMouseupHandler(new_unit.el);
						///someElement.attr({transform: ['t',100,100]});
						//newfighter.el.attr({x: svgXY.x, y: svgXY.y});
						// get targeted SVG elemnet by
            // event.originalEvent.target
        }
    });

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

		//var zonetest = new Zone("m397,105l-72,50l72,73l100,-35l-11,-68l-83,26l14,-32l-20,-14z");
/*		paper.setStart();
		var fighter = new Fighter(null, paper);
		fighter.drawElement();

				var fighter2 = new Fighter(null, paper);
				fighter2.drawElement();

		paper.unit_set = paper.setFinish();*/
	});
}//close window.onload()

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

function getSvgCoordinates(event, paper) {
	var mainsvg = paper.canvas;
	alert(mainsvg);
	var m = mainsvg.getScreenCTM();
	var p = mainsvg.createSVGPoint();
	var x, y;

	x = event.pageX;
	y = event.pageY;

	p.x = x;
	p.y = y;
	p = p.matrixTransform(m.inverse());

	x = p.x;
	y = p.y;

	x = parseFloat(x.toFixed(3));
	y = parseFloat(y.toFixed(3));

	return {x: x, y: y};
}
