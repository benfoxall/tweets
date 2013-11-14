var Connection = require('./Connection.js'),
    Parser = require('./Parser.js');

/* 
  Controller

  This takes care of opening a connection and re-opening it
  it the need arises.
*/

function Controller(tweets, config){
  this.tweets = tweets;
  this.config = config;
  this.backoffs();
}

Controller.prototype.backoffs = function(){
  this.networkBackoff  = backoff(0,     16000,  function(x){return x+250});
  this.httpBackoff     = backoff(5000,  320000, function(x){return x*2});
  this.rateBackoff     = backoff(60000, 320000, function(x){return x*2});
}

// initiate/modify filter connection
Controller.prototype.filter = function(params){
  this.params = params;
  if(this.connection){
    this.tweets.emit('reconnect', {type: 'param-change'})
  }
  this.connect();
}

// extracted for test stubbing
Controller.prototype.makeConnection = function(){
  return new Connection(this.config, this.params);
}

// connect to the endpoint and link up with tweets, and set up for errors

// TODO: tidy this up
Controller.prototype.connect = function(){
  var self = this;
  if(self.connection){
    // fire a reconnect
    self.connection.abort();
  } else {
    var connection = self.connection = self.makeConnection();
    self.connection.on('error', function(){
      
      self.connection.abort();
      self.connection = null;
      setTimeout(function(){
        self.connect();
      },self.networkBackoff());

      self.tweets.emit('reconnect', {type: 'network'})

    })
    self.connection.on('response', function(stream){
      // console.log(stream.statusCode)
      if(stream.statusCode === 420){

        self.connection.abort();
        self.connection = null;
        setTimeout(function(){
          self.connect();
        },self.rateBackoff());

        self.tweets.emit('reconnect', {type: 'rate-limit'})
        
        return;
      }

      if(stream.statusCode > 200){

        self.connection.abort();
        self.connection = null;
        setTimeout(function(){
          self.connect();
        },self.httpBackoff());

        self.tweets.emit('reconnect', {type: 'http'})

        return;
      }

      // reset backoffs
      self.backoffs();

      // close on heartbeat loss
      stream.on('data', (function(){
        var close = function(){
          if(connection === self.connection)
            connection.abort();
        }, timeout = setTimeout(close, 1000*90);

        return function(){        
          clearTimeout(timeout);
          timeout = setTimeout(close, 1000*90)
        }
      })());

      var tstream = stream.pipe(new Parser);
      tstream.pipe(self.tweets)
      self.connection.on('close', function(){
        tstream.unpipe(self.tweets);
        self.connection = null;
        self.connect();     
      });

    });
  }
}


module.exports = Controller;

function backoff(current, max, step, _value){
  return function(){
    if((_value = current) > max) throw "error"
    current = step(current);
    return _value;
  }
}
