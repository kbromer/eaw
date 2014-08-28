'use strict';
window.onload = function(){
	console.log("Window loaded.");

/*  //CHANGES IMAGES INTO INLINE SVG - CONSIDER INSTEAD OF SEPARATE IMAGES
//FOR ALL OF THE COUNTRIES
  $('img.svg').each(function(){
            var $img = $(this);
            var imgID = $img.attr('id');
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

	setupBoard();


	$.getScript("js/elements.js", function() {
  	console.log( "Loading game elements..." );
		var g = new Game();
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var paper = new Snap('#canvas_container');//, 2048,1536);
		paper.zone_set = new Array();// = paper.set();
		paper.zonecount = 0;

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
						unitMouseupHandler(new_unit.el, event);
        }
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
				  var zone = new LandZone(path_string, paper, zone_id, zone_data["owner"]);
					zone.drawElement();
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
		});
	});
}//close window.onload()

function getSvgCoordinates(event, paper) {

	var x, y;

	x = event.pageX;
	y = event.pageY;

//	p.x = x;
//	p.y = y;
//	p = p.matrixTransform(m.inverse());

	x = x - 25;
	y = y - 25;

	x = parseFloat(x.toFixed(3));
	y = parseFloat(y.toFixed(3));

	return {x: x, y: y};
}

		function showMenuItem(selectedItem){
			console.log('called back');
			switch (selectedItem){
				case 'Units':
					$('.units_subnav').show();//.show('slide', {direction: 'down'}, 1000);
				break;
				case 'Tech':
					$('.tech_subnav').show();//.show('slide', {direction: 'down'}, 1000);
				break;
				case 'Cards':
				break;
				case 'Diplomacy':
				break;
				case 'Stats':
				break;

			}
		}
