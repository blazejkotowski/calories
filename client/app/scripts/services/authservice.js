'use strict';

/**
 * @ngdoc service
 * @name clientApp.AuthService
 * @description
 * # AuthService
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AuthService', 
    ['$log', '$http', '$q', '$rootScope', 'AuthEvents', 'UserFactory', 'api_base_url', 'store',
     function ($log, $http, $q, $rootScope, AuthEvents, UserFactory, api_base_url, store) {

    var authToken = null;
    var currentUser = null;

    return {
      login: function(email, password) {
        var deferred = $q.defer();
        $http.post(api_base_url + "/authenticate", {
          email: email,
          password: password
        }).then(function(response) {
          var data = response.data || {};

          authToken = data.auth_token;
          store.set('authToken', authToken);
          currentUser = data.user;
          store.set('currentUser', currentUser);

          $rootScope.$broadcast(AuthEvents.loginSuccess);
          deferred.resolve();
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
      },

      logout: function() {
        store.set('currentUser', null);
        store.set('authToken', null);
        authToken = null;
        currentUser = null;
        $rootScope.$broadcast(AuthEvents.logout);
      },

      getCurrentUser: function() {
        if(!currentUser) {
          currentUser = store.get('currentUser');
        }
        if(!currentUser) {
          return null;
        }
        return new UserFactory(currentUser);
      },

      getAuthToken: function() {
        if(!authToken) {
          authToken = store.get('authToken');
        }
        return authToken;
      },
    };
  }]);
