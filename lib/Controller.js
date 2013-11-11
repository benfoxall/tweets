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
  this.linearBackoff      = backoff(10000, 320000, function(x){return x+1000});
  this.exponentialBackoff = backoff(250,   16000,  function(x){return x*2});
}

// initiate/modify filter connection
Controller.prototype.filter = function(params){
  this.params = params;
  this.connectThrottle();
}

// connect only once per 4 minutes
Controller.prototype.connectThrottle = function(){
  if(this.connectWait) return this.connectQueued = true;

  this.connectWait = true;
  this.connect();

  var self = this;
  setTimeout(function(){
    self.connectWait = false;
    if(self.connectQueued){
      self.connectQueued = false;
      self.connectThrottle()
    }
  }, 1000*60*4)
}



// connect to the endpoint and link up with tweets, and set up for errors
Controller.prototype.connect = function(){
  var self = this;
  new Connection(this.config, this.params, function(stream){
    stream.pipe(new Parser).pipe(self.tweets)
  });
}

// Controller.prototype.stream_error = function(){
//   try{

//     // if this error was 420, then reconnect after 2 minutes
//     this.connect(1000*60*2);

//     else
//     // http error, linear backoff
//     this.connect(this.linearBackoff());

//     else
//     // non http error, exponential backoff
//     this.connect(this.exponentialBackoff());

//   } catch (e BackoffFinished){
//     this.stream.emit('error', e)
//   }
// }


module.exports = Controller;



function backoff(current, max, step, _value){
  return function(){
    if((_value = current) > max) throw "error"
    current = step(current);
    return _value;
  }
}


// function errorHandler(error,extra){
//   console.log("handling error", error, extra);

//       if( error != 'http'){
//         if(extra == 420){
//           sleepFor(1000*60*2 /* two minutes */);
//         } else {
//           sleepFor(backoffs.lin.current);
//           backoffs.lin.current += backoffs.lin.min;
//         }
//       } else {
//         sleepFor(backoffs.exp.current);
//         backoffs.exp.current *= 2;
//       }
// };