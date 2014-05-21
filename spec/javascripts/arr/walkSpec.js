(function() {

  define(['compiled/arr/walk'], function(walk) {
    module('arr/walk');
    return test('walks a tree object', function() {
      var a, arr, c, prop, str;
      arr = [
        {
          name: 'a'
        }, {
          name: 'b'
        }
      ];
      prop = 'none';
      str = '';
      walk(arr, prop, function(item) {
        return str += item.name;
      });
      equal(str, 'ab', 'calls iterator with item');
      a = [{}];
      walk(a, 'nuthin', function(item, arr) {
        return equal(arr, a, 'calls iterator with obj');
      });
      a = [
        {
          a: [
            {
              a: [
                {
                  a: [{}, {}]
                }, {
                  a: [{}, {}]
                }
              ]
            }, {}, {}
          ]
        }, {
          a: []
        }
      ];
      c = 0;
      walk(a, 'a', function() {
        return c++;
      });
      return equal(c, 11);
    });
  });

}).call(this);
