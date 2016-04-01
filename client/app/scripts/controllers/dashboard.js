'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('DashboardCtrl', function ($q, AuthService, UserFactory, MealFactory, $uibModal, $route, $routeParams, $log) {
    var self = this;
    self.user = AuthService.getCurrentUser();

    var fetchingUser = $q.defer();

    $log.debug($route.current.data);
    if($route.current.data.admin) {
      var userid = $routeParams.user_id;
      UserFactory.get({ user_id: userid }).$promise.then(function(data) {
        self.user = new UserFactory(data.user);
        fetchingUser.resolve();
      });
    } else {
      fetchingUser.resolve();
    }

    self.meals = [];

    fetchingUser.promise.then(function() {
      var mealsResponse = MealFactory.get({ user_id: self.user.id }, function() {
        self.meals = mealsResponse.meals;  
      });
    });

    self.savingUser = false;
    self.savingMeal = false;

    self.errors = {};
    self.filters = { 
      dateStart: new Date(),
      dateEnd: new Date(),
      timeStart: new Date().setHours(0,0,0),
      timeEnd: new Date().setHours(23,59,0),
      applied: false
    };

    self.caloriesExceeded = function() {
      return self.todaysCalories() > self.user.expected_calories;
    };

    self.todaysCalories = function() {
      var todaysDate = new Date();
      return self.meals.reduce(function(previous, current) {
        var currentDate = new Date(current.consumption_date);
        if(currentDate.toDateString() == todaysDate.toDateString()) {
          previous += current.calories_number;
        }
        return previous;
      }, 0);
    };

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

    /* Filtering */
    self.setFilters = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/filtersform.html',
        controller: 'FiltersformCtrl',
        controllerAs: 'modal',
        size: 'md',
        resolve: {
          filters: function() {
            return self.filters;
          }
        }
      });

      modalInstance.result.then(function(filters) {
        /* Applying filters */
        self.filters = filters;
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
