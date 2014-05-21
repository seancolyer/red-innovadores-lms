(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require(['compiled/backbone-ext/Model'], function(Model) {
    module('dateAttributes');
    return test('converts date strings to date objects', function() {
      var TestModel, expected, parsedDate, res, stringDate;
      TestModel = (function(_super) {

        __extends(TestModel, _super);

        function TestModel() {
          return TestModel.__super__.constructor.apply(this, arguments);
        }

        TestModel.prototype.dateAttributes = ['foo', 'bar'];

        return TestModel;

      })(Model);
      stringDate = "2012-04-10T17:21:09-06:00";
      parsedDate = Date.parse(stringDate);
      res = TestModel.prototype.parse({
        foo: stringDate,
        bar: null,
        baz: stringDate
      });
      expected = {
        foo: parsedDate,
        bar: null,
        baz: stringDate
      };
      return deepEqual(res, expected);
    });
  });

}).call(this);
