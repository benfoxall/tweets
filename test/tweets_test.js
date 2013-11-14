var assert = require("assert"),
    sinon = require("sinon"),
    Tweets = require('../index.js'),
    Readable = require('stream').Readable;

describe('tweets', function(){
  var stream, source
      config = {
        consumer_key:        'AAAA',
        consumer_secret:     'BBBB',
        access_token:        'CCCC',
        access_token_secret: 'DDDD'
      };

  beforeEach(function(){
    stream = Tweets(config);
    source = new Readable({objectMode: true});
    source._read = function(){};
    source.pipe(stream);
  })

  it('is the right kind of object', function(){
    assert.ok(stream instanceof Tweets)
  });

  describe('opening connection', function(){
    var connect_spy;
    beforeEach(function(){
      connect_spy = sinon.stub(stream.controller, "connect");
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

        source.push({text:"hello world"})
      })

      it('emitted a tweet event', function(){        
        assert(tweetspy.called);
      })
    })

    describe('multiple messages', function(){
      var tweetspy, called = false;

      before(function(){
        tweetspy = sinon.spy();
        stream.on('tweet', tweetspy);

        // fake some tweets coming in
        var source = new Readable({objectMode: true});
        source._read = function(){};
        source.pipe(stream);
        source.push({text:"hello world"})
        source.push({text:"hello world"})
      })

      it('emitted a tweet event', function(){
        assert(tweetspy.calledTwice);
      })
    })

  })

  describe('message types', function(){
    var emitted;
    before(function(){
      emitted = function(type, message){
        var spy = sinon.spy();
        stream.on(type, spy);
        source.push(message);
        return spy.called;
      }
    })
    
    it('emits tweets', function(){
      assert(emitted('tweet', {text:'hello'}))
    })

    it('emits deletion notices', function(){
      assert(emitted('delete', {"delete":{}}))
    })

    it('emits location deletion notices', function(){
      assert(emitted('scrub_geo', {"scrub_geo":{}}))
    })

    it('emits limit notices', function(){
      assert(emitted('limit', {"limit":{}}))
    })

    it('emits withheld conent notices', function(){
      assert(emitted('status_withheld', {"status_withheld":{}}))
      assert(emitted('user_withheld', {"user_withheld":{}}))
    })

    it('emits disconnect notices', function(){
      assert(emitted('disconnect', {"disconnect":{}}))
    })

    it('emits stall warnings', function(){
      assert(emitted('warning', {"warning":{}}))
    })


    // describe('tweets', function(){
    //   before(push({text:"Hello"}));
    //   it('emitted')
    // })

  });
})



