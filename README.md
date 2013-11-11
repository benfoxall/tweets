# This doesn't work yet!
## Still messing about with a few things

### Tweets [![Build Status](https://travis-ci.org/benfoxall/tweets.png?branch=master)](https://travis-ci.org/benfoxall/tweets) [![Dependency Status](https://david-dm.org/benfoxall/tweets.png)](https://david-dm.org/benfoxall/tweets)


This is a library for accessing the public twitter streaming api.  Key features are:

* persistant connection (will re-connect in the background)
* mutable parameters
* it only has three features

## Usage

```js
var tweets = require('tweets');

var stream = new tweets({
  consumer_key:        'YOUR',
  consumer_secret:     'KEYS',
  access_token:        ' GO ',
  access_token_secret: 'HERE'
});

// start streaming the public twitter stream for pizza
stream.filter({track: 'pizza'});

stream.on('tweet', function(t){
  console.log("Got a tweet!", t);
});

setTimeout(function(){
  // after ten minutes, start looking for beer
  stream.filter({track: 'beer'});

},1000*60*10)
```

## Why

There are tonnes of twitter clients out there with more features.

## Licence

MIT
