'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SigninCtrl
 * @description
 * # SigninCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SigninCtrl', function (AuthService, AuthToken) {
    var self = this;
    self.email = null;
    self.password = null;
    self.errors = [];
    self.submit = function () {
      var deferred = AuthService.login(self.email, self.password);
      deferred.then(function(user) {
        self.errors = null;
      }, function(errors) {
        self.errors = errors;
      });
    };
  });
