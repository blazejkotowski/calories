'use strict';

describe('Service: MealFactory', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var MealFactory;
  beforeEach(inject(function (_MealFactory_) {
    MealFactory = _MealFactory_;
  }));

  it('should do something', function () {
    expect(!!MealFactory).toBe(true);
  });

});
