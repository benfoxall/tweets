// temporary stream implementation that doesn't do anything
var hackStream = require('./hackStream.js');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

util.inherits(Tweets, EventEmitter);

function Tweets(config){

  if(! this instanceof Tweets) return new Tweets(config)

  this.config = config;
}

Tweets.prototype.filter = function(params){

  if(this.tweet_stream) console.log("already connected, param changing not supported yet");

  this.tweet_stream = hackStream(this.config, params)

  var self = this;
  this.tweet_stream.on('data', function(d) {
    self.emit('tweet', d);
  });

}

module.exports = Tweets