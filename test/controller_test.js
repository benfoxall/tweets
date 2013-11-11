// reconnecting.js
var sinon = require('sinon'),
    assert = require('assert'),
    Controller = require('../lib/Controller.js');

describe('controller', function(){
  var controller;

  before(function(){
    controller = new Controller({})
  })

  it('can be instantiated', function(){
    assert.ok(controller);
  });

  describe('mutuable parameter throttle', function(){

    var clock;

    before(function () { clock = sinon.useFakeTimers(); });
    after(function () { clock.restore(); });

    it('is throttled', function(){
      controller = new Controller({})

      var controllerSpy = controller.connect = sinon.spy();
      controller.filter({track:'a'});
      controller.filter({track:'b'});
      controller.filter({track:'c'});

      assert(controllerSpy.calledOnce)

      // after 5 minutes
      clock.tick(1000*60*5);

      assert(controllerSpy.calledTwice)

    })

  })

})