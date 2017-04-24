'use strict';

angular.module('areaBook.miss',[])
	.controller('missController', ['$scope','$http', function ($scope,$http) {
		 
		function update() {
			$http.get('/miss').then(function (resp) {
				$scope.data = resp.data;
			}, function() {});
		};
		update();

		$http.get('/areas').then(function(resp) {
			$scope.areas = {};
			for (var i = 0; i < resp.data.length; i++) {
				$scope.areas[resp.data[i].id] = resp.data[i];
			};
		}, function() {});	

		$scope.newMiss = {};

		$scope.adding = false;
		$scope.editing = false;

		$scope.edit = function(key) {
			if ($scope.editing === key) {
				$http.post('/miss', $scope.data[key]).then(function (resp) {
					update();
				})
				$scope.editing = false;
			} else {
				$scope.editing = key;
			}
		};

		$scope.add = function() {
			$scope.adding = !$scope.adding;
		};

		$scope.addMissionary = function() {
			$http.post('/miss', $scope.newMiss).then(function (resp) {
				update();
			}), function() {};
			$scope.newMiss = {};
		};
	}]);