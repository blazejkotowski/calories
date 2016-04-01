'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:FiltersformCtrl
 * @description
 * # FiltersformCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('FiltersformCtrl', function ($uibModalInstance, filters) {
    var self = this;

    self.filters = filters;

    self.dateFormat = "dd MMMM yyyy";
    self.dateStartPicker = { opened: false };
    self.dateEndPicker = { openeed: false };
    
    self.apply = function() {
      self.filters.applied = true;
      $uibModalInstance.close(self.filters);
    };

    self.cancel = function() {
      $uibModalInstance.close(self.filters);
    };

    self.pickDateStart = function() {
      self.dateStartPicker.opened = true;
    }

    self.pickDateEnd = function() {
      self.dateEndPicker.opened = true;
    }
  });