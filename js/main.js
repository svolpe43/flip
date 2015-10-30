/*
 *  main.js
 *  
 *  This is the main page for a given popup instance.
 *  It creates and initiates the enviorment.
 */

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

