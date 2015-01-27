'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.auth',
  'myApp.admin',
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
      .when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
      })
      .when('/login', {
        templateUrl: 'auth/login.html',
        controller: 'AuthCtrl'
      })
      .when('/admin', {
        templateUrl: 'admin/admin.html',
        controller: 'AdminCtrl',
        resolve: {
          loggedin: checkLoggedIn
        }
      })
      .otherwise({redirectTo: '/view1'});
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
