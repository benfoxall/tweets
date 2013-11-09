function Connection(tweets, config){
  this.tweets = tweets;
  this.backoffs();
}

Connection.prototype.backoffs = function(){
  this.linearBackoff      = backoff(10000, 320000, function(x){return x+1000});
  this.exponentialBackoff = backoff(250,   16000,  function(x){return x*2});
}

// initiate/modify filter connection
Connection.prototype.filter = function(params){
  this.params = params;
  this.connect(0);
}

// connect to the endpoint and link up with tweets, and set up for errors
Connection.prototype.connect = function(delay){
  this.stream = new Stream(…);
  this.stream.on('error', bound(this.stream_error))
}

Connection.prototype.stream_error = function(){
  try{

    // if this error was 420, then reconnect after 2 minutes
    this.connect(1000*60*2);

    // else
    // http error, linear backoff
    this.connect(this.linearBackoff());

    // else
    // non http error, exponential backoff
    this.connect(this.exponentialBackoff());

  } catch (e BackoffFinished){
    this.stream.emit('error', e)
  }
}


exports = Connection;



function backoff(current, max, step, _value){
  return function(){
    if((_value = current) > max) throw "error"
    current = step(current);
    return _value;
  }
}
