(function() {

  require(['compiled/object/unflatten'], function(unflatten) {
    module('unflatten');
    test('simple object', function() {
      var input;
      input = {
        foo: 1,
        bar: 'baz'
      };
      return deepEqual(unflatten(input), input);
    });
    return test('nested params', function() {
      var expected, input;
      input = {
        'a[0]': 1,
        'a[1]': 2,
        'a[2]': 3,
        'b': 4,
        'c[d]': 5,
        'c[e][ea]': 'asdf',
        'c[f]': true,
        'c[g]': false,
        'c[h]': '',
        'i': 7
      };
      expected = {
        a: [1, 2, 3],
        b: 4,
        c: {
          d: 5,
          e: {
            ea: 'asdf'
          },
          f: true,
          g: false,
          h: ''
        },
        i: 7
      };
      return deepEqual(unflatten(input), expected);
    });
  });

}).call(this);
