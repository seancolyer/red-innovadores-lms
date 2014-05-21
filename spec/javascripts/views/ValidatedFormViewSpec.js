(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'Backbone', 'compiled/views/ValidatedFormView', 'helpers/simulateClick'], function($, _arg, ValidatedFormView, click) {
    var Model, MyForm, sendFail, sendSuccess;
    Model = _arg.Model;
    module('ValidatedFormView', {
      setup: function() {
        this.server = sinon.fakeServer.create();
        this.clock = sinon.useFakeTimers();
        this.form = new MyForm;
        return $('#fixtures').append(this.form.el);
      },
      teardown: function() {
        this.form.$el.remove();
        $('.errorBox').remove();
        this.server.restore();
        this.clock.tick(250);
        return this.clock.restore();
      }
    });
    sendFail = function(server, response) {
      if (response == null) {
        response = '';
      }
      return server.respond('POST', '/fail', [
        400, {
          'Content-Type': 'application/json'
        }, JSON.stringify(response)
      ]);
    };
    sendSuccess = function(server, response) {
      if (response == null) {
        response = '';
      }
      return server.respond('POST', '/success', [
        200, {
          'Content-Type': 'application/json'
        }, JSON.stringify(response)
      ]);
    };
    MyForm = (function(_super) {

      __extends(MyForm, _super);

      function MyForm() {
        return MyForm.__super__.constructor.apply(this, arguments);
      }

      MyForm.prototype.initialize = function() {
        this.model = new Model;
        this.model.url = '/fail';
        return this.render();
      };

      MyForm.prototype.fieldSelectors = {
        last_name: '[name="user[last_name]"]'
      };

      MyForm.prototype.template = function() {
        return "<input type=\"text\" name=\"first_name\" value=\"123\">\n<input type=\"text\" name=\"user[last_name]\" value=\"123\">\n<button type=\"submit\">submit</button>";
      };

      return MyForm;

    })(ValidatedFormView);
    /*
      # sinon eats some errors, manual sanity debugging follows
      json =
        first_name: [{
          "message": "first name required"
          "type": "required"
        }]
        last_name: [{
          message: "last name required"
          type: "required"
        }]
      form = new MyForm().render()
      form.$el.appendTo $('#fixtures')
      form.showErrors json
    */

    test('displays errors when validation fails and remove them on click', 4, function() {
      this.form.on('fail', function(errors) {
        ok(errors.first_name.$errorBox.is(':visible'));
        ok(errors.last_name.$errorBox.is(':visible'));
        equal(errors.first_name.$errorBox.text(), errors.first_name[0].message);
        return equal(errors.last_name.$errorBox.text(), errors.last_name[0].message);
      });
      this.form.submit();
      return sendFail(this.server, {
        errors: {
          first_name: [
            {
              "message": "first name required",
              "type": "required"
            }
          ],
          last_name: [
            {
              message: "last name required",
              type: "required"
            }
          ]
        }
      });
    });
    test('triggers success, submit events', 3, function() {
      this.form.model.url = '/success';
      this.form.on('submit', function() {
        return ok(true, 'submit handler called');
      });
      this.form.on('success', function(resp) {
        ok(true, 'success handler called');
        return equal('ok', resp, 'passes response in');
      });
      this.form.submit();
      return sendSuccess(this.server, 'ok');
    });
    test('triggers fail, submit events', 6, function() {
      this.form.model.url = '/fail';
      this.form.on('submit', function() {
        return ok(true, 'submit handler called');
      });
      this.form.on('fail', function(errors, xhr, status, statusText) {
        ok(true, 'fail handler called');
        equal(errors.first_name[0].type, 'required', 'passes errors in');
        ok(xhr, 'passes xhr in');
        equal(status, 'error', 'passes status in');
        return equal(statusText, 'Bad Request', 'passes statusText in');
      });
      this.form.submit();
      return sendFail(this.server, {
        errors: {
          first_name: [
            {
              "message": "first name required",
              "type": "required"
            }
          ]
        }
      });
    });
    test('calls submit on DOM form submit', 1, function() {
      this.form.on('submit', function() {
        return ok(true, 'submitted');
      });
      return this.form.$el.submit();
    });
    return test('disables inputs while loading', 2, function() {
      var _this = this;
      equal(this.form.$(':disabled').length, 0);
      this.form.on('submit', function() {
        _this.clock.tick(20);
        return equal(_this.form.$(':disabled').length, 3);
      });
      return this.form.submit();
    });
  });

}).call(this);
