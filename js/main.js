$(document).ready(function() {
	var connection = new WebSocket("ws://athena.dialup.mit.edu:8000/photobooth/node/server.js", 'control-protocol');
	var streaming = false,
		video        = document.querySelector('#video'),
		canvas       = document.querySelector('#canvas'),
		startbutton  = document.querySelector('#start_button'),
		backbutton   = document.querySelector("#back_button"),
		sendbutton   = document.querySelector("#send_button"),
		sendemail    = document.querySelector("#send_email"),
		width = $("#video").width(),
		height = $("#video").height(),
		data;

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
			$("#start_button").css("display", "block");
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
		$("#count3").fadeIn(500,function(){
			$("#count3").fadeOut(500,function(){
				$("#count2").fadeIn(500,function(){
					$("#count2").fadeOut(500,function(){
						$("#count1").fadeIn(500,function(){
							$("#count1").fadeOut(takePicture);
						});
					});
				});
			});
		});
	}

	function takePicture() {

		// Capturing Image from Webcam
		$("#video").css('display', 'none');
		$("#canvas").fadeIn(1000);
		$("#white_flash").fadeIn(200, function(){$("#white_flash").fadeOut(200)})
		// TODO: Show Edit Menu
		$(".pre-photo_button").css("display", "none");
		$(".post-photo_button").css("display", "inline-block").fadeIn(200);
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(video, 0, 0, width, height);
		data = canvas.toDataURL('image/png');
		console.log(data);
	}

	function goBack() {
		$("#video").css("display", "block");
		$("#canvas").css("display", "none");
		$(".pre-photo_button").css("display", "block");
		$(".post-photo_button").css("display", "none");
		$("#email_form").modal('hide');
		// TODO: Hide Edit Menu
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
		console.log(email,data);
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


	connection.addEventListener("message", function(event) {
		console.log(event.data);
		results = event.data.split(",");
		switch(results[0]){
			case "TakePhoto":
				countdown();
				break;
			case "Back":
				goBack();
				break;
			case "PressEmail":
				break;
			case "SendEmail":
				break;
			case "CancelEmail":
				break;
			case "Facebook":
				break;
			case "Twitter":
				break;
		}
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