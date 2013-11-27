$(document).ready(function() {

	var streaming = false,
		video        = document.querySelector('#video'),
		canvas       = document.querySelector('#canvas'),
		startbutton  = document.querySelector('#startbutton'),
		backbutton   = document.querySelector("#backbutton"),
		width = 720,
		height = 480;

	navigator.getMedia = ( 
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia
	);
		photo        = document.querySelector('#photo'),
		startbutton  = document.querySelector('#startbutton'),
		width = 320,
		height = 0;

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
			$("#startbutton").css("display", "block");
			var vendorURL = window.URL || window.webkitURL;
			video.src = vendorURL.createObjectURL(stream);
			}
			video.play();
		},
		function(err) {
			console.log("An error occured! " + err);
		}
	);

	video.addEventListener('canplay', function(ev){
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth/width);
			video.setAttribute('width', width);
			video.setAttribute('height', height);
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
  			streaming = true;
		}
	}, false);

	function takepicture() {
		$("#video").css('display', 'none');
		$("#canvas").css('display', 'block');
		$("#startbutton").css("display", "none");
		$("#backbutton").css("display", "block");
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(video, 0, 0, width, height);
		var data = canvas.toDataURL('image/png');
		console.log(data);
		$.ajax({
			type : "POST",
			url : "php/send.php",
			data : {image : data}, 
			success : function(response){
				console.log(response);
			}
		});
		// photo.setAttribute('src', data);
	}

	function goback() {
		$("#video").css("display", "block");
		$("#canvas").css("display", "none");
		$("#startbutton").css("display", "block");
		$("#backbutton").css("display", "none");
		photo.setAttribute('src', data);
	}

	startbutton.addEventListener('click', function(ev){
		takepicture();
		ev.preventDefault();
	}, false);

	backbutton.addEventListener('click', function(ev){
		goback();
		ev.preventDefault();
	}, false);
	
});