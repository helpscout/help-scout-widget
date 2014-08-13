# Help Scout Feedback Widget

Finally.

### What is this?

Love [Help Scout](http://www.helpscout.net/) but wish they had an in-app feedback widget? Yeah, me too.

This is the in-app feedback widget you always wanted for Help Scout. Just give it your credentials and initialize it on your site. No dependencies (yet), and fully extensible.

### Usage

Grab the `helpscout.js` file and add that to your site:

  <script src="./helpscout.js"></script>

Initialize it with a fake API key and url root:

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


More coming soon :]


### Screenshots

![Widget opened](https://dl.dropboxusercontent.com/s/smci4bi1bb5un7b/help%20scout%20widget%20front.png)

![Widget success](https://dl.dropboxusercontent.com/s/smci4bi1bb5un7b/help%20scout%20widget%20back.png)
