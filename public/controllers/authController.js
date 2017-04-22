'use strict';

angular.module('antiPad.auth',[])
	.controller('authController', ['$rootScope','$scope','$location','$http', '$state', function($rootScope, $scope, $location, $http, $state) {
		
		$scope.req = {};
		
		$scope.login = function() {
			$http.post('/login', $scope.req).then(function(resp) {});
		};

		$scope.signup = function() {
			$http.post('/signup', $scope.req).then(function(resp) {});
		};

		$scope.signupRed = function() {
			$state.go('signup');
		}
	}]);