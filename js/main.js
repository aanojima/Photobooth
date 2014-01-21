$(document).ready(function() {
	// var connection = new WebSocket("ws://athena.dialup.mit.edu:1234", 'control-protocol');
	// connection.onopen = function(event){
	// 	console.log("Connection open...");
	// }
	// connection.onclose = function(event){
	// 	console.log("Connection closed...");
	// }

	var filters = {
		"hue-rotate" : "(0deg)",
		"grayscale" : "(0%)",
		"sepia" : "(0%)",
		"blur" : "(none)",
		"invert" : "(0%)",
		"brightness" : "(100%)",
		"contrast" : "(100%)",
		"saturate" : "(100%)",
	}

	var streaming = false,
		video        = document.querySelector('#video'),
		canvas       = document.querySelector('#canvas'),
		startbutton  = document.querySelector('#start_button'),
		backbutton   = document.querySelector("#back_button"),
		sendbutton   = document.querySelector("#send_button"),
		sendemail    = document.querySelector("#send_email"),
		width = $("#video").width(),
		height = $("#video").height(),
		data = [];

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
			if (navigator.mozGetUserMedia) {
				video.mozSrcObject = stream;
			} else {
				var vendorURL = window.URL || window.webkitURL;
				video.src = vendorURL.createObjectURL(stream);
			}
			video.play();
			$("#start_button").css("display", "inline-block");
			$("#settings_button").css({"display" : "inline-block", "height" : "50px", "width" : "200px"});
			var vendorURL = window.URL || window.webkitURL;
			video.src = vendorURL.createObjectURL(stream);
		},
		function(err) {
			console.log("An error occured! " + err);
		}
	);

	video.addEventListener('canplay', function(ev){
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
						});
					});
				});
			});
		} else {
			multiplePhotos(times);
		}
	}

	function multiplePhotos(times) {
		if (times == 0){
			$(".pre-photo_button").removeAttr("disabled");
			$(".pre-photo_button").css("display", "none");
			$("#settings_button").css({"width" : "110px", "height" : "50px"});
			$(".post-photo_button").css("display", "inline-block");
		}
		else { 
			takePicture();
			setTimeout(function(){multiplePhotos(times-1);}, 600);
		}
	}

	function takePicture() {

		// Capturing Image from Webcam
		$("#settings").css({"background" : "white"});
		$("#canvas").css('display', 'block');
		$("#video").css('display', 'none');
		$("#blackwhite").css({"background" : "white"});
		$("#blackwhite").fadeIn(200, function(){$("#blackwhite").fadeOut(200)})
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(video, 0, 0, width, height);
		data.push(canvas.toDataURL('image/png'));

	}

	function goBack() {
		delete data;
		$("#blackwhite").css({"background" : "black"});
		$("#blackwhite").fadeIn(200, function(){
			$("#blackwhite").fadeOut(200);
			$("#video").css("display", "block");
			$("#canvas").css("display", "none");
			$("#settings").css({"background" : "black"});
			$(".pre-photo_button").css("display", "inline-block");
			$(".post-photo_button").css("display", "none");
			$("#settings_button").css({"width" : "200px"});
			$("#email_form").modal('hide');
			// TODO: Hide Edit Menu
		});
	}

	function compileFilterCSS(){
		var output = "";
		for (var name in filters){
			var value = filters[name];
			output = output + name + value + " ";
		}
		return output;
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
			data : {image : data, address : email}, 
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

	function shareToFacebook() {
		FB.getAuthResponse();
		var wallPost = {
			message : "testing...",
			picture: "http://static.tumblr.com/44e684098f0ac7c33a6640c20556b923/jxahzkb/fZ5mod2rw/tumblr_static_dog-logo.jpg"
		};
		
		FB.api('/me/feed', 'post', wallPost , function(response) {
			if (!response || response.error) {
				alert('Error occured');
			} else {
				alert('Post ID: ' + response);
			}
		});

		// FB.ui({
		// 	method: 'feed',
		// 	name: 'Techfair Photobooth',
		// 	link: 'https://www.facebook.com/appcenter/techxphotobooth',
		// 	picture: 'http://static.tumblr.com/44e684098f0ac7c33a6640c20556b923/jxahzkb/fZ5mod2rw/tumblr_static_dog-logo.jpg',
		// 	caption: 'Reference Documentation',
		// 	description: 'testing'
		// }, function(response) {
		// 	if (response && response.post_id) {
		// 		alert('Post was published.');
		// 	} else {
		// 		alert('Post was not published.');
		// 	}
		// });
	}

	$('#facebook_button').click(shareToFacebook);

	$('#modal-email').on('hidden.bs.modal', function (e) {
		$('#emailAlert').css('display', 'none');
	});
	$('#email_form').submit(function(){
		sendEmail();
		return false;
	})

	// Catch all events related to changes
	$('#times').on('change keyup', function() {
		// Remove invalid characters
		var sanitized = $(this).val().replace(/[^1-5]/g, '');
		if (parseInt(sanitized) < 1 || parseInt(sanitized) > 5){
			sanitized = '';
		}
		// Update value
		$(this).val(sanitized);
	});

	function changeCSS(selector){
		var filterName = $(selector).attr("name");
		var filterValue = $(selector).val();
		var filterUnit = $(selector).attr("unit");
		if (filterName == "blur" && filterValue == "0"){
			filter[filterName] = "(none)";
		} else {
			filters[filterName] = "(" + filterValue + filterUnit + ")";	
		}
		var newCSS = compileFilterCSS();
		$("#video, #canvas").css("-webkit-filter", newCSS);
	}

	$('.menu_item input[type="number"][class="filter"').on('change keyup', function(){
		changeCSS(this);
	})

	$(".menu_item input[type='range']").on('change', function(){
		changeCSS(this);
	})

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

	$("#settings_button").click(function(e){
		var settings_width = $("#settings").css("width") == "300px" ? "0px" : "300px";
		$("#settings").animate({"width" : settings_width});	
	});

	// $("#video, #canvas").click(function(e){
	// 	$("#settings").animate({"width" : "0px"});
	// })

	$("#menu_countdown").click(function(e){
		isCounting = $(this).is(":checked");
	})

	$(".filter").on('change', function(){
		var newValue = $(this).val();

	});

	startbutton.addEventListener('click', function(ev){
		countdown();
		ev.preventDefault();
	}, false);

	backbutton.addEventListener('click', function(ev){
		goBack();
		ev.preventDefault();
	}, false);

	sendbutton.addEventListener('click', function(ev){
		inputEmail();
		ev.preventDefault();
	}, false);

	sendemail.addEventListener('click', function(ev){
		sendEmail();
		ev.preventDefault();
	}, false);

});