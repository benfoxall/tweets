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
  this.emit('message', data)

  this.messageTypes.forEach(function(type){
    if(data[type]){
      this.emit(type, data)
    }
  }.bind(this))
  
  if(data.text){
    this.emit('tweet', data);  
  }

  done();
}

Tweets.prototype.messageTypes = 'delete scrub_geo limit status_withheld user_withheld disconnect warning'.split(' ');

module.exports = Tweets