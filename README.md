# Help Scout Feedback Widget

> This project has been superseded by the embedded form that Help Scout now offers. Please see the new [Help Scout Beacon](http://www.helpscout.net/features/beacon/) for an easy to use embedded form. Please see [the developer documentation](http://developer.helpscout.net/beacons/) for more information.

> This library is considered deprecated and no longer in active development. We’ll be officially switching off the Mailbox API 1.0 that this widget uses on June 6th, 2019.

### What is this?

This is a self hosted in-app feedback widget for Help Scout. Just give it your credentials and initialize it on your site. No dependencies (yet), and fully extensible.

### Usage

Grab the `helpscout.js` file and add that to your site:

  <script src="./helpscout.js"></script>

Initialize it with a fake API key and url root:

```javascript
/**
 * At the moment, Help Scout doesn't allow client-side API requests, so you'll need
 * to create an API proxy that can make requests on your behalf using your private
 * API key.
 */
var scout = new HelpScout({
  apiKey: 'foo',
  getUrl: function() {
    return 'http://my-helpscout-proxy.com/feedback';
  }
});
```

Great job! Now you can use that `scout` instance to add feedback widgets to your site, like so:

```javascript
var supportWidget = scout.init({
  mailboxId: 5488,  // sends to your support mailbox.
  position: 'top-left'
});

var luciferWidget = scout.init({
  mailboxId: 666,  // sends to your lucifer mailbox.
  position: 'bottom-right'
});
```

They'll all use the same API key, but different chat bubbles will show up on the page which route to different mailboxes. To be honest, there probably isn't much practical use for that yet, but soon!

### API

#### Scout Instance
**init  scout.init(options)**
Creates and returns a new widget instance with the given options.

#### Widget Instance
**render  widget.render()**
Manually rerender the widget to it's original state.

**show  widget.show()**
Manually open the widget.

**hide  widget.hide()**
Manually close the widget.

**remove  widget.remove()**
Remove the widget from the DOM.

### Proxies

Help Scout does not currently support cross origin JavaScript requests. This widget will instead make a request to a small proxy script on your own server that will then send the request to the Help Scout API. This project includes two sample proxy scripts in the [php][php] and [rails][rails] folders. Please see the README.md in those folders for instructions.

_Please note that for the moment, the apiKey set in the JavaScript file is **not used** by the proxies. These proxies keep the key isolated to the server, and can be set in those files._


More coming soon :]


### Screenshots

![Widget opened](https://dl.dropbox.com/s/czxn3dtxrl68wwk/help%20scout%20widget%20front.png)

![Widget success](https://dl.dropboxusercontent.com/s/smci4bi1bb5un7b/help%20scout%20widget%20back.png)


[php]: https://github.com/appcues/help-scout-widget/tree/master/proxies/php
[rails]: https://github.com/appcues/help-scout-widget/tree/master/proxies/rails
