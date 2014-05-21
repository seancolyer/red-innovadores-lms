(function() {

  define(function() {
    return function(element) {
      var e;
      if (!document.createEvent) {
        element.click();
        return;
      }
      e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      return element.dispatchEvent(e);
    };
  });

}).call(this);
