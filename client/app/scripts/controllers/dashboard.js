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

    self.savingUser = false;
    self.savingMeal = false;

    self.errors = {}

    var mealsResponse = MealFactory.get({ user_id: self.user.id }, function() {
      self.meals = mealsResponse.meals;  
    });

    /* Managing meals */
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

    /* Managing user */
    self.saveSettings = function() {
      self.savingUser = true;
      UserFactory.update({ user_id: self.user.id }, self.user).$promise.then(
        function(a,b) {
          self.savingUser = false;
          self.errors['expected_calories'] = null;
        },
        function(response) {
          self.savingUser = false;
          if(response.data.errors && response.data.errors.expected_calories) {
            self.errors.expected_calories = response.data.errors.expected_calories[0];
          }
        }
      );
    }

  });
