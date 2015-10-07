// **********************************************************************
// Flipper
// **********************************************************************

var groups = [];

// need a group object
function Group(name){
  this.urls = [];
  this.name = name
  this.tabId = 0;
}

// document.onReady but looks like were going vanilla js
document.addEventListener('DOMContentLoaded', function() {

    getData();

    // Listener for adding links
    var link_submit = document.getElementById("add-link")
    link_submit.addEventListener("click", addLink);

    // Listener for adding groups
    var group_submit = document.getElementById('add-group-submit');
    group_submit.addEventListener('click', function() {
        addGroup(document.getElementById("add-group").value);
    });

    // Set Up and start the new window application
    var set_up = document.getElementById('set-up');
    set_up.addEventListener('click', saveDataForSettingUp);

    // catch the hotkeys here
    chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
    });
});

// add a group
function addGroup(name){
    console.log("Adding Group: " + name)
    console.log(groups);
    groups.push(new Group(name));

    saveData();
    render()
}

// add a link
function addLink(group){
    console.log("Group: " + group);
    var url = document.getElementById("add-link").value
    console.log("Url: " + url);
    if(url != ""){
        groups[group].urls.push(url);
    }

    saveData();
    render()
}

// remove the group
function removeGroup(group){
    groups.splice(group, 1);
    render();
}
// remove the link
function removeLink(group, link){
    groups[group].urls.splice(link, 1);
    render();
}

// changes the groups coresponding tab to the url specified by link
function selectLink(group, link){
    // get the url to set
    var url = groups[group].urls[link];

    console.log(groups);
    chrome.tabs.get(groups[group].tabId, function(tab){
        console.log(tab);
        chrome.tabs.update(tab.id, {url: groups[group].urls[link]});
    });
}


// dope string of callbacks
// saveData() -> setUp()
// actually not the problem cause groups needs to be saved after the tabIds have been collected

// sets up the browser so flipper can do its shit
function setUp(){
    console.log("Setting up..")
    chrome.windows.create({state: "maximized"}, function(win){
        console.log(win);
        // loop through groups
        console.log(groups);
        for (var i = 0; i < groups.length; i++) {
            // create the new tab

            // cannot use i in here because async
            chrome.tabs.create({
                windowId: win.id,
                index: i,
                url: groups[i].urls[0]
            }, function(tab){
                console.log(tab.id);
                console.log(groups[tab.index].tabId)
                groups[tab.index].tabId = tab.id;
                saveData();
            });
        }


    });
}

// renders a list of groups and their links
function render(){
  console.log("Rendering..")
  // find the groups div
  var groups_div = document.getElementById("groups");

  // make a big html block representing list of groups
  html = "";

  // for each group we have
  for (var i = 0; i < groups.length; i++) {
    html += "<div id='group-" + i + "'>"
    html += "<h3 class='add-link-submit' id='" + i + "'>Group " + groups[i].name + "</h3>"
    html += "<p class='remove-group' id='" + i + "'>Remove</p>";

    // draw all the links
    html += "<div id='group-links'><ul>"
    for (var j = 0, len = groups[i].urls.length; j < len; j++) {
      html += "<li class='select-link' id='" + i + "-" + j + "'><p>" + groups[i].urls[j] + "</p></li>";
      html += "<p class='remove-link' id='" + i + "-" + j + "'>Remove</p>";
    }
    html += "</ul></div></div>"
  }

  // add the html to the page
  document.getElementById("groups").innerHTML = html;

  // set event listeners for each +
  sels = document.getElementsByClassName('add-link-submit');
  for(i = 0; i < sels.length; i++) {
      sels[i].addEventListener('click', function(){
        console.log(this.id);
        var group_index = this.id; 
        addLink(group_index);
      }, false);
  }

  // set event listeners for each +
  links = document.getElementsByClassName('select-link');
  for(i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function(){
        var info = this.id.split("-");
        selectLink(info[0], info[1])
      }, false);
  }

  // set event listeners for removing a gorup
  remove_group = document.getElementsByClassName('remove-group');
  for(i = 0; i < remove_group.length; i++) {
      remove_group[i].addEventListener('click', function(){
        removeGroup(this.id);
      }, false);
  }

  // set event listeners for removing a link
  remove_link = document.getElementsByClassName('remove-link');
  for(i = 0; i < remove_link.length; i++) {
      remove_link[i].addEventListener('click', function(){
        var info = this.id.split("-");
        removeLink(info[0], info[1]);
      }, false);
  }
}

// ******************************************************************
// Data writing to the chrome.sync storage
// ******************************************************************

// my only explaination for needing this is possibly making the saveData after
// each tab create slightly shorter, just short enough to get saved before being read in new window
function saveDataForSettingUp() {
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'data': groups}, setUp);
}

function saveData() {
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'data': groups}, function() {
    console.log('Saving..');

  });
}

function getData() {
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.get("data", function(data) {
    console.log('Retrieving..');
    groups = data.data;
    render();
  });
}

// ******************************************************************
// Blah
// ******************************************************************
