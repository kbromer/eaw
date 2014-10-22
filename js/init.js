'use strict';
window.onload = function(){
	console.log("Window loaded.");

	var myUserId = /[^/]*$/.exec(location.href)[0];
	myUserId = myUserId.substring(1);
	eaw.io.connectToServer({userid: myUserId});

	//sets up:
	//1. navigation
	//2. menu bars
	//3. non canvas images
	eaw.ui.setupBoard();
	console.log("Board setup.");
	//load the elements so we can create zones
	//and setup unit behaviors - connect html dom elements w/ canvas ones
	$.getScript("js/eaw.elements.js", function() {
  	console.log( "Loading game elements..." );
/*
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
*/
		eaw.paper = new Snap('#canvas_container');
		eaw.paper.zone_set = new Array();
		eaw.paper.zonecount = 0;

		//enable draggability for non-canvas unit elements
		$("[id^='unit']").draggable();
		$("[id^='unit']").draggable("option", "helper", "clone");

    //Support DOM elements droppable to canvas
    $("#canvas_container").droppable({
				drop: function (event, ui) {
            var svgXY = eaw.ui.getSvgCoordinates(event, eaw.paper);
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

		//bind interface click handlers that need game elements
		$(".unit_nav_btn").click(function(event){

			var nation_to_hide = g.getCurrentNation().name;

			//shift one player in the game player array
			if (this.id == 'right_nav_btn'){
				var nation = g.nextNation();
			//shift one player down
			} else{
				var nation = g.previousNation();
			}

			eaw.ui.switchNation(nation);
		});//close binding of ui elements that require game elements


		//and finally, pop our load screen, or load the game
		//based on a cookie

		//if cookie exists, load the game that way
		//else{

		$('#gamestart_modal').modal('show', {backdrop: 'static'});
		//a new eaw game
		var g = new eaw.Game();
		eaw.game = g;
		eaw.zones.loadZones();


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
