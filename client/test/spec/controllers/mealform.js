'use strict';

describe('Controller: MealformCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var MealformCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MealformCtrl = $controller('MealformCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MealformCtrl.awesomeThings.length).toBe(3);
  });
});
