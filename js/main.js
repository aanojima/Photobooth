$(document).ready(function() {

	var streaming = false,
		video        = document.querySelector('#video'),
		canvas       = document.querySelector('#canvas'),
		startbutton  = document.querySelector('#start_button'),
		backbutton   = document.querySelector("#back_button"),
		sendbutton   = document.querySelector("#send_button"),
		editbutton   = document.querySelector("#edit_button"),
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
		$("#canvas").css('display', 'block');
		$("#white_flash").fadeIn(50, function(){$("#white_flash").fadeOut(200)})
		// TODO: Show Edit Menu
		$("#start_button").css("display", "none");
		$("#back_button").css("display", "inline-block");
		$("#send_button").css("display", "inline-block");
		$("#edit_button").css("display", "inline-block");
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(video, 0, 0, width, height);
		data = canvas.toDataURL('image/png');
		console.log(data);
	}

	function goBack() {
		$("#video").css("display", "block");
		$("#canvas").css("display", "none");
		$("#start_button").css("display", "block");
		$("#back_button").css("display", "none");
		$("#send_button").css("display", "none");
		$("#email_form").css("display", "none");
		// TODO: Hide Edit Menu
	}

	function inputEmail() {
		$("#email_form").toggle();
	}

	function sendEmail() {
		var email = $("#email").val();
		console.log(email,data);
		$.ajax({
			type : "POST",
			url : "php/send.php",
			data : {image : data, address : email}, 
			success : function(response){
				console.log(response);
				$("#email_form").css("display", "none");
			}
		});
	}

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
		ev.preventDefault
	}, false);

	sendemail.addEventListener('click', function(ev){
		sendEmail();
		ev.preventDefault();
	}, false);
	
});