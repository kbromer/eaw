'use strict';
window.onload = function(){
	console.log("Window loaded.");


	//connect socket
	eaw.socket = io.connect();
	eaw.socket.on('onconnected', function( data ) {
		//Note that the data is the object we sent from the server, as is. So we can assume its id exists.
		console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );


	//when a unit is dropped on another player's board
	//in the same game
	eaw.socket.on('unit_drop_notify', function (data){
		eaw.networkDropHandler(data);
	});
	eaw.socket.on('unit_dragging_notify', function (data){
		eaw.networkDragHandler(data);
	});


	});

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

		eaw.paper = new Snap('#canvas_container');
		eaw.paper.zone_set = new Array();
		eaw.paper.zonecount = 0;

		//enable draggability for non-canvas unit elements
		$("[id^='unit']").draggable();
		$("[id^='unit']").draggable("option", "helper", "clone");

    //Support DOM elements droppable to canvas
    $("#canvas_container").droppable({
        drop: function (event, ui) {
            var svgXY = eaw.getSvgCoordinates(event, eaw.paper);

						console.log('Dropped a ' + event.originalEvent.target.id);

					if (event.originalEvent.target !== undefined){
						var target_id = event.originalEvent.target.id;
						var unit_type = target_id.substr(0, target_id.indexOf('_'));
						var nation_type = target_id.match(/_([^ ]*)/)[1];
						var params = {myPath: null, myOwner: nation_type, myId: null};
						var new_unit = eaw.createUnit(unit_type, params);
						new_unit.drawElement();
						new_unit.el = new_unit.el.transform('t' + svgXY.x + ',' + svgXY.y);
						new_unit.el.data("Unit", new_unit);
						eaw.unitMouseupHandler(new_unit.el, event, false);
      		}
		  	}//close drop
    });

		$.get( "images/eaw.svg", function(data){
			console.log('Painting map...');
			$(data).find('path').each(function(){
				var path_string = $(this).attr("d");
				var zone_id = $(this).attr("id");
				var zone_data = ZoneProperties[zone_id];
				if (typeof zone_data == 'undefined')
					console.log(zone_id + ' was not found in the zone list.');
				if (zone_data["type"] == "sea"){
					var majorHarbor = zone_data["majorHarbor"];
					var zone = new SeaZone(path_string, eaw.paper, zone_id, majorHarbor);
					zone.drawElement();
					LAST_ZONE = zone.el;
					eaw.paper.zone_set[eaw.paper.zone_set.length] = zone.el;
					if (zone.major_harbor){
						var b = zone.el.getBBox();
						var x = b.x + (b.width/2);
						var y = b.y + (b.height/2);
						//load the anchor
						var anchor_path = 'M 20.00,17.50 C 20.00,17.50 20.00,12.50 20.00,12.50 20.00,12.50 15.00,12.50 15.00,12.50 15.00,12.50 16.37,13.87 16.37,13.87 15.27,15.70 13.43,17.01 11.25,17.38 11.25,17.38 11.25,9.82 11.25,9.82 13.40,9.27 15.00,7.33 15.00,5.00 15.00,2.24 12.76,0.00 10.00,0.00 7.24,0.00 5.00,2.24 5.00,5.00 5.00,7.33 6.60,9.27 8.75,9.82 8.75,9.82 8.75,17.38 8.75,17.38 6.57,17.01 4.73,15.70 3.63,13.87 3.63,13.87 5.00,12.50 5.00,12.50 5.00,12.50 0.00,12.50 0.00,12.50 0.00,12.50 0.00,17.50 0.00,17.50 0.00,17.50 1.53,15.97 1.53,15.97 3.36,18.46 6.56,20.03 10.00,20.00 13.43,20.03 16.64,18.46 18.47,15.97 18.47,15.97 20.00,17.50 20.00,17.50 Z M 10.00,7.50 C 8.62,7.50 7.50,6.38 7.50,5.00 7.50,3.62 8.62,2.50 10.00,2.50 11.38,2.50 12.50,3.62 12.50,5.00 12.50,6.38 11.38,7.50 10.00,7.50 Z';
						var anchor_el = eaw.paper.path(anchor_path).attr({stroke: 'black', fill: 'black', 'stroke-width': 1}).insertAfter(zone.el);
						anchor_el.transform('t' + x + ',' + y);
  				}
				}else{
				  var zone = new LandZone(path_string, eaw.paper, zone_id, zone_data["owner"], zone_data["hasFactory"], zone_data["pointValue"]);
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
						x=x-17;y=y-5;
					}else if (zone.name == 'Taranto'){
						y=y-30;x=x-15;
					}else if (zone.name == 'Athens'){
						x=x-15;
					}else if (zone.name == 'Valencia'){
						x=x-10;
					}else if (zone.name == 'Trondheim'){
						y=y+20;
					}else if (zone.name == 'Belgium'){
						y=y-10;
					}else if (zone.name == 'Brest'){
						y=y+10;
					}else if (zone.name == 'Bordeaux'){
						x=x+3;
					}else if (zone.name == 'Amman'){
						x=x-10;y=y+20;
					}else if (zone.name == 'Ryazan'){
						y=y+20;
					}else if (zone.name == 'Sevastapol'){
						x=x-10;
					}else if (zone.name == 'Poti'){
						x=x+10;
					}else if (zone.name == 'Astrakhan'){
						x=x-10;
					}else if (zone.name == 'Chisinau'){
						x=x+5;
					}
					if (zone.point_value > 0){
						eaw.paper.text(x,y+10, '(' + zone.point_value + ')').attr({ fontSize: '9px', "text-anchor": "middle", 'font-weight': 'bold', 'font-family': 'Comic Sans MS'});
						eaw.paper.text(x,y, zone.name).attr({ fontSize: '9px', "text-anchor": "middle", 'font-weight': 'bold', 'font-family': 'Arial Black'});
					}else{
						eaw.paper.text(x,y, zone.name).attr({ fontSize: '7px', "text-anchor": "middle"});
					}
				}
				LAST_ZONE = zone.el;
				eaw.paper.zone_set[eaw.paper.zone_set.length] = zone.el;
				eaw.game.ZONE_SET[eaw.game.ZONE_SET.length] = zone;
			});
			console.log('Map painting complete.');
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
