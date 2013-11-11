var assert = require("assert"),
    sinon = require("sinon"),
    Tweets = require('../index.js'),
    Readable = require('stream').Readable;

describe('tweets', function(){
  var stream,
      config = {
        consumer_key:        'AAAA',
        consumer_secret:     'BBBB',
        access_token:        'CCCC',
        access_token_secret: 'DDDD'
      };

  beforeEach(function(){
    stream = Tweets(config);
  })

  it('is the right kind of object', function(){
    assert.ok(stream instanceof Tweets)
  });

  describe('opening connection', function(){
    var connect_spy;
    beforeEach(function(){
      connect_spy = sinon.stub(stream.connection, "connect");
      stream.filter({track: 'pizza'});
    });

    it('opened a connection to the twitter api', function(){
      assert(connect_spy.called)
    });

    describe('gets a message', function(){
      var tweetspy, called = false;

      before(function(){
        tweetspy = sinon.spy();

        stream.on('tweet', tweetspy);

        // fake some tweets coming in
        var source = new Readable({objectMode: true});
        source._read = function(){};
        source.pipe(stream);
        source.push({text:"hello world"})
      })

      it('emitted a tweet event', function(){        
        assert(tweetspy.called);
      })
    })

  })

  describe('connecting', function(){
    var connectionStub;

    beforeEach(function(){
      stream.connection = connectionStub;
    })

  });

  


  // it('takes oauth config', function(){

  // })


  // it('is implemented', function(){
  //   assert.equal(true, false, "not started tests yet")
  // })
})