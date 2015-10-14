/*
 *  Flipper
 */

var groups = [];

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
    console.log('Retrieving..');
    groups = data.data;
    render();
  });
}
