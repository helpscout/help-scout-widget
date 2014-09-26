
# Help Scout Widget Proxy

A proxy to support https://github.com/appcues/help-scout-widget

## Installation

### Configure the Proxy

1. This requires `php-curl` to be available in your php installation.
2. Copy `proxy.php` and `config.php` from this folder to your server.
3. Login to Help Scout and choose __Your Profile__ from the top right of the site
4. Choose __Api Keys__ and generate a new key named 'Proxy API Key'
5. Open the `config.php` file and paste that key into the `apiKey` value

### Configure the HTML

1. Copy the `helpscout.js` and `helpscout.css` from [https://github.com/appcues/help-scout-widget](https://github.com/appcues/help-scout-widget) onto your server. Include them in your html with the appropriate element tags.
2. Add the following to the bottom of your page inside a script tag:

```javascript
var scout = new HelpScout({
    apiKey: 'unused',
    getUrl: function() {
        return 'http://your-path-to-the/proxy/proxy.php';
    }
});

var supportWidget = scout.init({
    mailboxId: {{your-mailbox-id}} 
});
```

3. Update the `getUrl` path with the path to the proxy script.
4. Update the `mailboxId` with the mailbox id that you want the emails to go to. This id can be retrieved by looking it up via the api. You can use the following command from Curl to get a list of mailboxes: `curl -u your-api-key:X https://api.helpscout.net/v1/mailboxes.json`. If you have python installed, you can make this more readable with `curl -u your-api-key:X https://api.helpscout.net/v1/mailboxes.json | python -m json.tool` or by using a json beautifier website.

## Testing the Widget

You should now be able to open your site and visit a page with a support widget enabled and click a question mark icon in the bottom right corner. Supply an email and content in the pop up modal and click __Let us Know__. The JS will send a message to the proxy, and the proxy should respond with an HTTP 200 proxied from the Help Scout API and the modal should then display a success message to the customer.
