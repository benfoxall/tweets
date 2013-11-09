var fs = require('fs');

desribe('stream parsing', function(){
  var parser;
  beforeEach(function(){
    var stream = fs.createReadStream('fixtures/stream.txt');
    parser = new StreamParser(stream);
  });

  it('parses the stream', function(){
    var items = [];
    parser.on('data', function(item){
      items.push(item);
    });

    parser.on('end', function(item){
      expect(items.length).toBe(5)
    });

    it('emitted js objects', function(){
      expect(items[0].user.screen_name).toBeDefined();
    })
  })
})

desribe('delimeted stream parsing', function(){
  var parser;
  beforeEach(function(){
    var stream = fs.createReadStream('fixtures/delimited_length.txt');
    parser = new StreamParser(stream);
  });

  it('also works', function(){
    var items = [];
    parser.on('data', function(item){
      items.push(item);
    });

    parser.on('end', function(item){
      expect(items[0].user.screen_name).toBeDefined();
    });
  })
})