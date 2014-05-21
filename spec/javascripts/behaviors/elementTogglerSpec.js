(function() {

  require(['jquery', 'compiled/behaviors/elementToggler'], function($, elementToggler) {
    module('elementToggler', {
      teardown: function() {
        var el, _i, _len, _ref, _results;
        _ref = [this.$trigger, this.$otherTrigger, this.$target];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          _results.push(el != null ? el.remove() : void 0);
        }
        return _results;
      }
    });
    test('handles data-html-while-target-shown', function() {
      var msg;
      this.$trigger = $('<a href="#" class="element_toggler" role="button"\
                      data-html-while-target-shown="Hide Thing"\
                      aria-controls="thing">Show Thing</a>').appendTo('body');
      this.$otherTrigger = $('<a class="element_toggler"\
                           data-html-while-target-shown="while shown"\
                           aria-controls="thing">while hidden</a>').appendTo('body');
      this.$target = $('<div id="thing" tabindex="-1" role="region" style="display:none">\
                    Here is a bunch more info about "thing"\
                  </div>').appendTo('body');
      this.$trigger.click();
      ok(this.$target.is('[aria-expanded=true]:visible:focus'), "target is shown (and focused since it has a tabindex)");
      msg = 'Handles `data-html-while-target-shown`';
      equal(this.$trigger.text(), 'Hide Thing', msg);
      equal(this.$otherTrigger.text(), 'while shown', msg);
      ok(this.$trigger.is(':visible'), 'does not hide trigger unless `data-hide-while-target-shown` is specified');
      this.$trigger.click();
      ok(this.$target.is('[aria-expanded=false]:hidden'), "target is hidden");
      equal(this.$trigger.text(), 'Show Thing', msg);
      return equal(this.$otherTrigger.text(), 'while hidden', msg);
    });
    test('handles data-hide-while-target-shown', function() {
      var msg;
      this.$trigger = $('<a href="#"\
                      class="element_toggler"\
                      data-hide-while-target-shown="true"\
                      aria-controls="thing">Show Thing, then hide me</a>').appendTo('body');
      this.$otherTrigger = $('<a class="element_toggler"\
                           data-hide-while-target-shown=true\
                           aria-controls="thing">also hide me</a>').appendTo('body');
      this.$target = $('<div id="thing"\
                       tabindex="-1"\
                       role="region"\
                       style="display:none">blah</div>').appendTo('body');
      this.$trigger.click();
      ok(this.$target.is('[aria-expanded=true]:visible'), "target is shown");
      msg = 'Does not change text unless `data-html-while-target-shown` is specified';
      equal($.trim(this.$trigger.text()), 'Show Thing, then hide me', msg);
      msg = 'Handles `data-hide-while-target-shown`';
      ok(this.$trigger.is(':hidden'), msg);
      ok(this.$otherTrigger.is(':hidden'), msg);
      this.$trigger.click();
      ok(this.$target.is('[aria-expanded=false]:hidden'), "target is hidden");
      ok(this.$trigger.is(':visible'), msg);
      return ok(this.$otherTrigger.is(':visible'), msg);
    });
    test('handles dialogs', function() {
      var $closer, $submitButton, msg, spy, submitWasCalled;
      this.$trigger = $('<button class="element_toggler"\
                           aria-controls="thing">Show Thing Dialog</button>').appendTo('body');
      this.$target = $("<form id=\"thing\" data-turn-into-dialog='{\"width\":450,\"modal\":true}' style=\"display:none\">\n  This will pop up as a dilog when you click the button and pass along the\n  data-turn-into-dialog options.  then it will pass it through fixDialogButtons\n  to turn the buttons in your markup into proper dialog buttons\n  (look at fixDialogButtons to see what it does)\n  <div class=\"button-container\">\n    <button type=\"submit\">This will Submit the form</button>\n    <a class=\"btn dialog_closer\">This will cause the dialog to close</a>\n  </div>\n</form>").appendTo('body');
      msg = "target pops up as a dialog";
      spy = sinon.spy($.fn, 'fixDialogButtons');
      this.$trigger.click();
      ok(this.$target.is(':ui-dialog:visible'), msg);
      ok(spy.thisValues[0].is(this.$target), 'calls fixDialogButton on @$trigger');
      spy.restore();
      msg = "handles `data-turn-into-dialog` options correctly";
      equal(this.$target.dialog('option', 'width'), 450, msg);
      equal(this.$target.dialog('option', 'modal'), true, msg);
      msg = "make sure clicking on converted ui-dialog-buttonpane .ui-button causes submit handler to be called on form";
      submitWasCalled = false;
      this.$target.submit(function() {
        submitWasCalled = true;
        return false;
      });
      $submitButton = this.$target.dialog('widget').find('.ui-dialog-buttonpane .ui-button:contains("This will Submit the form")');
      $submitButton.click();
      ok(submitWasCalled, msg);
      equal(this.$target.dialog('isOpen'), true, "doesnt cause dialog to hide");
      msg = 'make sure clicking on the .dialog_closer causes dialog to close';
      $closer = this.$target.dialog('widget').find('.ui-dialog-buttonpane .ui-button:contains("This will cause the dialog to close")');
      $closer.click();
      equal(this.$target.dialog('isOpen'), false, msg);
      this.$trigger.click();
      equal(this.$target.dialog('isOpen'), true);
      this.$trigger.click();
      return equal(this.$target.dialog('isOpen'), false);
    });
    return test('checkboxes can be used as trigger', function() {
      this.$trigger = $('<input type="checkbox" class="element_toggler" aria-controls="thing">').appendTo('body');
      this.$target = $('<div id="thing" style="display:none">thing</div>').appendTo('body');
      this.$trigger.prop('checked', true).trigger('change');
      ok(this.$target.is(':visible'), "target is shown");
      this.$trigger.prop('checked', false).trigger('change');
      return ok(this.$target.is(':hidden'), "target is hidden");
    });
  });

}).call(this);
