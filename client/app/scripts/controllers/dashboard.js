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

    self.addMeal = function() {
      var newMeal = {
        consumption_time: new Date(),
        consumption_date: new Date()
      };
      self.openModal({}, newMeal);
    };

    self.mealOrderValue = function(meal) {
      var date = new Date(meal.consumption_date);
      var time = new Date(meal.consumption_time);
      date.setHours(time.getHours());
      date.setMinutes(time.getMinutes());
      return -date;
    };

     /* Modal interaction */
    self.openModal = function(original, copy) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/mealform.html',
        controller: 'MealformCtrl',
        controllerAs: 'modal',
        size: 'lg',
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
          /* Save performed */
          $log.debug("saved time: ", savedMeal.consumption_time);
          $log.debug("\noriginal time: ", original.consumption_time);
          if(original.id) {
            /* Update */
            angular.copy(savedMeal, original);
          } else {
            /* Create */
            self.meals.push(savedMeal);
          }
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
