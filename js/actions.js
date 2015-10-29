/*
 *  Flipper
 *  A super cool way to store a chrome workspace
 */

// add a group
function addGroup(){

    // get data needed
    var name = document.getElementById("group-name").value;
    var path = document.getElementById("group-path").value;

    // log if in loggin mode
    if (logging){
        var d = [name, path]; flog("add-group", d);
    }

    // add group to main obj
    groups.push(new Group(name, path));

    // commit the change
    finish();
}

// add a link
function addLink(){

    // get data needed
    var name = document.getElementById("link-name").value;
    var path = document.getElementById("link-path").value;
    var group = document.getElementById("link-group").value;

    // log if in loggin mode
    if (logging){
        var d = [name, path, group]; flog("add-link", d);
    }

    // check if the ui was empty
    if(path != "" && name != ""){
        groups[group].links.push(new Link(name, path));
    }

    // commit the change
    finish();
}

// select group - if the tab for that group doesnt exist create one and set the url
function selectGroup(event){

    // get data needed
    var group = getGroupInfo(event);

    /// log if in loggin mode
    if (logging){
        var d = [group]; flog("select-group", d);
    }

    // if we found the tab set it to active
    var tab_id = groups[group].tabId;
    if(tab_id != -1){
        chrome.tabs.update(tab_id, {active: true});
    }else{
        chrome.tabs.create({
            url: groups[group].links[0].path
        }, function(tab){
            alert("Created: " + tab);
            groups[group].activeLink = groups[group].links[0];
            groups[group].tabId = tab.id;
            saveData();

            chrome.runtime.sendMessage(tab, function(response) {});
        });
        
    }
    finish();
}

// changes the groups coresponding tab to the url specified by link
function selectLink(event){

    // get data needed
    var indexes = getLinkInfo(event);

    // log if in loggin mode
    if (logging){
        var d = [indexes.group, indexes.link]; flog("select-link", d);
    }

    // get the url to set
    var url = groups[indexes.group].links[indexes.link];

    var tab_id = groups[indexes.group].tabId;
    if(tab_id == -1){
        alert("That group doesn't have a tab open.");
    }else{
        chrome.tabs.get(groups[indexes.group].tabId, function(tab){
            console.log(tab);
            chrome.tabs.update(tab.id, {url: groups[indexes.group].links[indexes.link]});
            groups[group].activeLink = indexes.link;
        });
    }

    finish();
}

// remove the group
function removeGroup(event){

    // get data needed
    var group = getGroupInfo(event);

    // log if in loggin mode
    if (logging){
        var d = [group]; flog("remove-group", d);
    }

    groups.splice(group, 1);

    finish();
}

// remove the link
function removeLink(event){

    // get data needed
    var indexes = getLinkInfo(event);

    // log if in loggin mode
    if (logging){
        var d = [indexes.group, indexes.link]; flog("remove-link", d);
    }

    groups[indexes.group].links.splice(indexes.link, 1);
    
    finish();
}

function editGroup(event){
    // get data needed
    var group = event.srcElement.id;
    var name = document.getElementById("edit-group-name").value;
    var path = document.getElementById("edit-group-path").value;

    // log if in loggin mode
    if (logging){
        var d = [name, path, group]; flog("edit-group", d);
    }

    groups[group].name = name;
    groups[group].path = path;
    
    finish();
}

function editLink(event){
    // get data needed
    var data = event.srcElement.id.split("-");
    var indexes = {
        group: data[0],
        link: data[1], 
    };
    var name = document.getElementById("edit-link-name").value;
    var path = document.getElementById("edit-link-path").value;

    // log if in loggin mode
    if (logging){
        var d = [name, path, indexes.group, indexes.link]; flog("remove-link", d);
    }

    groups[indexes.group].links[indexes.link].name = name;
    groups[indexes.group].links[indexes.link].path = path;

    finish();
}

// save the data to the cross-browser memory and render the updated UI
function finish(){
    render();
	saveData();
}
