
# Help Scout Widget Proxy

A proxy to support https://github.com/appcues/help-scout-widget

## Installation

### Configure the Proxy

1. Copy `proxy_controller.rb` to your controllers folder and add a new `post` route for it in your `config/routes.rb` file.
3. Login to Help Scout and choose __Your Profile__ from the top right of the site
4. Choose __Api Keys__ and generate a new key named 'Proxy API Key'
5. Open the `proxy_controller.rb` file and paste that key into the `@api_key` variable

### Configure the HTML

1. Copy the `helpscout.js` and `helpscout.css` from [https://github.com/appcues/help-scout-widget](https://github.com/appcues/help-scout-widget) into their respective locations in your assets folder and include them as needed.
2. Add the following to the bottom of your page inside a script tag:

```javascript
var scout = new HelpScout({
    apiKey: 'unused',
    getUrl: function() {
        return 'http://your-path-to-the/proxy/proxy';
    }
});

var supportWidget = scout.init({
    mailboxId: {{your-mailbox-id}} 
});
```

3. Update the `getUrl` path with the path to the proxy route.
4. Update the `mailboxId` with the mailbox id that you want the emails to go to. This id can be retrieved by looking it up via the api. You can use the following command from Curl to get a list of mailboxes: `curl -u your-api-key:X https://api.helpscout.net/v1/mailboxes.json`. If you have python installed, you can make this more readable with `curl -u your-api-key:X https://api.helpscout.net/v1/mailboxes.json | python -m json.tool` or by using a json beautifier website.

You could also but the JS inside a little helper js file and surround it with a jQuery `$(function () {});` if you want to keep JS in your asset pipeline.

## Testing the Widget

You should now be able to open your site and visit a page with a support widget enabled and click a question mark icon in the bottom right corner. Supply an email and content in the pop up modal and click __Let us Know__. The JS will send a message to the proxy, and the proxy should respond with an HTTP 200 proxied from the Help Scout API and the modal should then display a success message to the customer.
