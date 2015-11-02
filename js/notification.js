
/*
 *  notification.js
 *
 *  This file is embedded into every web page and handles adding
 * 	little modal when a url changes.
 */

// listen to a notification
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		drawNotification(request.name, request.url);
});

function drawNotification(name, url){
	var html = "<h4>" + name + "</h4>";
	html += "<p>" + url + "</p>";

	var e = document.createElement('div');
	e.className = "X7670h8I1fSg";
	e.innerHTML = html;
	document.getElementsByTagName("body")[0].appendChild(e);
}


