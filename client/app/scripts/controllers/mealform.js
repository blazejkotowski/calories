'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MealformCtrl
 * @description
 * # MealformCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MealformCtrl', function ($uibModalInstance, MealFactory, $log, meal) {
    var self = this;
    self.meal = meal;
    self.errors = {};
    self.saving = false;

    self.close = function() {
      $uibModalInstance.dismiss('cancel');
    };

    self.save = function() {
      self.saving = true;
      MealFactory.update({ 
        meal_id: meal.id, 
        user_id: meal.user_id
      }, self.meal).$promise.then(function(meal) {
        $uibModalInstance.close(self.meal);
      }, function(response) {
        self.saving = false;
        self.errors = response.data.errors;
      });
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
