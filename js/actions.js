/*
 *  Flipper
 *  A super cool way to store a chrome workspace
 */

 var curEditGroup = null;
 var curEditLink = null;

 function EditGroup(div, group){
    this.div = div;
    this.group = group;
 }

 function EditLink(div, group, link){
    this.div = div;
    this.group = group;
    this.link = link;
 }

// add a group
function addGroup(){

    // get data needed
    var name = document.getElementById("group-name").value;
    var path = document.getElementById("group-path").value;

    // revert to logging if in loggin mode
    if (logging){
        var d = [name, path]; flog("add-group", d);
    }else{

    // add group to main obj
    groups.push(new Group(name, path));

    // commit the change
    finish();
}}

// add a link
function addLink(){

    // get data needed
    var name = document.getElementById("link-name").value;
    var path = document.getElementById("link-path").value;
    var group = document.getElementById("link-group").value;

    // revert to logging if in loggin mode
    if (logging){
        var d = [name, path, group]; flog("add-link", d);
    }else{

    // check if the ui was empty
    if(path != ""){
        groups[group].links.push(new Link(name, path));
    }

    // commit the change
    finish();
}}

// select group - if the tab for that group doesnt exist create one and set the url
function selectGroup(event){

    // get data needed
    var group = getGroupInfo(event);

    // revert to logging if in loggin mode
    if (logging){
        var d = [group]; flog("select-group", d);
    }else{

    // if we found the tab set it to active
    var tab_id = groups[group].tabId;
    if(tab_id != -1){
        chrome.tabs.update(tab_id, {active: true});
    }else{
        chrome.tabs.create({
            url: groups[group].links[0].path
        }, function(tab){
            conosle.log("Created: " + tab);
            groups[group].activeLink = groups[group].links[0];
        });
    }

    finish();
}}

// changes the groups coresponding tab to the url specified by link
function selectLink(event){

    // get data needed
    var indexes = getLinkInfo(event);

    // revert to logging if in loggin mode
    if (logging){
        var d = [indexes.group, indexes.link]; flog("select-link", d);
    }else{

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
}}

// remove the group
function removeGroup(event){

    // get data needed
    var group = getGroupInfo(event);

    // revert to logging if in loggin mode
    if (logging){
        var d = [group]; flog("remove-group", d);
    }else{

    groups.splice(group, 1);

    finish();
}}

// remove the link
function removeLink(event){

    // get data needed
    var indexes = getLinkInfo(event);

    // revert to logging if in loggin mode
    if (logging){
        var d = [indexes.group, indexes.link]; flog("remove-link", d);
    }else{

    groups[indexes.group].links.splice(indexes.link, 1);
    
    finish();
}}

// replace the group div with an editting ui
function editGroupMode(event){

    // get data needed
    var group_div = event.srcElement.parentNode;
    var group = getGroupInfo(event);

    // revert to logging if in loggin mode
    if (logging){
        var d = [group_div, group]; flog("edit-group", d);
    }else{

    // re draw the group of the last edit if there is one
    if(curEditGroup != null)
        curEditGroup.div.innerHTML = drawGroup(curEditGroup.group);
    curEditGroup = new EditGroup(group_div, group);

    // draw the group edit UI
    group_div.innerHTML = drawGroupInput(group);

    // reset the listeners
    setEditListeners();
    setEditSubmitListeners();
}}

// replace the link div with an editting ui
function editLinkMode(event){
    
    // get data needed
    var link_div = event.srcElement.parentNode;
    var indexes = getLinkInfo(event);

    // revert to logging if in loggin mode
    if (logging){
        var d = [link_div, indexes.group, indexes.link]; flog("edit-link", d);
    }else{

    // re draw the group of the last edit if there is one
    if(curEditLink != null)
        curEditLink.div.innerHTML = drawLink(curEditLink.group, curEditLink.link);
    curEditLink = new EditLink(link_div, indexes.group, indexes.link);

    // draw the link edit UI
    link_div.innerHTML = drawLinkInput(indexes);

    // reset the listeners
    setEditListeners();
    setEditSubmitListeners();
}}

function editGroup(event){
    // get data needed
    var group = event.srcElement.id;
    var name = document.getElementById("edit-group-name").value;
    var path = document.getElementById("edit-group-path").value;

    // revert to logging if in loggin mode
    if (logging){
        var d = [name, path, group]; flog("edit-group", d);
    }else{

    groups[group].name = name;
    groups[group].path = path;
    
    finish();
}}   

function editLink(event){
    // get data needed
    var data = event.srcElement.id.split("-");
    var indexes = {
        group: data[0],
        link: data[1], 
    };
    var name = document.getElementById("edit-link-name").value;
    var path = document.getElementById("edit-link-path").value;

    // revert to logging if in loggin mode
    if (logging){
        var d = [name, path, indexes.group, indexes.link]; flog("remove-link", d);
    }else{

    groups[indexes.group].links[indexes.link].name = name;
    groups[indexes.group].links[indexes.link].path = path;

    finish();
}}

// save the data to the cross-browser memory and render the updated UI
function finish(){
	saveData();
    render();
}

// extract the group index from the html
function getGroupInfo(event){
    return event.srcElement.parentNode.id.split("-")[1];
}

// extract the group and link index from html
function getLinkInfo(event){
    var indexes = event.srcElement.parentNode.parentNode.id.split("-");
    return {
        group: indexes[1],
        link: indexes[2]
    };
}