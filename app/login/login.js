'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {

    }])

    .controller('LoginCtrl', ['$scope', '$window', function($scope, $window) {
        $scope.login = function(provider) {
            $window.location.href = '/auth/' + provider;
        };
    }]);