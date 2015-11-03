## Flipper
###### A chrome workspace navigation tool.

Flipper is a easy way to store and organize a bunch of frequently used urls. It creates an easy way
to "flip" between urls very easily while letting Flipper handle finding and changing the tabs for you.

### Installation
- Go to to the url "chrome://extensions/" or you can get to it throught the chrome settings
- Make sure you are in developer mode but checking the box in the top right corner
- Click load unpacked extension and choose the file that contains this code, and your done!
- To view the console on the background process, click the "background page" link under the Flipper extension on this page

#### TODO
- after closing tab, reset the current group to one that is open (onRemove(selectGroup(group++)))
- dont run notification on other pages, only respond to get-current when its a tab that we are controlling
- confirm navigating away from current url wont affect it when you cycle (definitely shouldn't if it does)
- bug - cur_link going NAN somewhere
- saving input to populate on the next popup open
- show the active group and link
- jira integration for automatic group creation based on current sprint, use a content script to scrape the data