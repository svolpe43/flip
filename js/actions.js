/*
 *  actions.js
 *  This file holds the crud logic to talk to the background process.
 */

// pack the information into an object and ship it to request()
function ship(message, group, link, gindex, lindex){
    request({
        action: message,
        group: group,
        link: link,
        gindex: gindex,
        lindex: lindex
    });
}

// send the request to the background page
function request(data){
    chrome.runtime.sendMessage(data, function(response) {
        if(response != null){
            groups = response.groups;
        }
        render(response.cur_group, response.cur_link);
    });
}

/* Start of actions */

// retrieve the groups from the background
function getGroups(){
    ship("get-groups");
}

// add a group
function addGroup(){
    var name = document.getElementById("group-name").value;
    var path = "";

    if(name == "")
        alert("Can't leave things blank, common.");

    ship("add-group", new Group(name, path));
}

// add a link
function addLink(){
    var name = document.getElementById("link-name").value;
    var group = document.getElementById("link-group").value;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        path = tabs[0].url;

        if(name == "")
            alert("Can't leave things blank, common.");

        ship("add-link", "", new Link(name, path), group);
    });
}

// select group - if the tab for that group doesnt exist create one and set the url
function selectGroup(event){
    var group = getGroupInfo(event);
    ship("select-group", {}, {}, group, 0);
}

// changes the groups coresponding tab to the url specified by link
function selectLink(event){
    var indexes = getLinkInfo(event);
    ship("select-link", {}, {}, indexes.group, indexes.link);
}

// remove the group
function removeGroup(event){
    var group = getGroupInfo(event);
    ship("remove-group", {}, {}, group);
}

// remove the link
function removeLink(event){
    var indexes = getLinkInfo(event);
    ship("remove-link", {}, {}, indexes.group, indexes.link);
}

function editGroup(event){
    var group = event.srcElement.id;
    var name = document.getElementById("edit-group-name").value;
    var path = "";

    if(name == "")
        alert("Can't leave things blank, common.");

    ship("edit-group", new Group(name, path), {}, group);
}

function editLink(event){
    var indexes = getLinkInfo(event);
    var name = document.getElementById("edit-link-name").value;
    var path = document.getElementById("edit-link-path").value;

    if(path == "" || name == "")
        alert("Can't leave things blank, common.");

    ship("edit-link", {}, new Link(name, path), indexes.group, indexes.link);
}
