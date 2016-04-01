'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MealformCtrl
 * @description
 * # MealformCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MealformCtrl', function ($uibModalInstance, AuthService, MealFactory, $log, meal) {
    var self = this;
    self.meal = meal;
    self.errors = {};
    self.saving = false;

    self.close = function() {
      $uibModalInstance.dismiss('cancel');
    };

    self.save = function() {
      var callbackSuccess = function(meal) {
        $uibModalInstance.close(self.meal);
      };
      var callbackFailure = function(response) {
        self.saving = false;
        self.errors = response.data.errors;
      };

      self.saving = true;
      if(meal.id) {
        /* Updating exising meal */
        MealFactory.update({ 
          meal_id: meal.id, 
          user_id: meal.user_id
        }, self.meal).$promise.then(callbackSuccess, callbackFailure);
      } else {
        /* Creating new meal */
        var userId = AuthService.getCurrentUser().id;
        MealFactory.save({ user_id: userId }, { meal: self.meal })
          .$promise.then(callbackSuccess, callbackFailure);
      }
    };

    self.delete = function() {
      self.saving = true;
      MealFactory.delete({
        meal_id: meal.id,
        user_id: meal.user_id
      }).$promise.then(function(meal,b) {
        self.saving = false;
        $uibModalInstance.close(null);
      }, function(response) {
        self.saving = false;
      });
    };
  });
