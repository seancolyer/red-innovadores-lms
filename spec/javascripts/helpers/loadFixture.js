(function() {

  define(["jquery"], function(jQuery) {
    var $body, $fixtures, fixtureId, fixtures;
    $body = jQuery("body");
    $fixtures = jQuery("#fixtures");
    fixtures = {};
    fixtureId = 1;
    return function(fixture) {
      var id, path;
      id = fixture + fixtureId++;
      path = "fixtures/" + fixture + ".html";
      jQuery.ajax({
        async: false,
        cache: false,
        dataType: "html",
        url: path,
        success: function(html) {
          return fixtures[id] = jQuery("<div/>", {
            html: html,
            id: id
          }).appendTo($fixtures);
        },
        error: function() {
          return console.error("Failed to load fixture", path);
        }
      });
      return fixtures[id];
    };
  });

}).call(this);
