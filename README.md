### Tweets 

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
