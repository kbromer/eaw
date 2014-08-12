window.onload = function(){
		console.log("Window loaded.");

		//hide the default hidden items on teh screen
		//before loading game engine so it doesn't appear broken
		$(".default_hide").hide();

	console.log("Unit tray setup complete.");


	$.getScript("js/GameElements.js", function() {
  	console.log( "Loading game elements..." );
		var g = new Game();
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		// var paper = new Raphael(document.getElementById('canvas_container'), w,h);
		var paper = new Raphael(document.getElementById('canvas_container'), 2048,1536);
		//fix raphael inheritance
		paper.fixNS();
		//enable draggability for elements on the Canvas
		paper.draggable.enable();
		paper.zonecount = 0;
		paper.setViewBox(0, 0, 2048, 1536, false);

		//enable draggability for DOM unit elements
		$("[id^='unit']").draggable();
		$("[id^='unit']").draggable("option", "helper", "clone");

    //Support DOM elements droppable to canvas
    $("#canvas_container").droppable({
        drop: function (event, ui) {
            var svgXY = getSvgCoordinates(event, paper);

						console.log('Dropped a ' + event.originalEvent.target.id);
						var target_id = event.originalEvent.target.id;
						var unit_type = target_id.substr(0, target_id.indexOf('_'));
						var nation_type = target_id.match(/_([^ ]*)/)[1];

						switch (unit_type){
							case 'fighter':
								new_unit = new Fighter(null, paper, nation_type);
								break;
							case 'armor':
								new_unit = new Armor(null, paper, nation_type);
								break;
							case 'infantry':
								new_unit = new Infantry(null, paper, nation_type);
								break;
							case 'carrier':
								new_unit = new Carrier(null, paper, nation_type);
								break;
							case 'artillery':
								new_unit = new Artillery(null, paper, nation_type);
								break;
							case 'sub':
								new_unit = new Submarine(null, paper, nation_type);
								break;
							case 'bomber':
								new_unit = new Bomber(null, paper, nation_type);
								break;
							case 'cruiser':
								new_unit = new Cruiser(null, paper, nation_type);
								break;
							case 'transport':
								new_unit = new Transport(null, paper, nation_type);
								break;
							case 'battleship':
								new_unit = new Battleship(null, paper, nation_type);
								break;
						}

						paper.setStart();
						new_unit.drawElement();
						paper.setFinish();
						new_unit.el.attr({transform: ['t', svgXY.x, svgXY.y]});

						new_unit.el.data("Unit", new_unit);
						console.log(new_unit.el.data("Unit"));

						unitMouseupHandler(new_unit.el);
        }
    });

//    paper.canvas.setAttribute('preserveAspectRatio', 'none');
//		var zpd = new RaphaelZPD(paper, { zoom: true, pan: false, drag: false });
//	  paper.setViewBox(0, 0, 500, 600, true);
//	var background = paper.image('images/eaw.jpg', 0, 0, '100%', '100%');
//		background.node.draggable = false;

		$.get( "images/eaw.svg", function(data){
			paper.setStart();
			$(data).find('path').each(function(){
				var path_string = $(this).attr("d");
				var zone_id = $(this).attr("id");
				var zone_data = ZoneProperties[zone_id];
				if (typeof zone_data == 'undefined')
					console.log(zone_id + ' was not found in the zone list.');
				if (zone_data["type"] == "sea"){
					var zone = new SeaZone(path_string, paper, zone_id);
					zone.drawElement();
				}else{
				  var zone = new LandZone(path_string, paper, zone_id, zone_data["owner"]);
					zone.drawElement();
				}
			});
			console.log('set finish');
			paper.zone_set = paper.setFinish();
		});

		//bind interface click handlers that need game elements
		$(".unit_nav_btn").click(function(event){

			var nation_to_hide = g.getCurrentNation().name;
			console.log('Hiding: ' + nation_to_hide);
			//shift one player in the game player array
			if (this.id == 'right_nav_btn'){
				var nation = g.nextNation();
			//shift one player down
			} else{
				var nation = g.previousNation();
			}

			$("div[id^='unit_']").each(function( index ) {
  			var old_id = $(this).attr("id");
				var new_id = old_id.substring(0, old_id.length - 2) + nation.name;
				$( this ).attr("id", new_id);
			});

			$("img[class^='unit_'], img[class^='icon_']").each(function( index ) {
				var old_src = $(this).attr("src");
				var image_type = old_src.substring(old_src.length - 3, old_src.length);
				var new_src = old_src.substring(0, old_src.length - 6) + nation.name + "." + image_type;
				$( this ).attr("src", new_src);
				var old_id = $(this).attr("id");
				var new_id = old_id.substring(0, old_id.length - 2) + nation.name;
				$( this ).attr("id", new_id);
			});

			switch (nation.name){
				case "de":
				$(".subnav").css("background", "linear-gradient(to right, gray, silver, gray)");
				break;
				case "uk":
				$(".subnav").css("background", "linear-gradient(to right, #A38967, tan, #A38967)");
				break;
				case "ru":
				$(".subnav").css("background", "linear-gradient(to right, #690000, #B30000, #690000)");
				break;
				case "fr":
				$(".subnav").css("background", "linear-gradient(to right, #526c7a, #92A7B3, #526c7a)");
				break;
				case "it":
				$(".subnav").css("background", "linear-gradient(to right, #FFC963,#EDD54E, #FFC963)");
				break;
				case "us":
				$(".subnav").css("background", "linear-gradient(to right, #228A00, #63C742, #228A00)");
				break;
			}
		});
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

function getSvgCoordinates(event, paper) {
	var mainsvg = paper.canvas;
	var m = mainsvg.getScreenCTM();
	var p = mainsvg.createSVGPoint();
	var x, y;

	x = event.pageX;
	y = event.pageY;

	p.x = x;
	p.y = y;
	p = p.matrixTransform(m.inverse());

	x = p.x - 25;
	y = p.y - 25;

	x = parseFloat(x.toFixed(3));
	y = parseFloat(y.toFixed(3));

	return {x: x, y: y};
}
