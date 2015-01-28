'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.version',
  'myApp.auth',
    'myApp.home',
    'myApp.profile'
]).
config(function($routeProvider, $httpProvider) {

  // check if user is connected
  var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
    // initialize a new promise
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user) {
      if (user !== '0') {
        $timeout(deferred.resolve, 0);
      } else {
        $rootScope.message = 'You need to log in.';
        $timeout(function() {deferred.reject();}, 0);
        $location.url('/login');
      }
    });

    return deferred.promise;
  };

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
          controller: 'HomeCtrl'
      })
      .when('/profile', {
          templateUrl: 'profile/profile.html',
          controller: 'ProfileCtrl',
          resolve: {
              loggedin: checkLoggedIn
          }
      })
      .when('/login', {
        templateUrl: 'auth/login.html',
        controller: 'AuthCtrl'
      })
      .otherwise({redirectTo: '/home'});
})
.run(function($rootScope, $http) {
  $rootScope.message = '';

  //logout function is available from any page
  $rootScope.logout = function() {
    rootScope.message = 'Logged out.';
    $http.post('/logout');
  };
});

app.controller('IndexCtrl', function($scope, $location, $anchorScroll) {
});
