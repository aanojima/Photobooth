window.fbAsyncInit = function() {
	// init the FB JS SDK
	FB.init({
		appId      : '1446347152251133',                        // App ID from the app dashboard
		status     : true,                                 // Check Facebook Login status
		xfbml      : true                                  // Look for social plugins on the page
	});

	function authenticateTECHX(){
		var ID = "131062133593889";
		var confirm;
		FB.login(function (response){
			FB.api('/100007607891152/accounts',function(apiresponse){
				var data = apiresponse['data'];
				confirm = data[0].id;
			});
		},{scope: ['manage_pages', 'publish_stream']});	
		if (confirm != ID){
			FB.logout(function(r){
				alert("INCORRECT TECHX FACEBOOK CREDENTIALS");
			});
		}
	}

	
	var confirm;
	FB.getLoginStatus(function(response){
		if (response.status != "unknown"){
			FB.logout(function(r){
				authenticateTECHX();
			});
		} else {
			authenticateTECHX();
		}
	});
	// location method data
	// Additional initialization code such as adding Event Listeners goes here
};

// Load the SDK asynchronously
(function(){
	 // If we've already installed the SDK, we're done
	 if (document.getElementById('facebook-jssdk')) {return;}

	// Get the first script element, which we'll use to find the parent node
	var firstScriptElement = document.getElementsByTagName('script')[0];

	// Create a new script element and set its id
	var facebookJS = document.createElement('script'); 
	facebookJS.id = 'facebook-jssdk';

	// Set the new script's source to the source of the Facebook JS SDK
	facebookJS.src = '//connect.facebook.net/en_US/all.js';

	// Insert the Facebook JS SDK into the DOM
	firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
}());