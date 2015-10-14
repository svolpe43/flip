// catch the hotkeys
chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
});

"commands": {
  "cycle-groups-up": {
    "suggested_key": {
      "default": "Ctr+Tab+UpArrow",
      "mac": "Ctr+Tab+UpArrow"
    },
    "description": ""
  },
  "cycle-groups-down": {
    "suggested_key": {
      "default": "Ctr+Tab+DownArrow",
      "mac": "Ctr+Tab+DownArrow"
    },
    "description": "Toggle feature foo"
  },
  "cycle-links-up": {
    "suggested_key": {
      "default": "Ctr+Q+UpArrow",
      "mac": "Ctr+Q+UpArrow"
    },
    "description": "Toggle feature foo"
  },
  "cycle-links-down": {
    "suggested_key": {
      "default": "Ctr+Q+DownArrow",
      "windows": "Ctr+Q+DownArrow",
      "mac": "Ctr+Q+DownArrow",
      "chromeos": "Ctr+Q+DownArrow",
      "linux": "Ctr+Q+DownArrow"
    }
  }
}

<div id="groups">
    <div id="group-GROUPID">
        <button class="remove-group">Remove Group</button>
        <h3>Group Name</h3>
        <p>Group Path</p>
        <button class="select-group">Select Group</button>
        <div class="links">
            <div id="link-GROUPID-LINKID">
                <button class="remove-link">Remove Link</button>
                <h6>Link Name</h6>
                <p>Link Path</p>
                <button class="select-link">Select Link</button>
            </div>  
        </div>
    </div>
</div>