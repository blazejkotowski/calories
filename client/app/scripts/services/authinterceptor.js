'use strict';

/**
 * @ngdoc service
 * @name clientApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AuthInterceptor', function ($q, $injector) {
    return {
      request: function(config) {
        var AuthToken = $injector.get("AuthToken");
        var auth_token = AuthToken.get();
        config.headers = config.headers || {};
        if(auth_token) {
          config.headers.Authorization = "Bearer " + auth_token;
        }
        return config || $q.when(config);
      },
      responseError: function(response) {
        return response || $q.when(response);
      }
    };
  });
