$(document).ready(function() {

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

	$('#modal-email').on('hidden.bs.modal', function (e) {
  		$('#emailAlert').css('display', 'none');
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