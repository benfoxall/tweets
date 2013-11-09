/**
This is a hacky (but working) interface to the twitter stream.
**/


var oauth = require('oauth');
var Transform = require('stream').Transform;

function HackStream(config, params){

  var tweetParser = new Transform( { objectMode: true } )

  tweetParser._transform = function (chunk, encoding, done) {
       var data = chunk.toString('utf8').trim();
       try{
         var obj = JSON.parse(data)
         this.push(obj)
       } catch (e){}
       done()
  }

 var o = new oauth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    config.consumer_key,
    config.consumer_secret,
    '1.0', null, 'HMAC-SHA1', null,
    {
      'Accept': '*/*',
      'Connection': 'close',
      'User-Agent': 'node-tweets'
    });

  var request = o.post(
    'https://stream.twitter.com/1.1/statuses/filter.json',
    config.access_token,
    config.access_token_secret,
    params, null
  )
  request.on('response', function(response) {
    response.pipe(tweetParser);
  });


  return tweetParser;
}

module.exports = HackStream