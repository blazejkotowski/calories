'use strict';

/**
 * @ngdoc service
 * @name clientApp.AuthToken
 * @description
 * # AuthToken
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AuthToken', function ($cookies) {
    var auth_token = $cookies.get('auth_token');
    return {
      get: function() {
        return auth_token;
      },
      set: function(new_token) {
        var exp = new Date().getDate() + 1;
        auth_token = new_token;
        $cookies.put(auth_token, { expires: exp });
      }
    };
  });
