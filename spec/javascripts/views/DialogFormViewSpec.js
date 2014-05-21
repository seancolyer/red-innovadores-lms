(function() {

  define(['Backbone', 'compiled/views/DialogFormView', 'helpers/assertions', 'helpers/util', 'helpers/jquery.simulate'], function(Backbone, DialogFormView, assert, util) {
    var assertDialogTitle, model, openDialog, sendResponse, server, trigger, view;
    server = null;
    view = null;
    model = null;
    trigger = null;
    openDialog = function() {
      return view.$trigger.simulate('click');
    };
    sendResponse = function(method, json) {
      return server.respond(method, model.url, [
        200, {
          'Content-Type': 'application/json'
        }, JSON.stringify(json)
      ]);
    };
    module('DialogFormView', {
      setup: function() {
        server = sinon.fakeServer.create();
        model = new Backbone.Model({
          id: 1,
          is_awesome: true
        });
        model.url = '/test';
        trigger = $('<button title="Edit Stuff" />').appendTo($('#fixtures'));
        return view = new DialogFormView({
          model: model,
          trigger: trigger,
          template: function(_arg) {
            var is_awesome;
            is_awesome = _arg.is_awesome;
            return "<label><input\n  type=\"checkbox\"\n  name=\"is_awesome\"\n  " + (is_awesome ? "checked" : void 0) + "\n> is awesome</label>";
          }
        });
      },
      teardown: function() {
        trigger.remove();
        server.restore();
        return view.remove();
      }
    });
    test('opening and closing the dialog with the trigger', function() {
      assert.isHidden(view.$el, 'before click');
      openDialog();
      assert.isVisible(view.$el, 'after click');
      util.closeDialog();
      return assert.isHidden(view.$el, 'after dialog close');
    });
    test('submitting the form', function() {
      openDialog();
      equal(view.model.get('is_awesome'), true, 'is_awesome starts true');
      view.$('label').simulate('click');
      view.$('button[type=submit]').simulate('click');
      sendResponse('PUT', {
        id: 1,
        is_awesome: false
      });
      equal(view.model.get('is_awesome'), false, 'is_awesome is updated to false');
      return assert.isHidden(view.$el, 'when form submission is complete');
    });
    assertDialogTitle = function(expected, message) {
      var dialogTitle;
      dialogTitle = $('.ui-dialog-title:last').html();
      return equal(dialogTitle, expected, message);
    };
    test('gets dialog title from tigger title', function() {
      openDialog();
      return assertDialogTitle(trigger.attr('title'), "dialog title is taken from triggers title attribute");
    });
    test('gets dialog title from option', function() {
      view.options.title = 'different title';
      openDialog();
      return assertDialogTitle(view.options.title, "dialog title is taken from triggers title attribute");
    });
    test('gets dialog title from trigger aria-describedby', function() {
      var describer;
      trigger.removeAttr('title');
      describer = $('<div/>', {
        html: 'aria title',
        id: 'aria-describer'
      }).appendTo($('#fixtures'));
      trigger.attr('aria-describedby', 'aria-describer');
      openDialog();
      assertDialogTitle('aria title', "dialog title is taken from triggers title attribute");
      return describer.remove();
    });
    return test('rendering', function() {
      view.wrapperTemplate = function() {
        return 'wrapper:<div class="outlet"></div>';
      };
      view.template = function(_arg) {
        var foo;
        foo = _arg.foo;
        return foo;
      };
      view.model.set('foo', 'hello');
      equal(view.$el.html(), '', "doesn't render until opened for the first time");
      openDialog();
      ok(view.$el.html().match(/wrapper/, "renders wrapper"));
      return equal(view.$el.find('.outlet').html(), 'hello', "renders template into outlet");
    });
  });

}).call(this);
