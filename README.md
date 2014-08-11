# Help Scout Feedback Widget

Finally.

### What is this?

Love [Help Scout](http://www.helpscout.net/) but wish they had an in-app feedback widget? Yeah, me too.

This is the in-app feedback widget you always wanted for Help Scout. Just give it your credentials and initialize it on your site. No dependencies (yet), and fully extensible.

### Usage

Grab the `helpscout.js` file and add that to your site:

  <script src="./helpscout.js"></script>

Initialize it with your API key:

    var scout = new HelpScout({
      apiKey: 'abcd1234'
    });


Great job! Now you can use that scout instance to add feedback widgets to your site, like so:

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

They'll all use the same API key, but different chat bubbles will show up on the page which route to differen mailboxes. To be honest, there probably isn't much practical use for that yet, but soon!


### API

Coming soon :]


### Screenshots

![Widget opened](https://dl.dropbox.com/s/1ewnxonl9tpstqj/Screenshot%202014-08-11%2013.21.36.png)

![Widget success](https://dl.dropbox.com/s/tv4ux56y5mqvvct/Screenshot%202014-08-11%2013.21.56.png)