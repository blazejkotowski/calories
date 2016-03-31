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
    self.currentMeal = null;

    var mealsResponse = MealFactory.get({ user_id: self.user.id }, function() {
      self.meals = mealsResponse.meals;  
    });

    self.setMeal = function(meal) {
      self.currentMeal = meal;
    };

    self.removeMeal = function() {
      var mealResource = new MealFactory(self.currentMeal);
      mealResource.$delete();
      var index = self.meals.indexOf(self.currentMeal);
      self.meals.splice(index, 1);
    };

    self.saveMeal = function() {
      var mealResource = new MealFactory(self.currentMeal);
      mealResource.$update();
    };

  });
