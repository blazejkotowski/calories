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
    'angular-storage',
    'ui.bootstrap'
  ])
  .constant('AuthEvents', {
    loginSuccess: 'login_success',
    loginFailed: 'login_failed',
    logout: 'logout'
  })
  .constant('api_base_url', 'http://localhost:3000/api/v1')
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SigninCtrl',
        controllerAs: 'signin',
        data: { 
          loggedIn: false,
          currentTab: 'signin'
        }
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup',
        data: { 
          loggedIn: false,
          currentTab: 'signup'
        }
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard',
        data: {
          loggedIn: true,
          admin: false,
          currentTab: 'dashboard'
        }
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin',
        data: {
          loggedIn: true,
          admin: true,
          currentTab: 'admin'
        }
      })
      .when('/signout', {
        data: {
          signout: true,
          loggedIn: true
        }
      })
      .otherwise({
        redirectTo: '/signin'
      });

      $httpProvider.interceptors.push('AuthInterceptor');
  })
  .run(function($log,$route, $rootScope, $location, AuthService, AuthEvents) {
    $rootScope.global_notifications = {
      errors: [],
      success: [],
      information: []
    };

    $rootScope.currentUser = AuthService.getCurrentUser();

    $rootScope.$on(AuthEvents.loginSuccess, function() {
      $rootScope.currentUser = AuthService.getCurrentUser();
    });
    $rootScope.$on(AuthEvents.logout, function() {
      $rootScope.currentUser = AuthService.getCurrentUser();
    });

    $rootScope.$route = $route;

    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if(next.data && next.data.loggedIn) {
        if(!AuthService.getCurrentUser()) {
          $location.path('/signin');
        }

        else if(next.data.admin && !AuthService.getCurrentUser().isAdmin()) {
          $location.path('/dashboard');
        }

        else if(next.data.signout) {
          AuthService.logout();
          $rootScope.global_notifications.information.push('Good bye.');
          $location.path('/signin');
        }
      } else {
        if(AuthService.getCurrentUser()) {
          $location.path('/dashboard');
        }
      }
    });
  });
