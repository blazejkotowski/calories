'use strict';

/**
 * @ngdoc service
 * @name clientApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AuthInterceptor', function ($q, $injector, $log) {
    return {
      request: function(config) {
        var UserService = $injector.get("AuthService");
        var auth_token = UserService.getAuthToken();
        config.headers = config.headers || {};
        if(auth_token) {
          config.headers.Authorization = "Bearer " + auth_token;
        }
        return config || $q.when(config);
      },
      responseError: function(response) {
        var AuthService = $injector.get('AuthService');
        AuthService.logout();
        return $q.reject(response);
      }
    };
  });
