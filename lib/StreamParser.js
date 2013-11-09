var oauth = require('oauth');
var Transform = require('stream').Transform;
var util = require('util');

util.inherits(StreamParser, Transform);

function StreamParser(source){
  Transform.call(this, {objectMode: true});
  source.pipe(this);
}

StreamParser.prototype._transform = function (chunk, encoding, done) {
  var data = chunk.toString('utf8').trim();
  try{
    var obj = JSON.parse(data)
    this.push(obj)
  } catch (e){
  }
  done();
}

module.exports = StreamParser;