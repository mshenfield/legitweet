# legitweet
Easily create a locale aware tweet for your cause. Inspired by the tweet card at [Stop Daylight Savings Time](stopdst.com).

`legitweet` use's the IP address of a visitor, and Sunlight Foundations Congress API to generate a tweet
to your visitor's national representatives.

This project uses [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) which is only supported in later versions of Firefox and Chrome. Consider using this [fetch pollyfill](https://github.com/github/fetch) for cross browser support.

## Usage
Include a script tag and `legitweet` is ready to use.

```html
<script src='/your/local/copy/of/legitweet.js'></script>
<script>
  var myTweetButton = document.getElementById('tweetButton');
  var myTweetCard = document.getElementById('tweetCard');
  var legitweetPromise = legitweet("Support our cause", "abc123456789", "somecause.org", ["participate"]);
  legitweetPromise.then(function(tweetData) {
    myTweetButton.setAttribute('href', tweetData.tweetUrl);
    myTweetCard.textContent = tweetData.tweetText;
  }).catch(function(error){
    console.error(error));
  });
</script>
```

We recommend treating the location aware handles as a progressive enhancement - that is make sure your site still functions if you don't have this! For example, initialize your tweet button or card with your message and hashtags, and append the `twitterHandlesString` to the resulting message or button url when `legitweet` returns. If you are relying on this information, make sure to use `catch` to appropriately handle any exceptions.

## API
The source code is only one file. Check it out for detailed API information.

## Services
This use two free projects maintained through donations. If you like what they do, consider giving time, money, or
development effort:

* [Free GeoIP](http://freegeoip.net)
* [Sunlight Foundation](https://sunlightfoundation.com)

##  License
[MIT](https://opensource.org/licenses/MIT)
