'use strict';

/**
 * @ngdoc service
 * @name clientApp.MealFactory
 * @description
 * # MealFactory
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('MealFactory', function (api_base_url, $resource) {
    return $resource(api_base_url + '/users/:user_id/meals/:meal_id',
      { user_id: "@user_id", meal_id: "@id"}, { 
        'update':  { 
          'method': 'PUT', transformRequest: function(data, headers) {
            return JSON.stringify({ meal: data });
        }
      }}
    );
  });
