'use strict';

/**
 * @ngdoc service
 * @name clientApp.UserFactory
 * @description
 * # UserFactory
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('UserFactory', function (api_base_url, $resource) {
    var url = api_base_url + "/users/:user_id";
    var User =  $resource(url,
      { $user_id: "@id" },
      { update: { method: "PUT" } }
    );

    User.prototype.isAdmin = function() {
      return this.admin;
    };

    return User;
  });
