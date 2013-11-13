/* the connection to twitter */

var oauth = require('oauth');

function Connection(config, params, callback){

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

  return o.post(
    'https://stream.twitter.com/1.1/statuses/filter.json',
    config.access_token,
    config.access_token_secret,
    params, null
  )
}

module.exports = Connection;