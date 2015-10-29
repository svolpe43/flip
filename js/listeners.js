/*
 *  listeners.js
 *
 *  This file extracts all the ugly stuff taht you have to do
 *  inside of a chrome extension. There is no inline js(onclick),
 *  so this is necessary.
 */


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
    var show_add_group = document.getElementById("show-add-group");
    show_add_group.addEventListener('click', showAddGroup);

    // set the expand listener
    var show_add_link = document.getElementById("show-add-link");
    show_add_link.addEventListener('click', showAddLink);

    // set the expand listener
    var close_button = document.getElementById("close-top");
    close_button.addEventListener('click', closeTop);
}

function setEditSubmitListeners(){
    // group submit
    var submit_edit_group = document.getElementsByClassName('submit-edit-group')[0];
    console.log(submit_edit_group);
    if(submit_edit_group) submit_edit_group.addEventListener('click', editGroup);

    // group cancel
    var cancel_edit_group = document.getElementsByClassName('cancel-edit-group')[0];
    if(cancel_edit_group) cancel_edit_group.addEventListener('click', cancelEditGroup);

    // link submit
    var submit_edit_link = document.getElementsByClassName('submit-edit-link')[0];
    if(submit_edit_link) submit_edit_link.addEventListener('click', editLink);

    // link cancel
    var cancel_edit_link = document.getElementsByClassName('cancel-edit-link')[0];
    if(cancel_edit_link) cancel_edit_link.addEventListener('click', cancelEditLink);
}

// this is seperated into its own function so that we can call this when editting entities
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