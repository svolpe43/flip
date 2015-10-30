/*
 *  back.js
 *
 *  This file is the background process. This runs continuously as
 *	long as Chrome is open. The data held on this page is the source of truth.
 * 	This process is the only communication to chrome's cross device storage.
 */

 var UP = 0;
 var DOWN = 1;

var groups = [];
var cur_group = -1;
var cur_link = -1;

start();

function Group(name, path){
  this.links = [];
  this.path = path;
  this.name = name
  this.tabId = -1;
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
	console.log("now");
	getChromeData();

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	    sendResponse(dispatch(request));
	});

    chrome.commands.onCommand.addListener(function(command) {
        handleHotKeys(command);
    });
}

function createTab(data){
    chrome.tabs.create({
        url: groups[data.gindex].links[0].path
    }, function(tab){
        groups[data.gindex].activeLink = 0;
        groups[data.gindex].tabId = tab.id;
    });
}

function activateTab(data, tab_id){
    chrome.tabs.update(tab_id, {active: true}, function(){
        if(chrome.runtime.lastError){
            createTab(data)
        }else{
            groups[data.gindex].activeLink = data.lindex;
        }
    });
}

function alterTab(data, tab_id){
    chrome.tabs.get(groups[data.gindex].tabId, function(tab){
        if(chrome.runtime.lastError)
            console.log("Tab don't exist.");
        else{
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
	return groups;
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
    if(tab_id != -1){
        activateTab(data, tab_id)
    }else{
        createTab(data)
    }

    cur_group = data.gindex;
    cur_link = data.lindex;
}

// changes the groups coresponding tab to the url specified by link
function selectLink(data){

    var url = groups[data.gindex].links[data.lindex].path;
    var tab_id = groups[data.gindex].tabId;

    if(tab_id == -1){
        alert("That group doesn't have a tab open.");
    }else{
        alterTab(data, tab_id);
    }

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
        case "cycle-groups-up":
            cycleGroups("up"); break;
        case "cycle-groups-down":
            cycleGroups("down"); break;
        case "cycle-links-up":
            cycleLinks("up"); break;
        case "cycle-links-down":
            cycleLinks("down"); break;
    }
}

function cycleGroups(direction){
    if(groups.length < 1){
        return;
    }

    if(direction == "up"){
        if(cur_group == -1 || cur_group >= groups.length - 1){
            cur_group = 0;
        } else{
            cur_group++;
        }
    }else if(direction =="down"){
        if(cur_group == -1){
            cur_group = 0;
        }else if(cur_group == 0){
            cur_group = groups.length - 1;
        } else{
            cur_group--;
        }
    }

    activateTab({
        gindex: cur_group
    }, groups[cur_group].tabId);

    alterTab({
        gindex: cur_group,
        lindex: groups[cur_group].activeLink
    }, groups[cur_group].tabId);
}

function cycleLinks(direction){
    if(groups[cur_group].links[cur_link] < 1){
        return;
    }

    if(direction == "up"){
        if(cur_link == -1 || cur_link >= groups[cur_group].links.length - 1){
            cur_link = 0;
        } else{
            cur_link++;
        }
    }else if(direction =="down"){
        if(cur_link == -1){

        }else if(cur_link == 0){
            cur_link = groups[cur_group].links.length - 1;
        } else{
            cur_link--;
        }
    }

    activateTab({
        gindex: cur_group,
        lindex: cur_link
    }, groups[cur_group].tabId);

    alterTab({
        gindex: cur_group,
        lindex: cur_link
    }, groups[cur_group].tabId);

}

function h(){
    console.log("Group: " + cur_group + ", Link: " + cur_link)
}

// TODO - would be really cool (needed?)
function startModal(){

}

