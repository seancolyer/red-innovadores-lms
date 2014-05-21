(function() {

  define(['compiled/widget/ScrollableList', 'helpers/loadFixture'], function(ScrollableList, loadFixture) {
    module('ScrollableList', {
      setup: function() {
        var DummyModel;
        this.fakeApi = function(options) {
          var callbacks, i, id, numItems, sort, _ref, _ref1, _ref2,
            _this = this;
          if (options == null) {
            options = {};
          }
          numItems = (_ref = options.numItems) != null ? _ref : 100;
          sort = (_ref1 = options.sort) != null ? _ref1 : 'asc';
          callbacks = (_ref2 = options.callbacks) != null ? _ref2 : [];
          this.itemIds = (function() {
            var _i, _results;
            _results = [];
            for (i = _i = 1; 1 <= numItems ? _i <= numItems : _i >= numItems; i = 1 <= numItems ? ++_i : --_i) {
              _results.push(i * 2);
            }
            return _results;
          })();
          if (sort === 'desc') {
            this.itemIds.reverse();
          }
          this.items = (function() {
            var _i, _len, _ref3, _results;
            _ref3 = this.itemIds;
            _results = [];
            for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
              id = _ref3[_i];
              _results.push({
                id: id,
                sortBy: id,
                value: "item " + id,
                visible: true
              });
            }
            return _results;
          }).call(this);
          this.requestCount = 0;
          return function(request) {
            var items, match, page, perPage, response, _name;
            _this.requestCount++;
            if (typeof callbacks[_name = _this.requestCount] === "function") {
              callbacks[_name](request);
            }
            page = 1;
            perPage = 25;
            if (match = request.url.match(/[&\?]page=(\d+)/)) {
              page = parseInt(match[1]) - 1;
            }
            if (match = request.url.match(/per_page=(\d+)/)) {
              perPage = parseInt(match[1]);
            }
            items = _this.items.slice(page * perPage, (page + 1) * perPage);
            response = [
              200, {
                'Content-Type': 'application/json'
              }, JSON.stringify({
                items: items,
                item_ids: _this.itemIds
              })
            ];
            return request.respond.apply(request, response);
          };
        };
        this.fixture = loadFixture('ScrollableList');
        this.$container = $('#scrollable_list_container');
        this.clock = sinon.useFakeTimers();
        this.server = sinon.fakeServer.create();
        DummyModel = (function() {

          function DummyModel(attributes) {
            this.attributes = {};
            this.set(attributes);
          }

          DummyModel.prototype.get = function(key) {
            return this[key];
          };

          DummyModel.prototype.set = function(attributes) {
            var key, value;
            for (key in attributes) {
              value = attributes[key];
              this.attributes[key] = value;
              this[key] = value;
            }
            return this;
          };

          DummyModel.prototype.toJSON = function() {
            return this.attributes;
          };

          return DummyModel;

        })();
        return this.defaults = {
          itemTemplate: function(opts) {
            return "<li>" + opts['value'] + "</li>";
          },
          baseUrl: '/api/v1/test.json',
          fetchBuffer: 1,
          perPage: 5,
          model: DummyModel
        };
      },
      teardown: function() {
        this.clock.restore();
        this.server.restore();
        return this.fixture.detach();
      }
    });
    test('should load the initial data plus the buffer', function() {
      var i;
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, $.extend({}, this.defaults, {
        fetchBuffer: 6
      }));
      this.server.respond();
      equal(this.requestCount, 3);
      equal(this.$container.find('li').length, 15);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 15; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      return equal(this.$container.find('ul').height(), 2000);
    });
    test('should load everything around the visible section as the user scrolls', function() {
      var fakeApi, i,
        _this = this;
      fakeApi = this.fakeApi({
        callbacks: {
          3: function() {
            return equal(_this.$container.find('li').length, 56);
          }
        }
      });
      this.server.respondWith(/.+/, fakeApi);
      this.list = new ScrollableList(this.$container, $.extend({}, this.defaults, {
        fetchBuffer: 1
      }));
      this.server.respond();
      equal(this.requestCount, 2);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      equal(this.$container.find('ul').height(), 2000);
      this.$container.scrollTop(1000);
      this.list.scroll();
      this.clock.tick(500);
      this.server.respond();
      equal(this.requestCount, 5);
      return equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join('') + ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 46; _i <= 60; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
    });
    test('should re-fetch already-fetched data if the data changes underneath us', function() {
      var fakeApi, i,
        _this = this;
      fakeApi = this.fakeApi({
        callbacks: {
          3: function() {
            _this.items.splice(0, 1);
            return _this.itemIds.splice(0, 1);
          }
        }
      });
      this.server.respondWith(/.+/, fakeApi);
      this.list = new ScrollableList(this.$container, $.extend({}, this.defaults, {
        fetchBuffer: 11
      }));
      this.server.respond();
      equal(this.requestCount, 6);
      equal(this.$container.find('li').length, 20);
      return equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 2; _i <= 21; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
    });
    test('should add an item', function() {
      var i;
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, this.defaults);
      this.server.respond();
      equal(this.requestCount, 2);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      this.list.addItem({
        id: 3,
        sortBy: 3,
        value: "item 3",
        visible: true
      });
      equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
      return equal(this.$container.find('ul').height(), 2020);
    });
    test('should add an item even if its section isn\'t loaded yet', function() {
      var i, item, result;
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, this.defaults);
      this.server.respond();
      equal(this.requestCount, 2);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      item = {
        id: 21,
        sortBy: 21,
        value: "item 21",
        visible: true
      };
      this.items.splice(10, 0, item);
      this.itemIds.splice(10, 0, 21);
      this.list.addItem(item);
      this.server.respond();
      result = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 14; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })();
      result.splice(10, 0, "item 21");
      equal(this.$container.find('li').text(), result.join(''));
      return equal(this.$container.find('ul').height(), 2020);
    });
    test('should remove an item', function() {
      var i;
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, this.defaults);
      this.server.respond();
      equal(this.requestCount, 2);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      this.list.removeItem(this.items.splice(1, 1)[0]);
      this.itemIds.splice(1, 1);
      this.clock.tick(500);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [2, 6, 8, 10, 12, 14, 16, 18, 20];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
      equal(this.$container.find('ul').height(), 1980);
      this.server.respond();
      return equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [2, 6, 8, 10, 12, 14, 16, 18, 20, 22];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
    });
    test('should update an item', function() {
      var i;
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, this.defaults);
      this.server.respond();
      equal(this.requestCount, 2);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      this.list.updateItems([
        {
          id: 2,
          sortBy: 2,
          value: "lol",
          visible: true
        }
      ]);
      return equal(this.$container.find('li').text(), ["lol"].concat((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 2; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
    });
    test('should remove an item if no longer visible', function() {
      var i, item;
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, this.defaults);
      this.server.respond();
      equal(this.requestCount, 2);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      item = this.items.splice(1, 1)[0];
      item.visible = false;
      this.itemIds.splice(1, 1);
      this.list.updateItems([item]);
      this.clock.tick(500);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [2, 6, 8, 10, 12, 14, 16, 18, 20];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
      equal(this.$container.find('ul').height(), 1980);
      this.server.respond();
      return equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [2, 6, 8, 10, 12, 14, 16, 18, 20, 22];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
    });
    test('should move an item', function() {
      var i, item;
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, $.extend({}, this.defaults, {
        sortKey: 'sortBy'
      }));
      this.server.respond();
      equal(this.requestCount, 2);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      item = this.items[0];
      item.sortBy = 5;
      this.list.updateItems([item]);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [2, 4, 2, 6, 8, 10, 12, 14, 16, 18, 20];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
      this.clock.tick(500);
      return equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [4, 2, 6, 8, 10, 12, 14, 16, 18, 20];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
    });
    test('should do a synchronous re-render if multiple items are updated/moved', function() {
      var i, item1, item2;
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, $.extend({}, this.defaults, {
        sortKey: 'sortBy'
      }));
      this.server.respond();
      equal(this.requestCount, 2);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      item1 = this.items[0];
      item1.sortBy = 5;
      item2 = this.items[2];
      item2.sortBy = 1;
      this.list.updateItems([item1, item2]);
      return equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [6, 4, 2, 8, 10, 12, 14, 16, 18, 20];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
    });
    test('should move an item into an unloaded section', function() {
      var i, item;
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, $.extend({}, this.defaults, {
        sortKey: 'sortBy'
      }));
      this.server.respond();
      equal(this.requestCount, 2);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      item = this.items.splice(0, 1)[0];
      item.sortBy = 25;
      this.itemIds.splice(0, 1);
      this.itemIds.splice(11, 0, item.id);
      this.items.splice(11, 0, item);
      this.list.updateItems([item]);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
      this.clock.tick(500);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
      this.server.respond();
      this.server.respond();
      return equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 2, 26, 28, 30];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
    });
    test('should move an item from an unloaded section', function() {
      var i, item;
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, $.extend({}, this.defaults, {
        sortKey: 'sortBy'
      }));
      this.server.respond();
      equal(this.requestCount, 2);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 10; i = ++_i) {
          _results.push("item " + (i * 2));
        }
        return _results;
      })()).join(''));
      item = this.items.splice(19, 1)[0];
      item.sortBy = 1;
      this.itemIds.splice(19, 1);
      this.itemIds.splice(0, 0, item.id);
      this.items.splice(0, 0, item);
      this.list.updateItems([item]);
      equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [40, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 40];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
      this.clock.tick(500);
      return equal(this.$container.find('li').text(), ((function() {
        var _i, _len, _ref, _results;
        _ref = [40, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push("item " + i);
        }
        return _results;
      })()).join(''));
    });
    return test('should disable while initializing or resetting', function() {
      this.server.respondWith(/.+/, this.fakeApi());
      this.list = new ScrollableList(this.$container, this.defaults);
      this.clock.tick(20);
      equal(this.$container.css('opacity'), "0.5");
      this.server.respond();
      equal(this.$container.css('opacity'), "1");
      this.list.load({
        params: {
          foo: "foo"
        }
      });
      this.clock.tick(20);
      equal(this.$container.css('opacity'), "0.5");
      this.server.respond();
      return equal(this.$container.css('opacity'), "1");
    });
  });

}).call(this);
