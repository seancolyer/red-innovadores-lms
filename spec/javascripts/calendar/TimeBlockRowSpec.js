(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  require(['compiled/calendar/TimeBlockList', 'compiled/calendar/TimeBlockRow'], function(TimeBlockList, TimeBlockRow) {
    var end, inputName, nextYear, start, _i, _len, _ref;
    nextYear = new Date().getFullYear() + 1;
    start = new Date("2/3/" + nextYear + " 5:32");
    end = new Date("2/3/" + nextYear + " 10:32");
    module("TimeBlockRow", {
      setup: function() {
        this.$holder = $('<table />').appendTo(document.body);
        this.timeBlockList = new TimeBlockList(this.$holder);
        return this.clock = sinon.useFakeTimers((new Date()).valueOf());
      },
      teardown: function() {
        this.clock.tick(250);
        this.clock.restore();
        return this.$holder.detach();
      }
    });
    test("should init properly", function() {
      var me;
      me = new TimeBlockRow(this.timeBlockList, {
        start: start,
        end: end
      });
      equal(me.inputs.date.$el.val(), start.toString("MMM d, yyyy"));
      equal(me.inputs.start_time.$el.val(), start.toString("h:mmtt"));
      return equal(me.inputs.end_time.$el.val(), end.toString("h:mmtt"));
    });
    test("delete link", function() {
      var me;
      me = this.timeBlockList.addRow({
        start: start,
        end: end
      });
      ok((__indexOf.call(this.timeBlockList.rows, me) >= 0), 'make sure I am in the timeBlockList to start out with');
      me.$row.find('.delete-block-link').click();
      ok(!(__indexOf.call(this.timeBlockList.rows, me) >= 0));
      return ok(!me.$row[0].parentElement, 'make sure I am no longer on the page');
    });
    _ref = TimeBlockRow.prototype.inputNames;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      inputName = _ref[_i];
      test("validateField: " + inputName, function() {
        var me;
        me = new TimeBlockRow(this.timeBlockList, {
          start: start,
          end: end
        });
        ok(me.validateField(inputName), 'validates with good info');
        me.updateDom(inputName, 'asdf').change();
        ok(!me.validateField(inputName), 'doesnt validate with invalid input');
        ok(me.inputs[inputName].$el.hasClass('error'));
        me.updateDom(inputName, '').change();
        ok(me.validateField(inputName), 'valid if blank');
        return ok(!me.inputs[inputName].$el.hasClass('error'), 'no error classes if valid');
      });
    }
    test('validate: with good data', function() {
      var me;
      me = new TimeBlockRow(this.timeBlockList, {
        start: start,
        end: end
      });
      return ok(me.validate(), 'whole row validates if has good info');
    });
    test('validate: date in past', function() {
      var me;
      me = new TimeBlockRow(this.timeBlockList, {
        start: start,
        end: end
      });
      me.updateDom('date', '1/1/2000').change();
      ok(!me.validate());
      ok(me.inputs.end_time.$el.data('associated_error_box').is(':visible'), 'error box is visible');
      return ok(me.inputs.end_time.$el.hasClass('error'), 'has error class');
    });
    test('validate: just time in past', function() {
      var me, twelveOClock, twelveOOne;
      twelveOClock = new Date(new Date().toDateString());
      twelveOOne = new Date(twelveOClock);
      twelveOOne.setMinutes(1);
      me = new TimeBlockRow(this.timeBlockList, {
        start: twelveOClock,
        end: twelveOOne
      });
      ok(!me.validate(), 'not valid if time in past');
      ok(me.inputs.end_time.$el.data('associated_error_box').is(':visible'), 'error box is visible');
      return ok(me.inputs.end_time.$el.hasClass('error'), 'has error class');
    });
    test('validate: end before start', function() {
      var me;
      me = new TimeBlockRow(this.timeBlockList, {
        start: end,
        end: start
      });
      ok(!me.validate());
      ok(me.inputs.start_time.$el.data('associated_error_box').parents('body'), 'error box is visible');
      return ok(me.inputs.start_time.$el.hasClass('error'), 'has error class');
    });
    test('valid if whole row is blank', function() {
      var me;
      me = new TimeBlockRow(this.timeBlockList);
      ok(me.blank());
      return ok(me.validate());
    });
    return test('getData', function() {
      var me;
      me = new TimeBlockRow(this.timeBlockList, {
        start: start,
        end: end
      });
      me.validate();
      return deepEqual(me.getData(), [start, end, false]);
    });
  });

}).call(this);
