var oauth = require('oauth'),
  Transform = require('stream').Transform,
  util = require('util');

util.inherits(Parser, Transform);

function Parser(){
  Transform.call(this, {objectMode: true});
}

Parser.prototype._transform = function (chunk, encoding, done) {
  var data = chunk.toString('utf8').trim();
  try{
    var obj = JSON.parse(data)
    this.push(obj)
  } catch (e){}
  done();
}

module.exports = Parser;