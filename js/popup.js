/*
 *  popup.js
 *
 *  This file is contains all the code to control the popup.
 */

var expanded = false;
var link_input_div;
var group_input_div;
var enable_group_edit_button;
var enable_link_edit_button;

var cur_group = -1;
var cur_link = -1;

var logging = false;
var curEditGroup = null;
var curEditLink = null;
var groups = [];

// need a group object
function Group(name, path){
  this.links = [];
  this.path = path;
  this.name = name
  this.tabId = 0;
  this.activeLink = 0;
}

// need a link object?
function Link(name, path){
  this.name = name;
  this.path = path;
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
    getGroups();
    getTopElements();
});

// renders a list of groups and their links
function render(_cur_group, _cur_link){

    cur_group = _cur_group;
    cur_link = _cur_link;

    // find the groups div
    groups_div = document.getElementById("groups");
    link_input_groups_div = document.getElementById("link-group");
    groups_div.empty;

    // add all the groups to the groups div
    groups_div.innerHTML = drawGroups(cur_group, cur_link);
    link_input_groups_div.innerHTML = groupOptions();

    setListeners();
}

function groupOptions(){
    var html = "";
    for(var i = 0; i < groups.length; i++)
        html += "<option value='" + i + "'>" + groups[i].name + "</option>";
    return html;
}

function drawGroups(){
    if(groups.length > 0){
        var html = "";
        for (var i = 0; i < groups.length; i++)
            html += drawGroup(i);
        return html;
    }else{
        return "null bitch";
    }
}

// creates an html string for a single group
function drawGroup(group_index){
    var html = "<div class='group"
    if(cur_group == group_index)
        html += " active-group";
    html += "' id='group-" + group_index + "'>";
    html += "<h4 class='select-group'>" + groups[group_index].name + "</h4>";
    html += "<p class='group-path'>" + groups[group_index].path + "</p>";
    html += '<img class="remove-group" src="res/cross.png" alt="Remove">';
    html += '<img class="edit-group" src="res/check.png" alt="Edit">';

    // draw all the links
    html += "<div class='links'>"
    for (var j = 0, len = groups[group_index].links.length; j < len; j++) {
        html += drawLink(group_index, j);
    }
    html += "</div></div>";

    return html;
}

// creates html string for a single link
function drawLink(group_index, link_index){
    // why the fuck do we need this
    if(groups[group_index].links[link_index] == null){
        return "null bitch";
    }
    var html = '<div class="link'
    if(cur_group == group_index && cur_link == link_index)
        html += " active-link";
    html += '" id="link-' + group_index + '-' + link_index + '">';
    html += '<h5 class="link-name select-link">' + groups[group_index].links[link_index].name + '</h5>';
    html += '<img class="remove-link" src="res/cross.png" alt="Remove">';
    html += '<img class="edit-link" src="res/check.png" alt="Edit">';
    html += "</div>";
    return html;
}

function drawGroupInput(group){
    html = '<input class="input" id="edit-group-name" type="text" value="' + groups[group].name + '">';
    html += '<input class="input" id="edit-group-path" type="text" value="' + groups[group].path + '">';
    html += '<button class="but submit-edit-group" id="' + group + '" type="button">Submit</button>';
    html += '<button class="but cancel-edit-group" id="' + group + '" type="button">Cancel</button>';
    return html;
}

function drawLinkInput(indexes){
    html = '<input class="input" id="edit-link-name" type="text" value="' + groups[indexes.group].links[indexes.link].name + '">';
    html += '<input class="input" id="edit-link-path" type="text" value="' + groups[indexes.group].links[indexes.link].path + '">';
    html += '<button class="but submit-edit-link" id="' + indexes.group + '-' + indexes.link + '" type="button">Submit</button>';
    html += '<button class="but cancel-edit-link" id="' + indexes.group + '-' + indexes.link + '" type="button">Cancel</button>';
    return html;
}

/*
    Animations
*/
function getTopElements(){
    link_input_div = document.getElementById("link-input");
    group_input_div = document.getElementById("group-input");
    enable_group_edit_button = document.getElementById("show-add-group");
    enable_link_edit_button = document.getElementById("show-add-link");
}

// handles logic of expanding and collapsing the top group div
function showAddGroup(){
    if(expanded){
        collapseTop(true, "group");
    }else{
        addGroupMode();
        expandTop("group");
    }
}

// handles logic of expanding and collapsing the top link div
function showAddLink(){
    if(expanded){
        collapseTop(true, "link");
    }else{
        addLinkMode();
        expandTop("link");
    }
}

// sets up the top div for editting a group
function addGroupMode(){
    link_input_div.style.display = "none";
    group_input_div.style.display = "inline-block";
    enable_link_edit_button.style.display = "inline";
    enable_group_edit_button.style.display = "none";
}

// sets up the top div for editting a link
function addLinkMode(){
    link_input_div.style.display = "inline-block";
    group_input_div.style.display = "none";
    enable_link_edit_button.style.display = "none";
    enable_group_edit_button.style.display = "inline";
}

// 
function closeTop(){
    collapseTop();
    enable_group_edit_button.style.display = "inline";
    enable_link_edit_button.style.display = "inline";
}

// expand the top
function expandTop(type){
    if(expanded)
        return;
    expanded = true;

    // the div
    var div = document.getElementById('input');
    var end = (type == "group") ? 110 : 80;

    function expand(){
        var cur = parseInt(getComputedStyle(div).height);
        setTimeout(function() {
            if (cur < end) {
                div.style.height = cur + 3 + 'px';
                expand();
            }
        }, 1);
    }
    expand();
}

// collapse the top
function collapseTop(reopen, type){
    if(!expanded)
        return;
    expanded = false;

    // the div
    var div = document.getElementById('input');
    var end = 0;

    function collapse(){
        var cur = parseInt(getComputedStyle(div).height);
        console.log(cur);
        setTimeout(function() {
            if (cur > end) {
                div.style.height = cur - 3 + 'px';
                collapse();
            }else{
                if(reopen){
                    if(type == "group")
                        addGroupMode();
                    else
                        addLinkMode();
                    expandTop(type);
                }
            }
        }, 1);
    }
    collapse();
}

// replace the group div with an editting ui
function editGroupMode(event){

    // get data needed
    var group_div = event.srcElement.parentNode;
    var group = getGroupInfo(event);

    // log if in loggin mode
    if (logging){
        var d = [group_div, group]; flog("edit-group", d);
    }

    // re draw the group of the last edit if there is one
    if(curEditGroup != null)
        curEditGroup.div.innerHTML = drawGroup(curEditGroup.group);
    curEditGroup = new EditGroup(group_div, group);

    // draw the group edit UI
    group_div.innerHTML = drawGroupInput(group);

    // reset the listeners
    setEditListeners();
    setEditSubmitListeners();
}

function cancelEditGroup(event){

    // get data
    var group = getGroupInfo(event);

    // log if in loggin mode
    if (logging){
        var d = [group]; flog("cancel-edit-group", d);
    }

    curEditGroup.div.innerHTML = drawGroup(group);
    setEditListeners();
}

// replace the link div with an editting ui
function editLinkMode(event){
    
    // get data needed
    var link_div = event.srcElement.parentNode;
    var indexes = getLinkInfo(event);

    // log if in loggin mode
    if (logging){
        var d = [link_div, indexes.group, indexes.link]; flog("edit-link", d);
    }

    // re draw the group of the last edit if there is one
    if(curEditLink != null)
        curEditLink.div.innerHTML = drawLink(curEditLink.group, curEditLink.link);
    curEditLink = new EditLink(link_div, indexes.group, indexes.link);

    // draw the link edit UI
    link_div.innerHTML = drawLinkInput(indexes);

    // reset the listeners
    setEditListeners();
    setEditSubmitListeners();
}

function cancelEditLink(event){

    // get data
    var indexes = getLinkInfo(event);

    // log if in loggin mode
    if (logging){
        var d = [indexes.group, indexes.link]; flog("cancel-edit-link", d);
    }

    curEditLink.div.innerHTML = drawLink(indexes.group, indexes.link);
    setEditListeners();
}

// extract the group index from the html
function getGroupInfo(event){
    return event.srcElement.parentNode.id.split("-")[1];
}

// extract the group and link index from html
function getLinkInfo(event){
    var indexes = event.srcElement.parentNode.id.split("-");
    return {
        group: indexes[1],
        link: indexes[2]
    };
}