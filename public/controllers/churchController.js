'use strict';

angular.module('antiPad.church',[])
	.controller('churchController', ['$scope','$http', function($scope,$http) {


		function update() {
			$http.get('/units').then(function(resp) {
				$scope.units = resp.data;
				}, function() {});
		};
		update();

		$http.get('/stakes').then(function(resp) {
			$scope.stakes = resp.data;
			}, function() {});

		$scope.activeStake = false;

		$scope.show = function (id) {
			if ($scope.activeStake !== id) {
				$scope.activeStake = id;
			} else{
				$scope.activeStake = false;
			};
		};
		

		$scope.filtered = function (obj) {
			var len = Object.keys(obj).length;
			var o = {}

			for (var i = 0; i < len; i++) {
				if(obj[i].stakeId === $scope.activeStake) {
					o[i] = obj[i];
				};
			}
			return o;
		}

		$scope.save = function(del) {
			if(del) {
				$http.post('/unitUpdate', { del:true, id:$scope.current.id} ).then(function(resp) {
					$scope.current = {};
					$scope.activeStake = false;
					update();
				}), function() {};
			} else {
				$http.post('/unitUpdate', $scope.current ).then(function(resp) {
					$scope.current = {};
					$scope.activeStake = false;
					update();
				}), function() {};
			}
		};

		$scope.newUnit = {};
		$scope.adding = false;

		$scope.add = function() {
			$scope.adding = !$scope.adding;
		};

		$scope.addUnit = function() {
			$http.post('/units',$scope.newUnit).then(function(resp) {
				update();
				$scope.newUnit = {};
			}), function() {};

		};
	}]);