(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['Backbone'], function(_arg) {
    var View;
    View = _arg.View;
    module('View');
    test('template option', function() {
      var view;
      view = new View({
        template: function() {
          return "hi";
        }
      });
      view.render();
      return equal(view.$el.html(), "hi", "tempalte rendered with view as option");
    });
    return test('View.mixin', 3, function() {
      var SomeView, expectedEvents, mixin1, mixin2, view;
      mixin1 = {
        events: {
          'click .foo': 'foo'
        },
        foo: function() {
          return ok(true, 'called mixin1.foo');
        }
      };
      mixin2 = {
        events: {
          'click .bar': 'bar'
        },
        bar: function() {
          return ok(true, 'called mixin2.bar');
        }
      };
      SomeView = (function(_super) {

        __extends(SomeView, _super);

        function SomeView() {
          return SomeView.__super__.constructor.apply(this, arguments);
        }

        SomeView.prototype.events = {
          'click .baz': 'baz'
        };

        SomeView.prototype.baz = function() {
          return ok(true, 'called prototype method baz');
        };

        SomeView.mixin(mixin1, mixin2);

        return SomeView;

      })(View);
      view = new SomeView;
      expectedEvents = {
        'click .foo': 'foo',
        'click .bar': 'bar',
        'click .baz': 'baz'
      };
      deepEqual(view.events, expectedEvents, 'events merged properly');
      view.foo();
      return view.bar();
    });
  });

}).call(this);
