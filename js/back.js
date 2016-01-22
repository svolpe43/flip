/*
 *  back.js
 *
 *  This file is the background process. This runs continuously as
 *	long as Chrome is open. The data held on this page is the source of truth.
 * 	This process is the only communication to chrome's cross device storage.
 */

var COMMIT_ACTION_DUR = 3000;

var groups = [];
var logging = false;

// cycler and actives
var cur_group = 0;
var cur_link = 0;
var new_group = 0;
var new_link = 0;
var commitTimeout = null;

start();

function Group(name, path){
  this.links = [];
  this.path = path;
  this.name = name
  this.tabId = 0;
  this.activeLink = 0;
}

function Link(name, path){
  this.name = name;
  this.path = path;
  this.full_url = "";
}

// keep the curernt indexes of thlahfhhrr
function CurrentStatus(group, link){
    this.group = group;
    this.link = link;
}

// setup the envirorment
function start(){
	getChromeData();

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	    sendResponse(dispatch(request, sender));
	});

    chrome.commands.onCommand.addListener(function(command) {
        handleHotKeys(command);
    });
}

function createTab(data){
    chrome.tabs.create({
        url: groups[data.gindex].links[data.lindex].path,
        pinned: true
    }, function(tab){
        groups[data.gindex].activeLink = data.lindex;
        groups[data.gindex].tabId = tab.id;
    });
}

function activateTab(data, tab_id){
    chrome.tabs.update(tab_id, {active: true}, function(){
        if(chrome.runtime.lastError){
            createTab(data)
        }
    });
}

function updateTab(data, tab_id){
    chrome.tabs.get(groups[data.gindex].tabId, function(tab){
        if(!chrome.runtime.lastError){
            chrome.tabs.update(tab.id, {
                active: true,
                url: groups[data.gindex].links[data.lindex].path
            });
            groups[data.gindex].activeLink = data.lindex;
        }
    });
}

// save data to to chrome cross device storage
function saveChromeData(){
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'data': groups}, function() {
    console.log('Saved');
  });
}

// get data from chrome cross device storage
function getChromeData(){
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.get("data", function(data) {
  	if(data.data){
  		groups = data.data;
  	}else{
        console.log("No data from Chrome.");
    }
  });
}

// send the data to the correct action
function dispatch(data, sender){
	if (logging)
        flog(data);

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
	saveChromeData();

    // so if you use a unrecognized action you get standard data
    // popup rendering uses this for data
	return {
        groups: groups,
        cur_link: cur_link,
        cur_group: cur_group};
}

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
    var tab_id = groups[data.gindex].tabId;
    
    activateTab(data, tab_id);

    cur_group = data.gindex;
    cur_link = data.lindex;
}

// changes the groups coresponding tab to the url specified by link
function selectLink(data){
    var url = groups[data.gindex].links[data.lindex].path;
    var tab_id = groups[data.gindex].tabId;

    activateTab(data, tab_id);
    updateTab(data, tab_id);

    cur_group = data.gindex;
    cur_link = data.lindex;
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

/* start hotkey stuff */
function handleHotKeys(command){
    switch (command) {
        case "open-cycler":
            openCycler();
            break;
        case "close-cycler":
            removeCycler();
            break;
    }
}

// this handles the logic for picking the next index
function getNext(variable, direction, max){
    if(direction == "up"){
        variable = (variable >= max - 1) ? 0 : variable + 1;
    }else if(direction == "down"){
        variable = (variable == 0) ? max - 1 : variable - 1;
    }
    return variable;
}

function openCycler(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs.length > 0){
            chrome.tabs.sendMessage(tabs[0].id, {
                open: true,
                groups: groups,
                group: cur_group,
                link: cur_link
            }, function(response){});
        }
    });
}

function removeCycler(){
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        for(var i = 0; i < tabs.length; i ++){
            chrome.tabs.sendMessage(tabs[i].id, {remove: true}, function(response){});
        }
    });
}

/* Debugging stuff */

// log and out all the data
function flog(data){
    console.log(data);
}

function n(){
    console.log("New Group: " + new_group + ", New Link: " + new_link)
}

function h(){
    console.log("Group: " + cur_group + ", Link: " + cur_link)
}

