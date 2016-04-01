'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SigninCtrl
 * @description
 * # SigninCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SigninCtrl', function ($rootScope, AuthService, $location, $log) {
    var self = this;
    self.email = null;
    self.password = null;
    self.errors = [];
    self.notifications = $rootScope.getNotifications();

    self.submit = function () {
      var deferred = AuthService.login(self.email, self.password);
      deferred.then(function() {
        var path = AuthService.getCurrentUser().isAdmin() ? '/admin' : '/dashboard';
        $location.path(path);
      }, function(errors) {
        self.notifications.errors = self.notifications.errors.concat(errors);
      });
    };
  });
