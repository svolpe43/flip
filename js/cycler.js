
/*
 *  cycler.js
 *
 *  This file is embedded into every web page and handles adding
 * 	little modal to make it stupid easy to flip.
 */

var host_id = "X7670h8I1fSg";
var template_id = "Ftg53dwqxf4F";

var groups = [];
var cur_group = 0;
var cur_link = 0;

var css = "<style>.flip-container{background:#393939;border-radius:4px;position:fixed;bottom:5px;right:5px;opacity:.75;padding:7px;z-index:99999;display:block;width:160px}.flip-container h4,.flip-container h5,.flip-container p{color:#fff;margin:0;padding:0 2px;font-weight:100}.active-group{background:#000}.active-link{background:#0f0;border-radius:3px}.active-link h5{color:#000}.group{padding-top:1px;overflow:hidden}.group:hover{background:#000}.links{border:1px solid #fff;border-radius:3px;padding:1px 2px}.link:hover{color:#fff}</style>";

// group width is not working - weird border
// colors, colors, colors

/* Shadow

<div class="X7670h8I1fSg"></div>
<template id="Ftg53dwqxf4F">
    <style>css</style>
    <div class="flip-container"></div>
</template>

*/

// listen to back.js pushing cycler updates
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request);
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

// inject out html string into the body element
function drawNotification(){
	clearUI();

    // create the shadow elements
	var host = document.createElement('div');
    var template = document.createElement('template');

    console.log("hello");

    // set up the elements
	host.id = host_id;
    template.id = template_id;
	template.innerHTML = css + drawGroups();

    // inject shadow elements
	document.getElementsByTagName("body")[0].appendChild(host);
    document.getElementsByTagName("body")[0].appendChild(template);

    var shadow = host.createShadowRoot();
    var clone = document.importNode(template.content, true);
    shadow.appendChild(clone);
}

// rip our div out of the body element
function clearUI(){
	var shadow_host = document.getElementById(host_id);
    var shadow_template = document.getElementById(template_id);
	if(shadow_host){
		document.getElementsByTagName("body")[0].removeChild(shadow_host);
        document.getElementsByTagName("body")[0].removeChild(shadow_template);
	}
}

// creates an html string representing all data
function drawGroups(){
    if(groups.length > 0){
        var html = "<div class='flip-container'>";
        for (var i = 0; i < groups.length; i++)
            html += drawGroup(i);
        return html + "</div>";
    }else{
        return "null bitch";
    }
}

// creates an html string for a single group
function drawGroup(group_index){
    var html = "<div class='group"
    html += (cur_group == group_index) ? " active-group" : "";
    html += "' id='group-" + group_index + "'>";
    html += "<h4 class='select-group'>" + groups[group_index].name + "</h4>";
    html += "<p class='group-path'>" + groups[group_index].path + "</p>";

    // draw all the links
    html += "<div class='links'>"
    for (var j = 0, len = groups[group_index].links.length; j < len; j++)
        html += drawLink(group_index, j);
    html += "</div></div>";

    return html;
}

// creates html string for a single link
function drawLink(group_index, link_index){
    if(!groups[group_index].links[link_index])
        return "";

    var html = '<div class="link'
    html += (cur_group == group_index && cur_link == link_index) ? " active-link" : "";
    html += '" id="link-' + group_index + '-' + link_index + '">';
    html += '<h5 class="link-name select-link">' + groups[group_index].links[link_index].name + '</h5>';
    html += "</div>";
    return html;
}




