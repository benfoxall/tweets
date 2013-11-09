// temporary stream implementation that doesn't do anything
var hackStream = require('./hackStream.js');
var Connection = require('./connection.js');
var Writable = require('stream').Writable;
var util = require('util');
// tweets get written to this object
util.inherits(Tweets, Writable);

function Tweets(config){

  if(!(this instanceof Tweets)) return new Tweets(config);

  Writable.call(this, {objectMode: true});

  this.config = config;
  this.connection = new Connection(this)

  var self = this;
  this.on('data', function(data){
    console.log("okok", data)
    self.emit('tweet', data)
  })
}

Tweets.prototype.filter = function(params){
  this.connection.filter(params)
}

// for now, pass on all messages as tweets
Tweets.prototype._write = function(data){
  this.emit('tweet', data);
}

module.exports = Tweets