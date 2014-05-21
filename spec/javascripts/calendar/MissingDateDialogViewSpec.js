(function() {

  define(['compiled/views/calendar/MissingDateDialogView'], function(MissingDateDialogView) {
    module('MissingDateDialogView', {
      setup: function() {
        $('body').append('<label for="date">Section one</label><input type="text" id="date" name="date" />');
        return this.dialog = new MissingDateDialogView({
          validationFn: function() {
            var invalidFields;
            invalidFields = [];
            $('input[name=date]').each(function() {
              if ($(this).val() === '') {
                return invalidFields.push($(this));
              }
            });
            if (invalidFields.length > 0) {
              return invalidFields;
            } else {
              return true;
            }
          },
          success: sinon.spy()
        });
      },
      teardown: function() {
        $('input[name=date]').remove();
        $('label[for=date]').remove();
        return $('.ui-dialog').remove();
      }
    });
    test('should display a dialog if the given fields are invalid', function() {
      ok(this.dialog.render());
      return ok($('.ui-dialog:visible').length > 0);
    });
    test('it should list the names of the sections w/o dates', function() {
      this.dialog.render();
      return ok($('.ui-dialog').text().match(/Section one/));
    });
    test('should not display a dialog if the given fields are valid', function() {
      $('input[name=date]').val('2013-01-01');
      equal(this.dialog.render(), false);
      return equal($('.ui-dialog').length, 0);
    });
    test('should close the dialog on primary button press', function() {
      this.dialog.render();
      this.dialog.$dialog.find('.btn-primary').click();
      return equal($('.ui-dialog').length, 0);
    });
    return test('should run the success callback on secondary button press', function() {
      this.dialog.render();
      this.dialog.$dialog.find('.btn:not(.btn-primary)').click();
      return ok(this.dialog.options.success.calledOnce);
    });
  });

}).call(this);
