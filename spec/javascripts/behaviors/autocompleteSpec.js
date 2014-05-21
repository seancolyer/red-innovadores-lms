(function() {

  require(['jquery', 'underscore', 'compiled/behaviors/autocomplete'], function($, _, createAutocompletes) {
    var $el, options;
    options = {
      delay: 150,
      minLength: 4,
      source: ['one', 'two', 'three']
    };
    $el = $("<div id=\"autocomplete-wrapper\">\n  <input type=\"text\"\n         id=\"autocomplete-box\"\n         data-behaviors=\"autocomplete\"\n         data-autocomplete-options='" + (JSON.stringify(options)) + "' />\n\n  <input type=\"text\" id=\"non-autocomplete-box\" />\n</div>");
    module('autocomplete', {
      teardown: function() {
        return $el.remove();
      }
    });
    return test('it should create an autocomplete box by reading data attributes', function() {
      var key, keys;
      $('body').append($el);
      createAutocompletes();
      keys = (function() {
        var _results;
        _results = [];
        for (key in $('#autocomplete-box').data()) {
          _results.push(key);
        }
        return _results;
      })();
      ok(_.include(keys, 'autocomplete'));
      return equal(typeof $('#non-autocomplete-box').data('autocomplete'), 'undefined');
    });
  });

}).call(this);
