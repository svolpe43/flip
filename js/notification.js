
/*
 *  notification.js
 *
 *  This file is embedded into every web page and handles adding
 * 	little modal when a url changes.
 */

var class_name = "X7670h8I1fSg";
var duration = 2000;

request({
    action: "get-current"
});

// listen to a notification
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		drawNotification(request.name, request.url);
});

function drawNotification(name, url){
	clearNoti();

	var html = "<h4>" + name + "</h4>";
	html += "<p>" + url + "</p>";

	var e = document.createElement('div');
	e.className = class_name;
	e.innerHTML = html;
	document.getElementsByTagName("body")[0].appendChild(e);
}

// send the request to the background page
function request(data){
    chrome.runtime.sendMessage(data, function(response) {
        if(response != null){
        	console.log(response);
         	drawNotification(response.name, response.path);
         	setTimeout(clearNoti, duration);
        }
    });
}

function clearNoti(){
	var body = document.getElementsByTagName("body")[0];
	var div = document.getElementsByClassName(class_name)[0];
	if(div){
		body.removeChild(div);
	}
}


