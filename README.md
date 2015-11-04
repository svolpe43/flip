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
- strip all style form the injected div (may be fixed watch)
- bug - cur_link going NAN somewhere (may be fixed watch)
- saving input to populate on the next popup open
- show the active group and link (works needs UI update)
- jira integration for automatic group creation based on current sprint, use a content script to scrape the data
- after closing tab, reset the current group to one that is open (onRemove(selectGroup(group++))), dont think this is needed anymore