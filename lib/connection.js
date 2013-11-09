var TStream = require('./tStream.js');

function Connection(tweets, config){
  this.tweets = tweets;
  this.pending = 0; 
  this.backoffs();
}

Connection.prototype.backoffs = function(){
  this.linearBackoff      = backoff(10000, 320000, function(x){return x+1000});
  this.exponentialBackoff = backoff(250,   16000,  function(x){return x*2});
}

// initiate/modify filter connection
Connection.prototype.filter = function(params){
  this.params = params;
  this.connectThrottle();
}

// connect only twice per four minutes
Connection.prototype.connectThrottle = function(){
  if(this.pending > 1) return this.reconnect = true;
  this.pending ++;
  this.connect(0);

  var self = this;
  setTimeout(function(){
    self.pending--;
    if(self.reconnect){

    }
  }, 1000*60*4)
}

// leading edge, concurrency 2, throttle

// connect to the endpoint and link up with tweets, and set up for errors
Connection.prototype.connect = function(delay){
  this.stream = new TStream();
  // this.stream.on('error', bound(this.stream_error))
}

// Connection.prototype.stream_error = function(){
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


module.exports = Connection;



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