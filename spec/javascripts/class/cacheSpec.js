(function() {

  define(['underscore', 'compiled/class/cache'], function(_, cache) {
    module('class/cache', {
      setup: function() {
        return this.cache = cache.cache;
      }
    });
    test('should store strings', function() {
      this.cache.set('key', 'value');
      return equal(this.cache.get('key'), 'value');
    });
    test('should store arrays and objects', function() {
      this.cache.set('array', [1, 2, 3]);
      this.cache.set('object', {
        a: 1,
        b: 2
      });
      ok(_.isEqual(this.cache.get('array'), [1, 2, 3]));
      return ok(_.isEqual(this.cache.get('object'), {
        a: 1,
        b: 2
      }));
    });
    test('should delete keys', function() {
      this.cache.set('key', 'value');
      this.cache.remove('key');
      return equal(this.cache.get('key'), null);
    });
    test('should accept complex keys', function() {
      this.cache.set([1, 2, 3], 'value1');
      this.cache.set({
        a: 1,
        b: 1
      }, 'value2');
      this.cache.set([1, 2], {
        a: 1
      }, 'test', 'value3');
      equal(this.cache.get([1, 2, 3]), 'value1');
      equal(this.cache.get({
        a: 1,
        b: 1
      }), 'value2');
      return equal(this.cache.get([1, 2], {
        a: 1
      }, 'test'), 'value3');
    });
    test('should accept a prefix', function() {
      this.cache.prefix = 'prefix-';
      this.cache.set('key', 'value');
      return equal(typeof this.cache.store['prefix-"key"'], 'string');
    });
    return test('should accept local and sessionStorage as stores', function() {
      this.cache.use('localStorage');
      equal(this.cache.store, localStorage);
      this.cache.use('sessionStorage');
      equal(this.cache.store, sessionStorage);
      return this.cache.use('memory');
    });
  });

}).call(this);
