'use strict';

angular.module('areaBook.area',[])
	.controller('areaController', ['$scope','$http','$filter', function($scope,$http,$filter) {
		
		$scope.activeZone = false;
		$scope.activeDistrict = false;
		$scope.activeStake = false;
		$scope.districts = [];
		$scope.areas = [];
		$scope.updating = [undefined, undefined];
		$scope.changed = false;
		var changes = [];

		function resetAdd() {
			$scope.adding = false;
			$scope.newArea = {};
		};
		resetAdd();


		// function to update all Zones, Districts, Areas, Stakes, and Units ran at startup
		function update() {
			$http.get('/zones').then(function (resp) { $scope.zones = resp.data; });
			$http.get('/districts').then(function (resp) { $scope.districts = resp.data; });
			$http.get('/areas').then(function (resp) { $scope.areas = resp.data; });
			$http.get('/miss').then(function (resp) { $scope.miss = resp.data; });
			$http.get('/stakes').then(function (resp) { $scope.stakes = resp.data; });
			$http.get('/units').then(function (resp) { $scope.units = resp.data; });
		};
		update();

		$scope.editMiss = function (id, key) {
			$scope.miss[key].newAreaId = $scope.miss[key].areaId
			$scope.editing = id;
		};

		$scope.saveMiss = function (val) {
			val.areaId = parseInt(val.newAreaId);
			$http.post('/miss', val).then(function (resp) {
					update();
					$scope.editing = false;
			});
		};


		$scope.showZone = function (id) {
			$scope.activeZone = $scope.activeZone !== id ? id : false;
		};

		$scope.showDistrict = function (id) {
			$scope.activeDistrict = $scope.activeDistrict !== id ? id : false;
		};

		$scope.showStake = function (id) {
			$scope.activeStake = $scope.activeStake !== id ? id : false;
		};		
		

    $scope.exportStake = function (id) {
    	$http.post('/exportStake', {id: id}).then(function (resp) {
    		window.open(resp.data.url);
    	})
    };

		$scope.save = function () {
			for (var i = 0; i < changes.length; i++) {
				var change = changes[i];
				$http.post(change[0], change[1]).then(function (resp) {
				})
			};
		}

		$scope.add = function() { $scope.adding = !$scope.adding; };

		$scope.addArea = function() {
			var types = ['/zones', '/districts', '/areas'];
			$http.post(types[$scope.newArea.type], $scope.newArea).then(function(resp) {
				update();
				resetAdd();
			});
		};

		$scope.subset = function(active, type) {
			return function (val) {
				return val[type] === active;
			}
		}

		$scope.unassigned = function() {
			return function (val) {
				return val.areaId === undefined || val.areaId === null;
			}
		}

	}]);
