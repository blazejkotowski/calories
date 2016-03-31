'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
  ])
  .constant('AuthEvents', {
    loginSuccess: 'login_success',
    loginFailed: 'login_failed'
  })
  .constant('api_base_url', 'http://localhost:3000/api/v1')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SigninCtrl',
        controllerAs: 'signin'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
      })
      .otherwise({
        redirectTo: '/signin'
      });
  })
  .run(function($rootScope) {
    $rootScope.global_notifications = {
      errors: [],
      success: [],
      information: []
    };
  });
