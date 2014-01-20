$(document).ready(function(){
	var connection = new WebSocket("ws://athena.dialup.mit.edu:1234", 'control-protocol');
	connection.onopen = function(event){
		console.log("Connection opened...");
	}
	connection.onclose = function(event){
		console.log("Connection closed");
	}
	$("#photo_button").click(function(){
		connection.send("TakePhoto");
	})
	$("#return_button").click(function(){
		connection.send("Back");
	})
});