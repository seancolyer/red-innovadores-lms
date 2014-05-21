(function() {

  define(['Backbone', 'underscore', 'compiled/models/Role', 'compiled/models/Account', 'compiled/util/BaseRoleTypes'], function(Backbone, _, Role, Account, BASE_ROLE_TYPES) {
    module('RoleModel', {
      setup: function() {
        this.account = new Account({
          id: 4
        });
        this.role = new Role({
          account: this.account
        });
        return this.server = sinon.fakeServer.create();
      },
      teardown: function() {
        this.server.restore();
        this.role = null;
        return this.account_id = null;
      }
    });
    test('the id gets set to the role name when role is created', 1, function() {
      var _this = this;
      this.role.fetch({
        success: function() {
          return equal(_this.role.get('id'), "existingRole", "Role id should equal the roles name");
        }
      });
      return this.server.respond('GET', this.role.url(), [
        200, {
          'Content-Type': 'application/json'
        }, JSON.stringify({
          "role": "existingRole"
        })
      ]);
    });
    return test('generates the correct url for existing and non-existing roles', 2, function() {
      var _this = this;
      equal(this.role.url(), "/api/v1/accounts/" + (this.account.get('id')) + "/roles", "non-existing role url");
      this.role.fetch({
        success: function() {
          return equal(_this.role.url(), "/api/v1/accounts/" + (_this.account.get('id')) + "/roles/existingRole", "existing role url");
        }
      });
      return this.server.respond('GET', this.role.url(), [
        200, {
          'Content-Type': 'application/json'
        }, JSON.stringify({
          "role": "existingRole",
          "account": this.account
        })
      ]);
    });
  });

}).call(this);
