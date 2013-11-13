// reconnecting.js
var sinon = require('sinon'),
    // rewire = require("rewire"),
    assert = require('assert'),
    should = require('should'),
    Readable = require('stream').Readable,
    EventEmitter = require('events').EventEmitter,
    Controller = require('../lib/Controller.js'),
    Tweets = require('../lib/tweets.js');

describe('controller', function(){
  var controller, tweets;

  before(function(){
    controller = new Controller(tweets = new Tweets)
  })

  it('can be instantiated', function(){
    assert.ok(controller);
  });

  describe('mutuable parameter throttle', function(){
    var clock, connect;

    before(function () { 
      clock = sinon.useFakeTimers();
      connect = sinon.stub(controller, "connect");
    });
    after(function () {
      clock.restore(); 
      connect.restore();
    });

    it('is throttled', function(){

      controller.filter({track:'a'});
      controller.filter({track:'b'});
      controller.filter({track:'c'});

      assert(connect.calledOnce)

      // after 5 minutes
      clock.tick(1000*60*5);

      assert(connect.calledTwice)

    })

  })

  describe('reconnecting', function(){

    var requests;
    var streams, tweetList, close;

    before(function(){
      requests = []; streams = []; tweetList = [], closes = [];

      sinon.stub(controller, "makeConnection", function(){
        var close = sinon.spy();
        var request = new EventEmitter;
        var stream = new Readable();
            stream._read = function(){};
        stream.on('close',close)

        request.abort = function(){
          stream.emit('close')
          request.emit('close')
        }

        requests.push(request);
        streams.push(stream);
        closes.push(close)

        return request
      });

      tweets.on('tweet', function(tweet){
        tweetList.push(tweet)
      })
    });

    after(function () {
      controller.makeConnection.restore();
    });

    describe('first stream', function(){
      before(function(){
        // tweets come through on original stream
        controller.connect();
        requests[0].emit('response', streams[0]);
        streams[0].push('{"data":"a"}');
      })

      it('makes a request', function(){
        assert.equal(1, requests.length);
      })

      describe('next stream', function(){
        before(function(){
          // reconnect
          controller.connect();
          requests[1].emit('response', streams[1]);
          streams[1].push('{"data":"b"}');
          streams[1].push('{"data":"c"}');
        })

        it('makes a second request', function(){
          assert.equal(2, requests.length);
        })

        it('gets all tweets through', function(){
          tweetList.should.eql([{data:'a'},{data:'b'},{data:'c'}]);
        })

        it('closes first request', function(){
          assert.equal(true, closes[0].called)
        })

      })

    })


  });


  describe('heartbeat reconnect', function(){

    var requests;
    var streams, tweetList;
    var clock;


    before(function(){
      clock = sinon.useFakeTimers();
      requests = []; streams = []; tweetList = []

      sinon.stub(controller, "makeConnection", function(){
        var request = new EventEmitter;
        var stream = new Readable();
            stream._read = function(){};

        request.abort = function(){
          stream.emit('close')
          request.emit('close')
        }

        requests.push(request);
        streams.push(stream);

        return request
      });

      controller.connect();

      requests[0].emit('response', streams[0]);
    });

    after(function () {
      clock.restore();
      controller.makeConnection.restore();
    });

    describe('2 minutes with heartbearts', function(){
      before(function(){
        clock.tick(30*1000);
        streams[0].push('\n')
        clock.tick(30*1000);
        streams[0].push('\n')
        clock.tick(30*1000);
        streams[0].push('\n')
        clock.tick(30*1000);
        streams[0].push('\n')
      })

      it("didn't reconnect", function(){
        requests.length.should.eql(1)
      })
    })

    describe('2 minutes without heartbearts', function(){
      before(function(){
        clock.tick(120*1000);
        clock.tick(120*1000);
      })

      it("did reconnect", function(){
        requests.length.should.eql(2)
      })
    })





  })


})