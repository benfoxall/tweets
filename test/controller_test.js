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
  var controller, tweets, reconnect;

  before(function(){
    controller = new Controller(tweets = new Tweets)
    tweets.on('reconnect', reconnect = sinon.spy())
  })

  it('can be instantiated', function(){
    assert.ok(controller);
  });

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
      controller.connection = void 0
    });

    describe('first stream', function(){
      before(function(){
        // tweets come through on original stream
        controller.connect();
        requests[0].emit('response', streams[0]);
        streams[0].push('{"text":"a"}');
      })

      it('makes a request', function(){
        assert.equal(1, requests.length);
      })

      describe('next stream', function(){
        before(function(){
          // reconnect
          controller.connect();
          requests[1].emit('response', streams[1]);
          streams[1].push('{"text":"b"}');
          streams[1].push('{"text":"c"}');
        })

        it('makes a second request', function(){
          assert.equal(2, requests.length);
        })

        it('gets all tweets through', function(){
          tweetList.should.eql([{text:'a'},{text:'b'},{text:'c'}]);
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
      controller.connection = void 0
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



  describe('backoffs', function(){

    var requests, clock;

    describe('rate limiting', function(){
      before(function(){
        reconnect.reset();
        clock = sinon.useFakeTimers();
        requests = [];
        sinon.stub(controller, "makeConnection", function(){
          var request = new EventEmitter;
          var stream = new Readable();
              stream._read = function(){};

          request.abort = function(){
            stream.emit('close')
            request.emit('close')
          }

          stream.statusCode = 420;

          requests.push(request);

          setTimeout(function(){ request.emit('response', stream); },10)

          return request
        });
      })

      after(function () {
        clock.restore();
        controller.makeConnection.restore();
        controller.connection = void 0
        controller.backoffs();
      });

      it('backs off exponentially', function(){
        controller.connect();
        assert.equal(1,requests.length)

        clock.tick(60010);
        assert.equal(2,requests.length)

        clock.tick(120010);
        assert.equal(3,requests.length)

        clock.tick(240010);
        assert.equal(4,requests.length)

        assert(reconnect.calledWith({type: 'rate-limit'}))
      })
    })



    describe('network errors', function(){
      before(function(){
        reconnect.reset();
        clock = sinon.useFakeTimers();
        requests = [];
        sinon.stub(controller, "makeConnection", function(){
          var request = new EventEmitter;
          var stream = new Readable();
              stream._read = function(){};

          request.abort = function(){
            stream.emit('close')
            request.emit('close')
          }

          requests.push(request);

          setTimeout(function(){ request.emit('error', ''); },10)

          return request
        });
      })

      after(function () {
        clock.restore();
        controller.makeConnection.restore();
        controller.connection = void 0
        controller.backoffs();
      });

      it('backs off lineraly', function(){
        controller.connect();
        assert.equal(1,requests.length)

        clock.tick(10);
        assert.equal(2,requests.length)


        clock.tick(250 + 10); 
        assert.equal(3,requests.length)


        clock.tick(500 + 10); 
        assert.equal(4,requests.length)


        clock.tick(750 + 10); 
        assert.equal(5,requests.length)


        clock.tick(1000 + 10); 
        assert.equal(6,requests.length)

        assert(reconnect.calledWith({type: 'network'}))

      })
    })





    describe('http errors', function(){
      before(function(){
        reconnect.reset();
        clock = sinon.useFakeTimers();
        requests = [];
        sinon.stub(controller, "makeConnection", function(){
          var request = new EventEmitter;
          var stream = new Readable();
              stream._read = function(){};

          request.abort = function(){
            stream.emit('close')
            request.emit('close')
          }

          stream.statusCode = 503;

          requests.push(request);

          setTimeout(function(){ request.emit('response', stream); },10)

          return request
        });
      })

      after(function () {
        clock.restore();
        controller.makeConnection.restore();
        controller.connection = void 0
        controller.backoffs();
      });

      it('backs off exponentially', function(){
        controller.connect();
        assert.equal(1,requests.length)

        clock.tick(5000 + 10);
        assert.equal(2,requests.length)


        clock.tick(10000 + 10); 
        assert.equal(3,requests.length)


        clock.tick(20000 + 10); 
        assert.equal(4,requests.length)


        clock.tick(40000 + 10); 
        assert.equal(5,requests.length)


        clock.tick(80000 + 10); 
        assert.equal(6,requests.length)


        assert(reconnect.calledWith({type: 'http'}))

      })
    })

  })

})