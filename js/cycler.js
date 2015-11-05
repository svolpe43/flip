
/*
 *  notification.js
 *
 *  This file is embedded into every web page and handles adding
 * 	little modal when a url changes.
 */

var class_name = "X7670h8I1fSg";
var duration = 2000;

var groups = [];
var cur_group = 0;
var cur_link = 0;

// listen to a notification
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		// catch the signal to remove the div
		if(request.removed){
			clearUI();
			return;
		}

		groups = request.groups;
		cur_group = request.group;
		cur_link = request.link;
		drawNotification();
});

function drawNotification(){
	clearUI();

	var html = drawGroups();

	var e = document.createElement('div');
	e.className = class_name;
	e.innerHTML = html;
	document.getElementsByTagName("body")[0].appendChild(e);
}

function clearUI(){
	var body = document.getElementsByTagName("body")[0];
	var div = document.getElementsByClassName(class_name)[0];
	if(div){
		body.removeChild(div);
	}
}

// creates an html string representing all data
function drawGroups(){
    if(groups.length > 0){
        var html = "";
        for (var i = 0; i < groups.length; i++)
            html += drawGroup(i);
        return html;
    }else{
        return "null bitch";
    }
}

// creates an html string for a single group
function drawGroup(group_index){
    var html = "<div class='group"
    if(cur_group == group_index)
        html += " active-group";
    html += "' id='group-" + group_index + "'>";
    html += "<h4 class='select-group'>" + groups[group_index].name + "</h4>";
    html += "<p class='group-path'>" + groups[group_index].path + "</p>";

    // draw all the links
    html += "<div class='links'>"
    for (var j = 0, len = groups[group_index].links.length; j < len; j++) {
        html += drawLink(group_index, j);
    }
    html += "</div></div>";

    return html;
}

// creates html string for a single link
function drawLink(group_index, link_index){
    // why the fuck do we need this
    if(groups[group_index].links[link_index] == null){
        return "null bitch";
    }
    var html = '<div class="link'
    if(cur_group == group_index && cur_link == link_index)
        html += " active-link";
    html += '" id="link-' + group_index + '-' + link_index + '">';
    html += '<h5 class="link-name select-link">' + groups[group_index].links[link_index].name + '</h5>';
    html += "</div>";
    return html;
}


