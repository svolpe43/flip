/*
 *  back.js
 *
 *  This file is the background process. This runs continuously as
 *	long as Chrome is open. The data held on this page is the source of truth.
 * 	This process is the only communication to chrome's cross device storage.
 */

var groups = [];

start();

// need a group object
function Group(name, path){
  this.links = [];
  this.path = path;
  this.name = name
  this.tabId = -1;
  this.activeLink = "";
}

// need a link object?
function Link(name, path){
  this.name = name;
  this.path = path;
  this.full_url = "";
}

// setup the envirorment
function start(){
	console.log("now");
	get();

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	    sendResponse(dispatch(request));
	});
}

// save data to to chrome cross device storage
function save(){
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'data': groups}, function() {
    console.log('Saved');
  });
}

// get data from chrome cross device storage
function get(){
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.get("data", function(data) {
  	if(data.data){
  		groups = data.data;
  	}
  });
}

// log and out all the data
function flog(data){
    console.log(data);
}

// send the data to the correct action
function dispatch(data){
	if (true)
        flog(data);

	// disable until they use the data object correctly
	switch (data.action) {
	    case "add-group":
	        addGroup(data); break;
	    case "add-link":
	        addLink(data); break;
	    case "edit-group":
	        editGroup(data); break;
	    case "edit-link":
	        editLink(data); break;
	    case "remove-group":
	        removeGroup(data); break;
	    case "remove-link":
	        removeLink(data); break;
	    case "select-group":
	        selectGroup(data); break;
	    case "select-link":
	        selectLink(data); break;
	}
	save();
	return groups;
}

/* start of all crud stuff */

// add a group
function addGroup(data){
    groups.push(data.group);
}

// add a link
function addLink(data){
    groups[data.gindex].links.push(data.link);
}

// select group - if the tab for that group doesnt exist create one and set the url
function selectGroup(data){

    // if we found the tab set it to active
    var tab_id = groups[data.gindex].tabId;
    if(tab_id != -1){
        chrome.tabs.update(tab_id, {active: true});
    }else{
        chrome.tabs.create({
            url: groups[data.gindex].links[0].path
        }, function(tab){
        	console.log(tab);
            groups[data.gindex].activeLink = groups[data.gindex].links[0];
            groups[data.gindex].tabId = tab.id;
        });
    }
}

// changes the groups coresponding tab to the url specified by link
function selectLink(data){

    var url = groups[data.gindex].links[data.lindex].path;
    var tab_id = groups[data.gindex].tabId;

    if(tab_id == -1){
        alert("That group doesn't have a tab open.");
    }else{
        chrome.tabs.get(groups[data.gindex].tabId, function(tab){
            console.log(tab);
            chrome.tabs.update(tab.id, {
            	active: true,
            	url: groups[data.gindex].links[data.lindex].path
            });
            groups[data.gindex].activeLink = data.lindex;
        });
    }
}

// remove the group
function removeGroup(data){
    groups.splice(data.gindex, 1);
}

// remove the link
function removeLink(data){
    groups[data.gindex].links.splice(data.lindex, 1);
}

function editGroup(data){
    groups[data.gindex].name = data.group.name;
    groups[data.gindex].path = data.group.path;
}

function editLink(data){
    groups[data.gindex].links[data.lindex] = data.link;
}
