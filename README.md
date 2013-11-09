### Tweets

This is a library for accessing the public twitter streaming api.  Key features are:

* persistant connection (will re-connect in the background)
* mutable parameters
* it only has three features

## Usage

```js
var tweets = require('tweets');

var stream = new tweets({
  config: 'stuff',
  goes: 'here'
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