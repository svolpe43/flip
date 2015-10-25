/*
 *  Flipper
 */


 /*
    todo
    - saving input for populating on next popup open
    - changing location of link info to remove parentNode x2
    - right click menu for all the crud options
        - easy way to pass html data
        - can add edit on without getting cluttered looking
    - get the selects working
 */

var groups = [];
var logging = false;

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

// vanilla js
document.addEventListener('DOMContentLoaded', function() {
    // retrieve the data also calls render
    getData();
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

