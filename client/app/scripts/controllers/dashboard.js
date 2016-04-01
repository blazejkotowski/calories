'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DashboardCtrl', function (AuthService, UserFactory, MealFactory, $uibModal, $log) {
    var self = this;
    self.user = AuthService.getCurrentUser();
    self.meals = [];

    self.savingUser = false;
    self.savingMeal = false;

    self.errors = {};

    var mealsResponse = MealFactory.get({ user_id: self.user.id }, function() {
      self.meals = mealsResponse.meals;  
    });

    /* Managing meals */
    self.editMeal = function(meal) {
      var mealCopy = angular.copy(meal);
      self.openModal(meal, mealCopy);
    };

     /* Modal interaction */
    self.openModal = function(original, copy) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/mealform.html',
        controller: 'MealformCtrl',
        controllerAs: 'modal',
        size: 'sm',
        resolve: {
          meal: function() {
            return copy;
          }
        }
      });
      
      modalInstance.result.then(function(savedMeal) {
        if(savedMeal === null) {
          /* Delete performed */
          var index = self.meals.indexOf(original);
          self.meals.splice(index, 1);
        } else {
          /* Edit performed */
          angular.copy(savedMeal, original);
        }
      });
    };


    /* Managing user */
    self.saveSettings = function() {
      self.savingUser = true;
      UserFactory.update({ user_id: self.user.id }, self.user).$promise.then(
        function() {
          self.savingUser = false;
          self.errors.expected_calories = null;
        },
        function(response) {
          self.savingUser = false;
          if(response.data.errors && response.data.errors.expected_calories) {
            self.errors.expected_calories = response.data.errors.expected_calories[0];
          }
        }
      );
    };
  });
