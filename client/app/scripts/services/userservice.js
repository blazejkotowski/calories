'use strict';

/**
 * @ngdoc service
 * @name clientApp.AuthToken
 * @description
 * # AuthToken
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AuthToken', function() {
    var authToken = null;
    return {
      get: function() {
        return authToken;
      },
      set: function(newToken) {
        authToken = newToken;
      }
    };
  });
