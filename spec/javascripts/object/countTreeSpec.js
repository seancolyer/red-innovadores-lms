(function() {

  define(['compiled/object/countTree'], function(countTree) {
    module('countTree');
    return test('counts a tree', function() {
      var obj;
      obj = {
        a: [
          {
            a: [
              {
                a: [{}]
              }
            ]
          }
        ]
      };
      equal(countTree(obj, 'a'), 3);
      equal(countTree(obj, 'foo'), 0);
      obj = {
        a: [
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
        ]
      };
      return equal(countTree(obj, 'a'), 11);
    });
  });

}).call(this);
