(function() {

  define(['compiled/util/BackoffPoller'], function(BackoffPoller) {
    module('BackoffPoller', {
      setup: function() {
        var _this = this;
        this.ran_callback = false;
        this.callback = function() {
          return _this.ran_callback = true;
        };
        this.clock = sinon.useFakeTimers();
        this.server = sinon.fakeServer.create();
        return this.server.respondWith('fixtures/ok.json', '{"status":"ok"}');
      },
      teardown: function() {
        this.clock.restore();
        return this.server.restore();
      }
    });
    test('should keep polling when it gets a "continue"', function() {
      var poller;
      poller = new BackoffPoller('fixtures/ok.json', function() {
        return 'continue';
      }, {
        backoffFactor: 1,
        baseInterval: 10,
        maxAttempts: 100
      });
      poller.start().then(this.callback);
      this.clock.tick(10);
      this.server.respond();
      ok(poller.running, "poller should be running");
      return poller.stop(false);
    });
    test('should reset polling when it gets a "reset"', function() {
      var poller;
      poller = new BackoffPoller('fixtures/ok.json', function() {
        return 'reset';
      }, {
        backoffFactor: 1,
        baseInterval: 10,
        maxAttempts: 100
      });
      poller.start().then(this.callback);
      this.clock.tick(10);
      this.server.respond();
      ok(poller.running, "poller should be running");
      ok(poller.attempts <= 1, "counter should be reset");
      return poller.stop(false);
    });
    test('should stop polling when it gets a "stop"', function() {
      var count, i, poller, _i;
      count = 0;
      poller = new BackoffPoller('fixtures/ok.json', function() {
        if (count++ > 3) {
          return 'stop';
        } else {
          return 'continue';
        }
      }, {
        backoffFactor: 1,
        baseInterval: 10
      });
      poller.start().then(this.callback);
      for (i = _i = 0; _i < 4; i = ++_i) {
        this.clock.tick(10);
        this.server.respond();
      }
      ok(poller.running, "poller should be running");
      this.clock.tick(10);
      this.server.respond();
      ok(!poller.running, "poller should be stopped");
      return ok(this.ran_callback, "poller should have run callbacks");
    });
    test('should abort polling when it hits maxAttempts', function() {
      var i, poller, _i;
      poller = new BackoffPoller('fixtures/ok.json', function() {
        return 'continue';
      }, {
        backoffFactor: 1,
        baseInterval: 10,
        maxAttempts: 3
      });
      poller.start().then(this.callback);
      for (i = _i = 0; _i < 2; i = ++_i) {
        this.clock.tick(10);
        this.server.respond();
      }
      ok(poller.running, "poller should be running");
      this.clock.tick(10);
      this.server.respond();
      ok(!poller.running, "poller should be stopped");
      return ok(!this.ran_callback, "poller should not have run callbacks");
    });
    return test('should abort polling when it gets anything else', function() {
      var poller;
      poller = new BackoffPoller('fixtures/ok.json', function() {
        return 'omgwtfbbq';
      }, {
        baseInterval: 10
      });
      poller.start().then(this.callback);
      this.clock.tick(10);
      this.server.respond();
      ok(!poller.running, "poller should be stopped");
      return ok(!this.ran_callback, "poller should not have run callbacks");
    });
  });

}).call(this);
