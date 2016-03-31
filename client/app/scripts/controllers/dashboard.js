'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DashboardCtrl', function (AuthService, UserFactory, MealFactory, $log) {
    var self = this;
    self.user = AuthService.getCurrentUser();
    self.meals = [];
    var mealsResponse = MealFactory.get({ user_id: self.user.id }, function() {
      self.meals = mealsResponse.meals;  
    });
  });
