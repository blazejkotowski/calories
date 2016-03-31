'use strict';

/**
 * @ngdoc service
 * @name clientApp.AuthService
 * @description
 * # AuthService
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AuthService', ['$http', '$q', '$rootScope', 'AuthToken', 'api_base_url', function ($http, $q, $rootScope, AuthToken, api_base_url) {
    return {
      login: function(email, password) {
        var deferred = $q.defer();
        $http.post(api_base_url + "/authenticate", {
          email: email,
          password: password
        }).then(function(response) {
          var data = response.data || {};
          AuthToken.set(data.auth_token);
          deferred.resolve(data.user);
        }, function(response) {
          response = response || {};
          var data = response.data || {};
          deferred.reject(data.errors || null);
        });
        return deferred.promise;
      },
      register: function(params) {
        var deferred = $q.defer();
        $http.post(api_base_url + "/users", params)
          .then(function(response) {
            deferred.resolve();
          }, function(response) {
            response = response || {};
            var data = response.data || {};
            deferred.reject(data.errors || null);
          });
        return deferred.promise;
      }
    };
  }]);
