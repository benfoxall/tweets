var Controller = require('./Controller.js');

// tweets get written to this object
var Writable = require('stream').Writable;
var util = require('util');
util.inherits(Tweets, Writable);

function Tweets(config){

  if(!(this instanceof Tweets)) return new Tweets(config);

  Writable.call(this, {objectMode: true});

  this.config = config;
  this.controller = new Controller(this, config)
}

Tweets.prototype.filter = function(params){
  this.controller.filter(params)
}

// for now, pass on all messages as tweets
Tweets.prototype._write = function(data, encoding, done){
  this.emit('tweet', data.text ? data.text : data);
  done();
}

module.exports = Tweets