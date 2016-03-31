'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SignupCtrl', function ($window, $location, $rootScope, AuthService) {
    var self = this;
    self.email = null;
    self.password = null;
    self.password_confirmation = null;
    self.name = null;
    self.expected_calories = 2000;
  self.errors = {};
    self.submit = function () {
      var params = {
        user: {
          email: self.email,
          password: self.password,
          password_confirmation: self.password_confirmation,
          name: self.name,
          expected_calories: self.expected_calories
        }
      };
      
      var deferred = AuthService.register(params);
      deferred.then(function() {
        $location.path("/signin");
        $rootScope.global_notifications.success.push("Now you can log in with your e-mail and password");
      }, function(errors) {
        /* Registration failed */
        self.password = self.password_confirmation = null;
        self.errors = errors;
      });
    };
  });
