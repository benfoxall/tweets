// reconnecting.js
var sinon = require('sinon'),
    assert = require('assert'),
    Connection = require('../lib/connection.js');

describe('connection manager', function(){
  var connectionSpy;
  var connection;

  before(function(){
    connection = new Connection({})
    connectionSpy = sinon.spy();
  })

  it('can be instantiated', function(){
    assert.ok(connection);
  });

  describe('mutuable parameter throttle', function(){

    var clock;

    before(function () { clock = sinon.useFakeTimers(); });
    after(function () { clock.restore(); });

    it('is throttled', function(){
      connection = new Connection({})

      var connectionSpy = connection.connect = sinon.spy();
      connection.filter({track:'a'});
      connection.filter({track:'b'});
      connection.filter({track:'c'});

      assert(connectionSpy.calledOnce)

      // after 5 minutes
      clock.tick(1000*60*5);

      assert(connectionSpy.calledTwice)

    })

  })

})