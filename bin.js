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