var resetDefault = function(){}

var caman, filters, updateFilters;

$(document).ready(function() {

	var booleanA, booleanB, gObject = {}.hasOwnProperty;
	
	caman = null;
	filters = {};
	booleanA = false;
	booleanB = false;

	updateFilters = _.throttle(function(){
		var filter, value;
		if (booleanA) {
			booleanB = true;
			return;
		} else {
			booleanB = false;
		}
		booleanA = true;
		caman.revert(false);
		for (filter in filters) {
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
			booleanA = false;
			if (booleanB) {
				return updateFilters()
			}
		});
	}, 300);
	
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
		}
		else { 
			// Take Picture and Repeat (recurse)
			takePicture();
			setTimeout(function(){multiplePhotos(times-1);}, 600);
		}
	}

	function takePicture() {

		// Animations
		$("#camera").css({"border" : "15px solid white"});
		$("#settings").css({"background" : "white"});
		$("#settings_menu").css({"color" : "black"});
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
		var ctx = canvas.getContext('2d')
		ctx.drawImage(video, 0, 0, width, height);
		caman = Caman("#canvas");

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

	// function shareToFacebook() {
	// 	FB.getAuthResponse();
	// 	var wallPost = {
	// 		message : "testing...",
	// 		picture: "http://static.tumblr.com/44e684098f0ac7c33a6640c20556b923/jxahzkb/fZ5mod2rw/tumblr_static_dog-logo.jpg"
	// 	};
		
	// 	FB.api('/me/feed', 'post', wallPost , function(response) {
	// 		if (!response || response.error) {
	// 			alert('Error occured');
	// 		} else {
	// 			alert('Post ID: ' + response);
	// 		}
	// 	});
	// }

	// Event Listeners //

	$('#facebook_button').click(function(){
		var image = document.createElement("img");
		image.src = canvas.toDataURL('image/jpeg');
		document.body.appendChild(image);
	});

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
		return updateFilters();
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