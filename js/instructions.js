$(document).ready(function(){
	var connection = new WebSocket("ws://athena.dialup.mit.edu:8000/photobooth/node/server.js", 'control-protocol');
	$("#photo_button").click(function(){
		connection.send("TakePhoto");
	})
	$("#return_button").click(function(){
		connection.send("Back");
	})
});