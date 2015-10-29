/*
 *  Flipper
 */

 /*
    todo
    - saving input for populating on next popup open
    - get the selects working
    - open a tab for ever damn link open (this means you have the group open). Selects set active.
    - hook up hot keys
        - on proc do something similar as ghostly as an alert of the url and name
    - jira integration for automatic group create based on current sprint
 */

var groups = [];
var logging = false;
var curEditGroup = null;
var curEditLink = null;

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

 function EditGroup(div, group){
    this.div = div;
    this.group = group;
 }

 function EditLink(div, group, link){
    this.div = div;
    this.group = group;
    this.link = link;
 }

// vanilla js
document.addEventListener('DOMContentLoaded', function() {
    // retrieve the data also calls render
    getData();
    getTopElements();

    // catch the hotkeys
    chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
    });
});

// save data to to chrome cross device storage
function saveData() {
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'data': groups}, function() {
    console.log('Saved');
  });
}

// get data from chrome cross device storage
function getData() {
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.get("data", function(data) {
    groups = data.data;
    render();
  });
}

// func: message; name path 
function flog(message, data){
    var str = "func: " + message + ";";
    for(var i = 0; i < data.length; i++)
        str += " " + data[i];
    console.log(str);
}

