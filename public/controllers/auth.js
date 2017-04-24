'use strict';

angular.module('areaBook.auth',[])
	.controller('authController', ['$rootScope','$scope','$location','$http', '$state', function($rootScope, $scope, $location, $http, $state) {
		
		$scope.signup = false;

		$scope.redirect = function() {
			if ($scope.signup) {
				setTimeout(function(){
					$scope.signup = false;
					setAttr('authForm', 'action', '/login')
					setAttr('signup', 'type', 'button');
					setAttr('login', 'type', 'submit');
				}, 10);
			} else {
				setTimeout(function(){
					$scope.signup = true;
					setAttr('authForm', 'action', '/signup');
					setAttr('signup', 'type', 'submit');
					setAttr('login', 'type', 'button')
				}, 10);
			}
		}

		function setAttr(id, attr, val) {
			document.getElementById(id).setAttribute(attr, val);
		};

	}]);