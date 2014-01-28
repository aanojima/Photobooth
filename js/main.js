var caman, filters, updateFilters;

$(document).ready(function() {

	var booleanA, booleanB, gObject = {}.hasOwnProperty;

	original_images_src = [];
	photo_count = 1;
	caman = null;
	filters = {};
	imageFilters = [];
	booleanA = false;
	booleanB = false;

	updateFilters = _.throttle(function(){
		var index = $("#canvas").attr("index");
		imageFilters[index] = filters;
		var filter, value;
		if (booleanA) {
			booleanB = true;
			return;
		} else {
			booleanB = false;
		}
		booleanA = true;
		caman.revert(false);
		for (var filter in filters) {
			if (!gObject.call(filters, filter)) {
				continue;
			}
			value = filters[filter];
			value = parseFloat(value, 10);
			if (value === 0) {
				continue;
			}
			caman[filter](value);
		}
		return caman.render(function () {
			$("#filmstrip img")[index].src = canvas.toDataURL('image/png');
			var filterstring = filtersToString(filters);
			$("#filmstrip img")[index].filterstring = filterstring;
			booleanA = false;
			if (booleanB) {
				return updateFilters();
			}
		});
	}, 300);

	function restoreImageFilter() {
		var index = $("#canvas").attr("index");
		var filter = imageFilters[index];
		for (var type in filter) {
			var value = filter[type];
			value = parseFloat(value, 10);
			if (value === 0) {
				continue;
			}
			caman[type](value);
		}
		caman.render();

	}
	
	// SOCKETS
	// var connection = new WebSocket("ws://athena.dialup.mit.edu:1234", 'control-protocol');
	// connection.onopen = function(event){
	// 	console.log("Connection open...");
	// }
	// connection.onclose = function(event){
	// 	console.log("Connection closed...");
	// }
	// connection.addEventListener("message", function(event) {
	// 	console.log(event.data);
	// 	results = event.data.split(",");
	// 	switch(results[0]){
	// 		case "TakePhoto":
	// 			countdown();
	// 			break;
	// 		case "Back":
	// 			goBack();
	// 			break;
	// 		case "PressEmail":
	// 			break;
	// 		case "SendEmail":
	// 			break;
	// 		case "CancelEmail":
	// 			break;
	// 		case "Facebook":
	// 			break;
	// 		case "Twitter":
	// 			break;
	// 	}
	// });

	$("#camera").css({"border" : "0px"});
	$(".editor").hide();
	$(".setting").show();

	var streaming	= false,
		video		= document.querySelector('#video'),
		canvas		= document.querySelector('#canvas'),
		width		= $("#video").width(),
		height		= $("#video").height(),
		data		= [],
		newdata,
		camal;

	navigator.getMedia = ( navigator.getUserMedia ||
						navigator.webkitGetUserMedia ||
						navigator.mozGetUserMedia ||
						navigator.msGetUserMedia);

	navigator.getMedia(
		{
			video: true,
			audio: false
		},
		function(stream) {
			
			// Create Video Feed
			if (navigator.mozGetUserMedia) {
				video.mozSrcObject = stream;
			} else {
				var vendorURL = window.URL || window.webkitURL;
				video.src = vendorURL.createObjectURL(stream);
			}
			
			// Start Video Feed
			video.play();
			var vendorURL = window.URL || window.webkitURL;
			video.src = vendorURL.createObjectURL(stream);

		},
		function(err) {
			console.log("An error occured! " + err);
		}
	);

	video.addEventListener('canplay', function(ev){
		
		// Other Initial Display Initializers
		$("#start_button").css("display", "inline-block");
		$("#settings_button").css({"display" : "inline-block", "height" : "50px", "width" : "200px"});
		$("#camera").css({"border" : "15px solid black"});
		
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth/width);
			streaming = true;
		}
	}, false);

	function countdown() {
		$(".pre-photo_button").attr("disabled", "disabled");
		var times = parseInt($("input[name='times']").val());
		if ($("input[name='countdown']").is(":checked")){
			$("#count3").fadeIn(500,function(){
				$("#count3").fadeOut(500,function(){
					$("#count2").fadeIn(500,function(){
						$("#count2").fadeOut(500,function(){
							$("#count1").fadeIn(500,function(){
								$("#count1").fadeOut(function(){
									multiplePhotos(times);
								});
							});
							// PLAY 3rd sound
						});
					});
					// PLAY 2nd sound
				});
			});
			// PLAY 1st sound
		} else {
			multiplePhotos(times);
		}
	}

	function multiplePhotos(times) {
		if (times == 0){
			// Animations for last picture
			$(".pre-photo_button").removeAttr("disabled");
			$(".pre-photo_button").css("display", "none");
			$("#settings_button").css({"width" : "110px", "height" : "50px"});
			$(".post-photo_button").css("display", "inline-block");
			$(canvas).attr("index", $("#filmstrip img").length - 1);
			caman = Caman("#canvas");
		}
		else { 
			// Take Picture and Repeat (recurse)
			takePicture();
			setTimeout(function(){multiplePhotos(times-1);}, 600);
		}
	}

	function takePicture() {

		// Animations
		// $("#camera").css({"border" : "15px solid white"});
		// $("#settings").css({"background" : "white"});
		// $("#settings_menu").css({"color" : "black"});
		$("#canvas").css('display', 'block');
		$("#video").css('display', 'none');
		$("#blackwhite").css({"background" : "white"});
		$("#blackwhite").fadeIn(200, function(){$("#blackwhite").fadeOut(200)})
		$(".setting").hide();
		$(".editor").show();
		$(".Filter").css("display", $("#settings").width() == 300 ? "block" : "none");
		
		// Capture Image from Video and Write to Canvas
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext('2d');
		ctx.drawImage(video, 0, 0, width, height);
		
		// var new_canvas = document.createElement("canvas");
		// new_canvas.width = width*0.185;
		// new_canvas.height = height*0.185;
		// var new_ctx = new_canvas.getContext('2d');
		// var num_canvas = parseInt($("input[name='times']").val());
		// new_ctx.drawImage(video, 0, 0, 0.185*width, (0.185)*height);
		// $(new_canvas).addClass("side_canvas");
		// var image = new Image();
		var img = document.createElement("img");
		$(img).height("20%");
		var filterstring = filtersToString({});
		$(img).attr("filterstring", filterstring);
		var index = $("#filmstrip img").length;
		new_src = canvas.toDataURL("image/png");
		img.src = new_src;
		original_images_src.push(new_src);
		imageFilters.push({});
		$(img).on("click", function(event){
			$("#canvas").removeAttr("data-caman-id");
			delete caman;
			var tempImg = document.createElement('img');
			tempImg.src = original_images_src[index];
			ctx.drawImage(tempImg, 0, 0);
			$(canvas).attr("index", index);
			caman = Caman("#canvas", function(){
				restoreImageFilter();
			});
		});
		document.getElementById("filmstrip").appendChild(img);
	}

	function goBack() {
		delete data;
		$("#blackwhite").css({"background" : "black"});
		$("#blackwhite").fadeIn(200, function(){
			$("#camera").css({"border" : "15px solid black"});
			$("#blackwhite").fadeOut(200);
			$("#video").css("display", "block");
			$("#canvas").css("display", "none");
			$("#settings").css({"background" : "black"});
			$("#settings_menu").css({"color" : "white"});
			$(".pre-photo_button").css("display", "inline-block");
			$(".post-photo_button").css("display", "none");
			$("#settings_button").css({"width" : "200px"});
			$("#email_form").modal('hide');
			$(".editor").hide();
			$(".setting").show();
			$(".Filter").css("display", "none");
			canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
			$("#canvas").removeAttr("data-caman-id");
			caman = null;
		});
		// TODO
		original_images_src = [];
		for (var i in imageFilters){
			delete imageFilters[i];
		}
		imageFilters = [];
		var filmstrip = $("#filmstrip")[0];
		for (var i = filmstrip.childNodes.length - 1; i >= 0; i--){
			var child = filmstrip.childNodes[i];
			filmstrip.removeChild(child);
		}
	}

	function inputEmail() {
		$("#modal-email").modal('show');
		// $('body').append($('<div id="lightbox-shadow"/>'))
	}

	function isEmail(email){
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	}

	function sendEmail() {
		var email = $("#email").val();
		console.log("email is"+email);
		if (!isEmail(email) || email == '' || email == null){
			$('#emailAlert').css('display', 'block');
			return;
		} 
		$("#modal-email").modal('hide');
		$.ajax({
			type : "POST",
			url : "php/send.php",
			data : {image : canvas.toDataURL('image/png'), address : email}, 
			success : function(response){
				console.log(response);
				//add notification
				// $("#email_form").css("display", "none");
				// $('#lightbox-shadow').hide();
			},
			error: function(response){
				console.log(response);
			}
		});
	}

	function inputCaption() {
		$("#modal-facebook").modal("show");
	}

	function shareToFacebook() {
		$("#send_caption, #caption").attr("disabled", "true");
		$("#facebook_header").html("Uploading please wait...");
		var caption = $("#caption").val();
		var page, album;
		FB.api("me/accounts", "GET", function(response){
			var token = response.data[0].access_token;
			var page = response.data[0].id;
			FB.api(page+"/albums", "GET", {access_token : token}, function(response){
				// Find the Album ID with name TechX Photobooth 2014
				var album;
				for (var i in response.data){
					if (response.data[i].name == "TechX Photobooth 2014"){
						album = response.data[i].id;
						console.log("Album: " + album);
						break;
					}
				}
				// Create New Album if it doesn't exist
				if (!album){
					FB.api(page+"/albums", "POST", {access_token : token, name : "TechX Photobooth 2014"}, function(response){
						var album = response.id;
					});
				}
				// Add Photo to Album
				$.ajax({
					method : "POST",
					url : "php/create_image_file.php",
					data : {"image" : canvas.toDataURL('image/png')},
					success : function(result){
						var filename = result;
						var path = "http://aanojima.scripts.mit.edu/photobooth/php/" + filename;
						console.log("Posting Photo: " + path);
						FB.api(album+"/photos", "POST", {access_token : token, url : path, name : caption}, function(response){
							if (response.id){
								alert("Your photo was successfully posted to MIT TechX's Facebook page!  ");
								$("#modal-facebook").modal("hide");
								$("#send_caption, #caption").removeAttr("disabled");
							} else {
								alert("Something seems to be wrong, please ask a TechX member for help.  ");
								$("#send_caption").removeAttr("disabled");
							}
							$("#facebook_header").html("If you would like to upload this photo to the MIT TechX Facebook page, please enter a caption for the photo.");
							$.ajax({
								method : "POST",
								url : "php/delete_image_file.php",
								data : {filename : filename}
							});
						});
					}
				});
			});
		});
	}

	function filtersToString(filters_input){
		var output = "";
		for (var filter in filters_input){
			var value = filters_input[filter];
			var addon = filter + ":" + value + ",";
			output += addon;
		}
		return output;
	}

	function stringToFilter(string_input){
		filters = {}
		var temp = string_input.split(",");
		for (var i in temp){
			var curr = temp[i].split(":");
			if (curr[0] == ''){
				continue;
			}
			var key = curr[0];
			var val = curr[1];
			filters[key] = val;
		}
		return filters;
	}

	// Event Listeners //

	$('#facebook_button').click(function(){
		inputCaption();
		return false;
	});

	$("#facebook_form").submit(function(){
		shareToFacebook();
		return false;
	});

	$("#send_caption").click(function(){
		shareToFacebook();
		return false;
	})

	$('#modal-email').on('hidden.bs.modal', function (e) {
		$('#emailAlert').css('display', 'none');
	});

	$('#email_form').submit(function(){
		sendEmail();
		return false;
	})

	$('#times').on('change keyup', function() {
		var sanitized = $(this).val().replace(/[^1-5]/g, '');
		if (parseInt(sanitized) < 1 || parseInt(sanitized) > 5){
			sanitized = '';
		}
		$(this).val(sanitized);
	});

	$(".FilterSetting input").each(function () {
		var filter;
		filter = $(this).data("filter");
		return filters[filter] = $(this).val()
	});

	$("#Filters").on("change", ".FilterSetting input", function () {
		var filter, value;
		filter = $(this).data("filter");
		value = $(this).val();
		filters[filter] = value;
		$(this).find("~ .FilterValue").html(value);
		return updateFilters("HI");
	});

	$("#settings_button").click(function(e){
		var opening = $("#settings").width() == 0;
		var postphoto = $("#canvas").css("display") == "block";
		var settings_width = opening ? "300px" : "0px";
		if (opening){
			$("#settings").animate({"width" : settings_width}, function(){
				if (postphoto){
					$(".Filter").css("display", "block");
				}
			});	
		} else {
			if (postphoto){
				$(".Filter").css({"display" : "none"});	
			}
			$("#settings").animate({"width" : settings_width});
		}
		
	});

	$("#mirrored").click(function(){
		$(this).is(":checked") ? $("#video, #canvas").css({"-webkit-transform" : "rotateY(180deg)"}) : $("#video, #canvas").css({"-webkit-transform" : "rotateY(0deg)"});
	});

	$("#start_button").click(function(e){
		countdown();
		e.preventDefault();
		return false;
	});

	$("#back_button").click(function(e){
		goBack();
		e.preventDefault();
		return false;
	});

	$("#send_button").click(function(e){
		inputEmail();
		e.preventDefault();
		return false;
	});

	$("#send_email").click(function(e){
		sendEmail();
		e.preventDefault();
		return false;
	});

});