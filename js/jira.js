setTimeout(getLinks, 2000);

function getLinks(){
	var link_divs = document.getElementsByClassName("ghx-sprint-group")[0].getElementsByClassName("js-key-link");
	var name_divs = document.getElementsByClassName("ghx-sprint-group")[0].getElementsByClassName("ghx-summary");
	var links = [];
	for(var i = 0; i < link_divs.length; i++){
		links.push({
			name: link_divs[i].innerHTML + " - " + name_divs[i].title,
			path: link_divs[i].href}
			);
	}

	// listen for requests and respond with this links array
	console.log(links);
}

