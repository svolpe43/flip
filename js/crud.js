/*
 *  Flipper
 *  A super cool way to store a chrome workspace
 */

// add a group
function addGroup(){
    console.log("Adding Group: " + name);

    var name = document.getElementById("group-name").value;
    var path = document.getElementById("group-path").value;

    // add group to main obj
    groups.push(new Group(name, path));

    // commit the change
    finish();
}

// add a link
function addLink(group){
    console.log("Adding Link");

    var name = document.getElementById("link-name").value;
    var path = document.getElementById("link-path").value;
    var group = document.getElementById("link-group").value;

    // check if the ui was empty
    if(path != ""){
        groups[group].links.push(new Link(name, path));
    }

    // commit the change
    finish();
}

// select group - if the tab for that group doesnt exist create one and set the url
function selectGroup(button){
    console.log("Selecting group..");

    var group = this.parentNode.id.split('-')[1];

    var tab_id = groups[group].tabId;

    // if we found the tab set it to active
    if(tab_id != -1){
        chrome.tabs.update(tab_id, {active: true});
    }else{
        chrome.tabs.create({
            url: groups[group].path + groups[group].links[0].path
        }, function(tab){
            conosle.log("Created: " + tab);
            groups[group].activeLink = groups[group].links[0];
        });
    }
}

// changes the groups coresponding tab to the url specified by link
function selectLink(group, link){
    console.log("Selecting link: " + link)

    // get the url to set
    var url = groups[group].links[link];

    console.log(groups);
    chrome.tabs.get(groups[group].tabId, function(tab){
        console.log(tab);
        chrome.tabs.update(tab.id, {url: groups[group].links[link]});
        groups[group].activeLink = link;
    });
}

// remove the group
function removeGroup(group){
    console.log("Remove group: " + group);

    groups.splice(group, 1);

    finish();
}

// remove the link
function removeLink(group, link){
    console.log("Remove link: " + link);

    groups[group].links.splice(link, 1);
    
    finish();
}

// save the data to the cross-browser memory and render the updated UI
function finish(){
	saveData();
    render();
}