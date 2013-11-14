# Tweets 

[![Dependency Status](https://david-dm.org/benfoxall/tweets.png)](https://david-dm.org/benfoxall/tweets) [![Build Status](https://travis-ci.org/benfoxall/tweets.png?branch=master)](https://travis-ci.org/benfoxall/tweets)

This is a library for accessing the public/filter twitter streaming api.  Key features are:

* persistant connection (will re-connect in the background)
* mutable parameters

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

## Credentials

* Sign in to [https://dev.twitter.com/](https://dev.twitter.com/)
* Visit [My applications](https://dev.twitter.com/apps)
* click "create my access token"

## Rate limiting

Changing the search paramaters frequently may result in being rate limited. The [guidelines](https://dev.twitter.com/docs/streaming-apis/connecting#Rate_limiting) from twitter are:

> Twitter does not make public the number of connection attempts which will cause a rate limiting to occur, but there is some tolerance for testing and development. A few dozen connection attempts from time to time will not trigger a limit. However, it is essential to stop further connection attempts for a few minutes if a HTTP 420 response is received. If your client is rate limited frequently, it is possible that your IP will be blocked from accessing Twitter for an indeterminate period of time.

you can listen for rate-limit reconnects under the `reconnect` event

```js
stream.on('reconnect', function(reconnect){
  if(reconnect.type == 'rate-limit'){
    // do something to reduce your requests to the api
  }
});
```

## Events

#### `reconnect` - a new stream has been created

event.type will be one of:

* 'param-change' - result of tweets.filter()
* 'rate-limit' - reconnecting as a result of a 420 error
* 'http' - a general non-200 response
* 'network' - unable to connect to endpoint (eg. offline)

----

Message events, see [stream documentation](https://dev.twitter.com/docs/streaming-apis/messages) for details

#### `message` - all messages

#### `delete` - Status deletion notices

#### `scrub_geo` - Location deletion notices

#### `limit` - Limit notices

#### `status_withheld, user_withheld` - Withheld content notices

#### `disconnect` - Disconnect messages

#### `warning` - Stall warnings


## Licence

The MIT License (MIT)

Copyright (c) 2013 Ben Foxall

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
