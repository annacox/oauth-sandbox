'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.version',
  'myApp.login',
  'myApp.home',
  'myApp.profile'
]).
config(function($routeProvider, $httpProvider) {

  var access = routingConfig.accessLevels;

  // add an interceptor for AJAX errors
  $httpProvider.responseInterceptors.push(function($q, $location) {
    return function(promise) {
      return promise.then(
          // success
          function(response) {
            return response;
          },
          // error
          function(response) {
            if (response.status === 401) {
              $location.url('/login');
            }
            return $q.reject(response);
          }
      );
    }
  });

  // define routes
  $routeProvider
      .when('/home', {
          templateUrl: 'home/home.html',
          controller: 'HomeCtrl',
          access: access.anon
      })
      .when('/profile', {
          templateUrl: 'profile/profile.html',
          controller: 'ProfileCtrl',
          access: access.user
      })
      .when('/login', {
          templateUrl: 'login/login.html',
          controller: 'LoginCtrl',
          access: access.anon
      })
      .otherwise({redirectTo: '/home', access: access.anon});
})
.run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if (!AuthService.authorize(next.access)) {
            if (AuthService.isLoggedIn()) {
                $location.path('/');
            } else {
                $location.path('/login');
            }
        }
    })
}]);

app.controller('IndexCtrl', function($scope, $location, $anchorScroll) {
});
