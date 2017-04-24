'use strict';

angular.module('areaBook.areaBook',[])
	.controller('areaBookController', ['$scope','$rootScope','$http','$state','$stateParams', function($scope, $rootScope, $http, $state, $stateParams) {
		
		function update() {
			$http.get('/inv').then(function (resp) {
				$scope.inv = resp.data;
			}, function() {});
			$http.get('/rc').then(function (resp) {
				$scope.rc = resp.data;
			}, function() {});
			$http.get('/lesson').then(function (resp) {
				$scope.lessons = resp.data;
			}, function() {});
		};
		update();

		$scope.openInv = function (id) {
			$scope.focus = true;
			$scope.current = $scope.inv[id];
		}
		$scope.openRc = function (id) {
			$scope.focus = true;
			$scope.current = $scope.rc[id];
		}

	}]);