var fs = require('fs'),
    Parser = require('../lib/Parser.js'),
    stream = require('stream'),
    assert = require("assert");


describe('stream parsing', function(){
  var source;

  beforeEach(function(){
    source = new stream.Readable();
    source._read = function(){};
    parser = new Parser();
    source.pipe(parser);
  });


  it('passes messages from the source stream', function(done){
    var count = 0;
    parser.on('data', function(d){
      count++;
      if(count == 3){
        done();
      }
    });

    source.push('{"hello":"world"}\r\n');
    source.push('{"hello":"world"}\r\n');
    source.push('{"hello":"world"}\r\n');

  });


  it('parses JSON', function(done){
    parser.on('data', function(d){
      assert.equal(d.hello, "world");
      assert.equal(d.foo, "bar");
      done();
    });
    source.push('{"hello":"world","foo":"bar"}\r\n');
  });



  it('fails okay with non JSON', function(done){
    var first = true;

    parser.on('data', function(d){
      assert.equal(d.hello, "world");
      assert.equal(d.foo, "bar");
      done();
    });
    source.push('whatever\r\n');
    source.push('foo\r\n');
    source.push('1234\r\n');
    source.push('{"hello":"world","foo":"bar"}\r\n');
    source.push('1234\r\n');
  });


  // doesn't actually happen with twitter api - though nice to have
  // it('can parse messages cross chunk messages', function(done){
  //   parser.on('data', function(d){
  //     assert.equal(d.hello, "world");
  //     assert.equal(d.foo, "bar");
  //     console.log("ok")
  //     done();
  //   });
  //   source.push('{"hello":"world"');
  //   source.push(',"foo":"bar"}\r\n');
  // });



})
