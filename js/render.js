/*
 *  Flipper
 *  A super cool way to store a chrome workspace
 */

// renders a list of groups and their links
function render(){
    console.log("rendering..");

    // find the groups div
    var groups_div = document.getElementById("groups");

    groups_div.empty;

    // add all the groups to the groups div
    var html = "";
    for (var i = 0; i < groups.length; i++) {
        html += drawGroup(i);
    }
    groups_div.innerHTML = html;

    linkGroupSelect();

    setListeners();
}

function linkGroupSelect(){
    var html = "";
    for(var i = 0; i < groups.length; i++){
        html += "<option value='" + i + "'>" + groups[i].name + "</option>";
    }
    document.getElementById("link-group").innerHTML = html;
}

// creates an html string for a single group
function drawGroup(group_index){
    var html = "<div class='group' id='group-" + group_index + "'>";
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
    var html = '<div class="link" id="link-' + group_index + '-' + link_index + '">';
    html += '<div class="link-title">';
    html += '<h5 class="link-name select-link">' + groups[group_index].links[link_index].name + '</h5>';
    html += '<img class="remove-link" src="res/cross.png" alt="Remove">';
    html += '<img class="edit-link" src="res/check.png" alt="Edit">';
    html += "</div></div>";
    return html;
}

function drawGroupInput(group){
    html = '<input id="edit-group-name" type="text" value="' + groups[group].name + '">';
    html += '<input id="edit-group-path" type="text" value="' + groups[group].path + '">';
    html += '<button class="submit-edit-group" id="' + group + '" type="button">Submit</button>';
    html += '<button class="submit-edit-group" id="' + group + '" type="button">Cancel</button>';
    return html;
}

function drawLinkInput(indexes){
    html = '<input id="edit-link-name" type="text" value="' + groups[indexes.group].links[indexes.link].name + '">';
    html += '<input id="edit-link-path" type="text" value="' + groups[indexes.group].links[indexes.link].path + '">';
    html += '<button class="submit-edit-link" id="' + indexes.group + '-' + indexes.link + '" type="button">Submit</button>';
    html += '<button class="submit-edit-link" id="' + indexes.group + '-' + indexes.link + '" type="button">Cancel</button>';
    return html;
}

// make sure all the listeners are hooked up
function setListeners(){
    console.log("Setting listeners..");

    // add group
    var add_group = document.getElementById('add-group');
    add_group.addEventListener('click', addGroup);

    // add link
    var add_link = document.getElementById("add-link")
    add_link.addEventListener("click", addLink);    

    // select group
    var select_group = document.getElementsByClassName('select-group');
    for(i = 0; i < select_group.length; i++) {
        select_group[i].addEventListener('click', selectGroup);
    }

    // set link
    var select_link = document.getElementsByClassName('select-link');
    for(i = 0; i < select_link.length; i++) {
        select_link[i].addEventListener('click', selectLink);
    }

    // remove group
    var remove_group = document.getElementsByClassName('remove-group');
    for(i = 0; i < remove_group.length; i++) {
        remove_group[i].addEventListener('click', removeGroup);
    }

    // remove link
    var remove_link = document.getElementsByClassName('remove-link');
    for(i = 0; i < remove_link.length; i++) {
        remove_link[i].addEventListener('click', removeLink);
    }

    setEditListeners();

    // set the collapse listener
    var collapse_button = document.getElementById("collapse-top");
    collapse_button.addEventListener('click', collapseTop);

    // set the expand listener
    var expand_button = document.getElementById("expand-top");
    expand_button.addEventListener('click', expandTop);
}

function setEditSubmitListeners(){
    // groups
    var submit_edit_group = document.getElementsByClassName('submit-edit-group')[0];
    console.log(submit_edit_group);
    if(submit_edit_group) submit_edit_group.addEventListener('click', editGroup);

    // links
    var submit_edit_link = document.getElementsByClassName('submit-edit-link')[0];
    if(submit_edit_link) submit_edit_link.addEventListener('click', editLink);
}

function setEditListeners(){
    // groups
    var edit_group = document.getElementsByClassName('edit-group');
    for(i = 0; i < edit_group.length; i++) {
        edit_group[i].addEventListener('click', editGroupMode);
    }

    // links
    var edit_link = document.getElementsByClassName('edit-link');
    for(i = 0; i < edit_link.length; i++) {
        edit_link[i].addEventListener('click', editLinkMode);
    }
}

// expand the top
function expandTop(){
    // the div
    var top = document.getElementById('top-input');

    // end width
    var end = 60;

    function expand(){
        var cur = parseInt(getComputedStyle(top).height);
        setTimeout(function() {
            if (cur < end) {
                top.style.height = cur + 4 + 'px';
                expand();
            }else{
                document.getElementById("expand-top").style.display = "none";
            }
        }, 5);
    }
    expand();
}

// collapse the top
function collapseTop(){
    // the div
    var top = document.getElementById('top-input');

    // end width
    var end = 0;

    function collapse(){
        var cur = parseInt(getComputedStyle(top).height);
        console.log(cur);
        setTimeout(function() {
            if (cur > end) {
                top.style.height = cur - 1 + 'px';
                collapse();
            }else{
                document.getElementById("expand-top").style.display = "inline";
            }
        }, 1);
    }
    collapse();
}