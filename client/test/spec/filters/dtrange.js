'use strict';

describe('Filter: dtrange', function () {

  // load the filter's module
  beforeEach(module('clientApp'));

  // initialize a new instance of the filter before each test
  var dtrange;
  beforeEach(inject(function ($filter) {
    dtrange = $filter('dtrange');
  }));

  it('should return the input prefixed with "dtrange filter:"', function () {
    var text = 'angularjs';
    expect(dtrange(text)).toBe('dtrange filter: ' + text);
  });

});
