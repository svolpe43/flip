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