'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AdminCtrl', function ($window, UserFactory, $location) {
    var self = this;

    self.users = []; 

    UserFactory.query().$promise.then(function(data) {
      self.users = data.users;
    });

    self.userDashboard = function(user) {
      $location.path('/admin/users/' + user.id);
    };

    self.deleteUser = function(user) {
      var confirmed = $window.confirm('Are you sure?');
      if(confirmed) {
        UserFactory.delete({ user_id: user.id }).$promise.then(function() {
          var index = self.users.indexOf(user);
          self.users.splice(index, 1);
        });
      }
    };

  });
