function Tweets(config){

  if(! this instanceof Tweets) return new Tweets(config)

  // connection will open streams to twitter and
  // forward them on to this
  this.connection = new Connection(this, config)

}

Tweets.prototype.filter = function(params){
  this.connection.filter(params);
}


exports = Tweets