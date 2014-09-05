'use strict';
window.onload = function(){
	console.log("Window loaded.");


	//connect socket
	var socket = io.connect();


	//sets up:
	//1. navigation
	//2. menu bars
	//3. non canvas images
	eaw.setupBoard();
	console.log("Board setup.");
	//load the elements so we can create zones
	//and setup unit behaviors - connect html dom elements w/ canvas ones
	$.getScript("js/elements.js", function() {
  	console.log( "Loading game elements..." );

		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var paper = new Snap('#canvas_container');
		paper.zone_set = new Array();
		paper.zonecount = 0;

		//enable draggability for non-canvas unit elements
		$("[id^='unit']").draggable();
		$("[id^='unit']").draggable("option", "helper", "clone");

    //Support DOM elements droppable to canvas
    $("#canvas_container").droppable({
        drop: function (event, ui) {
            var svgXY = eaw.getSvgCoordinates(event, paper);

						console.log('Dropped a ' + event.originalEvent.target.id);

					if (event.originalEvent.target !== undefined){
						var target_id = event.originalEvent.target.id;
						var unit_type = target_id.substr(0, target_id.indexOf('_'));
						var nation_type = target_id.match(/_([^ ]*)/)[1];
						var new_unit = '';

						switch (unit_type){
							case 'fighter':
								new_unit = new Fighter(null, paper, nation_type, g);
								break;
							case 'armor':
								new_unit = new Armor(null, paper, nation_type, g);
								break;
							case 'infantry':
								new_unit = new Infantry(null, paper, nation_type, g);
								break;
							case 'carrier':
								new_unit = new Carrier(null, paper, nation_type, g);
								break;
							case 'artillery':
								new_unit = new Artillery(null, paper, nation_type, g);
								break;
							case 'sub':
								new_unit = new Submarine(null, paper, nation_type, g);
								break;
							case 'bomber':
								new_unit = new Bomber(null, paper, nation_type, g);
								break;
							case 'cruiser':
								new_unit = new Cruiser(null, paper, nation_type, g);
								break;
							case 'transport':
								new_unit = new Transport(null, paper, nation_type, g);
								break;
							case 'battleship':
								new_unit = new Battleship(null, paper, nation_type, g);
								break;
						}

						new_unit.drawElement();
						new_unit.el = new_unit.el.transform('t' + svgXY.x + ',' + svgXY.y);
						new_unit.el.data("Unit", new_unit);
						eaw.unitMouseupHandler(new_unit.el, event);
      		}
		  	}//close drop
    });

		$.get( "images/eaw.svg", function(data){
			$(data).find('path').each(function(){
				var path_string = $(this).attr("d");
				var zone_id = $(this).attr("id");
				var zone_data = ZoneProperties[zone_id];
				if (typeof zone_data == 'undefined')
					console.log(zone_id + ' was not found in the zone list.');
				if (zone_data["type"] == "sea"){
					var zone = new SeaZone(path_string, paper, zone_id);
					zone.drawElement();
					LAST_ZONE = zone.el;
					paper.zone_set[paper.zone_set.length] = zone.el;
				}else{
				  var zone = new LandZone(path_string, paper, zone_id, zone_data["owner"], zone_data["hasFactory"], zone_data["pointValue"]);
					zone.drawElement();
					var b = zone.el.getBBox();
					var x = b.x + (b.width/2);
					var y = b.y + (b.height/2);

					//make text adjustments as needed based on the zone
					if (zone.name == 'Bristol'){
						y=y+20;x=x+15;
					}else if (zone.name == 'Newcastle'){
						y=y-10;x=x+5;
					}else if (zone.name == 'Hamburg'){
						y=y+20;x=x+10;
					}else if (zone.name == 'Ireland'){
						x=x+10;
					}else if (zone.name == 'Denmark'){
						x=x-15;
					}else if (zone.name == 'Konigsberg'){
						y=y+20;x=x+5;
					}else if (zone.name == 'Danzig'){
						y=y+25;
					}else if (zone.name == 'Leipzig'){
						x=x-15;
					}else if (zone.name == 'Debrecen'){
						y=y-10;x=x-20;
					}else if (zone.name == 'Thessalonika'){
						x=x-20;y=y-5;
					}else if (zone.name == 'Taranto'){
						y=y-30;x=x-15;
					}else if (zone.name == 'Athens'){
						x=x-15;
					}else if (zone.name == 'Valencia'){
						x=x-10;
					}else if (zone.name == 'Trondheim'){
						y=y+20;
					}


					if (zone.point_value > 0){
						paper.text(x,y+10, '(' + zone.point_value + ')').attr({ fontSize: '9px', "text-anchor": "middle", 'font-weight': 'bold', 'font-family': 'Comic Sans MS'});
						paper.text(x,y, zone.name).attr({ fontSize: '9px', "text-anchor": "middle", 'font-weight': 'bold', 'font-family': 'Arial Black'});
					}else{
						paper.text(x,y, zone.name).attr({ fontSize: '7px', "text-anchor": "middle"});
					}


					LAST_ZONE = zone.el;
					paper.zone_set[paper.zone_set.length] = zone.el;
				}
			});
			console.log('Zone drawing complete.');
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
				$(".subnav").css("background", "linear-gradient(to right, transparent, gray, transparent)");
				break;
				case "uk":
				$(".subnav").css("background", "linear-gradient(to right, transparent, tan, transparent)");
				break;
				case "ru":
				$(".subnav").css("background", "linear-gradient(to right, transparent, crimson, transparent)");
				break;
				case "fr":
				$(".subnav").css("background", "linear-gradient(to right, transparent, blue, transparent)");
				break;
				case "it":
				$(".subnav").css("background", "linear-gradient(to right, transparent, yellow, transparent)");
				break;
				case "us":
				$(".subnav").css("background", "linear-gradient(to right, transparent, green, transparent)");
				break;
			}
		});//close binding of ui elements that require game elements


		//and finally, pop our load screen, or load the game
		//based on a cookie

		//if cookie exists, load the game that way
		//else{

		$('#gamestart_modal').modal('show', {backdrop: 'static'});
		//a new eaw game
		var g = new eaw.Game();
		eaw.game = g;



	});//close elements loading callback
}//close window.onload()



		/*

			//CHANGES IMAGES INTO INLINE SVG - CONSIDER INSTEAD OF SEPARATE IMAGES
		//FOR ALL OF THE COUNTRIES
			$('img.svg').each(function(){
								var $img = $(this);
								var imgID = $img.parent().attr('id');
								console.log('Image id: ' + imgID);
								var imgClass = $img.attr('class');
								var imgURL = $img.attr('src');

								$.get(imgURL, function(data) {
										// Get the SVG tag, ignore the rest
										var $svg = $(data).find('svg');

										// Add replaced image's ID to the new SVG
										if(typeof imgID !== 'undefined') {
												$svg = $svg.attr('id', imgID);
										}
										// Add replaced image's classes to the new SVG
										if(typeof imgClass !== 'undefined') {
												$svg = $svg.attr('class', imgClass+' replaced-svg');
										}
										// Remove any invalid XML tags as per http://validator.w3.org
										$svg = $svg.removeAttr('xmlns:a');

										// Replace image with new SVG
										$img.replaceWith($svg);
								}, 'xml');
						});*/
