(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  require(['compiled/calendar/TimeBlockList'], function(TimeBlockList) {
    module("TimeBlockList", {
      setup: function() {
        var nextYear;
        this.$holder = $('<table>').appendTo(document.body);
        this.$splitter = $('<a>').appendTo(document.body);
        nextYear = new Date().getFullYear() + 1;
        this.blocks = [[new Date("2/3/" + nextYear + " 5:32"), new Date("2/3/" + nextYear + " 10:32")], [new Date("2/3/" + nextYear + " 11:15"), new Date("2/3/" + nextYear + " 15:01"), true], [new Date("2/3/" + nextYear + " 16:00"), new Date("2/3/" + nextYear + " 19:00")]];
        return this.me = new TimeBlockList(this.$holder, this.$splitter, this.blocks);
      },
      teardown: function() {
        this.$holder.detach();
        return this.$splitter.detach();
      }
    });
    test("should init properly", function() {
      return equal(this.me.rows.length, 3 + 1, 'three rows + 1 blank');
    });
    test("should not include locked or blank rows in .blocks()", function() {
      return deepEqual(this.me.blocks(), [this.blocks[0], this.blocks[2]]);
    });
    test("should handle intialization of locked / unlocked rows", function() {
      ok(!this.me.rows[0].locked, 'first row should not be locked');
      return ok(this.me.rows[1].locked, 'second row should be locked');
    });
    test('should remove rows correctly', function() {
      var row, _i, _len, _ref;
      _ref = this.me.rows;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        row.remove();
        ok(!(__indexOf.call(this.me.rows, row) >= 0));
      }
      ok(this.me.rows.length, 1);
      return ok(this.me.rows[0].blank());
    });
    test('should add rows correctly', function() {
      var data, row, rowsBefore;
      rowsBefore = this.me.rows.length;
      data = [Date.parse('next tuesday at 7pm'), Date.parse('next tuesday at 8pm')];
      row = this.me.addRow(data);
      equal(this.me.rows.length, rowsBefore + 1);
      return ok($.contains(this.me.element, row.$row), 'make sure the element got appended to my <tbody>');
    });
    test("should not not validate if all rows are not valid", function() {
      var calledAlert, row, _alert;
      ok(this.me.validate(), 'should validate if has valid dates');
      row = this.me.addRow();
      row.updateDom('date', 'asdfasdf').change();
      _alert = window.alert;
      calledAlert = false;
      window.alert = function() {
        return calledAlert = true;
      };
      ok(!this.me.validate(), 'should not validate with asdf dates');
      ok(calledAlert, 'should `alert` a message');
      return window.alert = _alert;
    });
    return test("should split correctly", function() {
      this.me.rows[2].remove();
      this.me.split('30');
      equal(this.me.rows.length, 12);
      return equal(this.me.blocks().length, 10);
    });
  });

}).call(this);
