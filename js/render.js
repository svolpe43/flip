/*
 *  Flipper
 *  A super cool way to store a chrome workspace
 */

// renders a list of groups and their links
function render(){
    console.log("Rendering..")

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
    console.log("Drawing group..");
    var html = "";
    html += "<div id='group-" + group_index + "'>";
    html += "<h4>" + groups[group_index].name + "</h4>";
    html += '<button class="remove-group">X</button>'
    html += "<p>" + groups[group_index].path + "</p>";
    html += '<button class="select-group">Select</button>';
    html += '<div class="links">';

    // draw all the links
    html += "<div id='group-links'><ul>"
    for (var j = 0, len = groups[group_index].links.length; j < len; j++) {
        html += drawLink(group_index, j);
    }
    html += "</div></div></div>";

    return html;
}

// creates html string for a single link
function drawLink(group_index, link_index){
    console.log(groups, group_index, link_index);
    console.log(groups[group_index]);
    var html = "";
    html += '<button class="remove-link">Remove</button>';
    html += '<h6>' + groups[group_index].links[link_index].name + '</h6>';
    html += '<p>' + groups[group_index].links[link_index].path + '</p>';
    html += '<button class="select-link">Select</button>';
    html += "</div>";
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
        select_link[i].addEventListener('click', function(){
          var info = this.id.split("-");
          selectLink(info[0], info[1])
        }, false);
    }

    // remove group
    var remove_group = document.getElementsByClassName('remove-group');
    for(i = 0; i < remove_group.length; i++) {
        remove_group[i].addEventListener('click', function(){
          removeGroup(this.id);
        }, false);
    }

    // remove link
    var remove_link = document.getElementsByClassName('remove-link');
    for(i = 0; i < remove_link.length; i++) {
        remove_link[i].addEventListener('click', function(){
          var info = this.id.split("-");
          removeLink(info[0], info[1]);
        }, false);
    }

    // set the collapse listener
    var collapse_button = document.getElementById("collapse-top");
    collapse_button.addEventListener('click', collapseTop);

    // set the expand listener
    var expand_button = document.getElementById("expand-top");
    expand_button.addEventListener('click', expandTop);
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