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
    'angular-storage'
  ])
  .constant('AuthEvents', {
    loginSuccess: 'login_success',
    loginFailed: 'login_failed'
  })
  .constant('api_base_url', 'http://localhost:3000/api/v1')
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SigninCtrl',
        controllerAs: 'signin',
        data: { loggedIn: false }
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup',
        data: { loggedIn: false }
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard',
        data: {
          loggedIn: true,
          admin: false
        }
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin',
        data: {
          loggedIn: true,
          admin: true
        }
      })
      .otherwise({
        redirectTo: '/signin'
      });

      $httpProvider.interceptors.push('AuthInterceptor');
  })
  .run(function($rootScope, $location, AuthService, AuthEvents) {
    $rootScope.global_notifications = {
      errors: [],
      success: [],
      information: []
    };

    $rootScope.$on(AuthEvents.loginSuccess, function() {
      $rootScope.currentUser = AuthService.getCurrentUser();
    });

    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if(next.data.loggedIn) {
        if(!AuthService.getCurrentUser()) {
          $location.path('/signin');
        }
        else if(next.data.admin && !AuthService.getCurrentUser().isAdmin()) {
          $location.path('/dashboard');
        }
      } else {
        if(AuthService.getCurrentUser()) {
          $location.path('/dashboard');
        }
      }
    });
  });
