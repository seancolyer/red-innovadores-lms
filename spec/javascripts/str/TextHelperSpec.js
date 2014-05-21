(function() {

  define(['compiled/str/TextHelper'], function(_arg) {
    var delimit, truncateText;
    delimit = _arg.delimit, truncateText = _arg.truncateText;
    module('TextHelper');
    test('delimit: comma-delimits long numbers', function() {
      equal(delimit(123456), '123,456');
      equal(delimit(9999999), '9,999,999');
      equal(delimit(-123456), '-123,456');
      return equal(delimit(123456), '123,456');
    });
    test('delimit: comma-delimits integer portion only of decimal numbers', function() {
      equal(delimit(123456.12521), '123,456.12521');
      return equal(delimit(9999999.99999), '9,999,999.99999');
    });
    test('delimit: does not comma-delimit short numbers', function() {
      equal(delimit(123), '123');
      equal(delimit(0), '0');
      return equal(delimit(null), '0');
    });
    test('delimit: should not error on NaN', function() {
      equal(delimit(0 / 0), 'NaN');
      equal(delimit(5 / 0), 'Infinity');
      return equal(delimit(-5 / 0), '-Infinity');
    });
    test('truncateText: should truncate on word boundaries without exceeding max', function() {
      equal(truncateText("zomg zomg zomg", {
        max: 11
      }), "zomg...");
      equal(truncateText("zomg zomg zomg", {
        max: 12
      }), "zomg zomg...");
      equal(truncateText("zomg zomg zomg", {
        max: 13
      }), "zomg zomg...");
      return equal(truncateText("zomg      whitespace!   ", {
        max: 15
      }), "zomg...");
    });
    test('truncateText: should not truncate if the string fits', function() {
      equal(truncateText("zomg zomg zomg", {
        max: 14
      }), "zomg zomg zomg");
      return equal(truncateText("zomg      whitespace!   ", {
        max: 16
      }), "zomg whitespace!");
    });
    return test('truncateText: should break up the first word if it exceeds max', function() {
      equal(truncateText("zomgzomg", {
        max: 6
      }), "zom...");
      return equal(truncateText("zomgzomg", {
        max: 7
      }), "zomg...");
    });
  });

}).call(this);
