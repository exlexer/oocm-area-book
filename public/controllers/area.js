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



		$scope.showZone = function (id) {
			$scope.activeZone = $scope.activeZone !== id ? id : false;
		};


		$scope.showDistrict = function (id) {
			$scope.activeDistrict = $scope.activeDistrict !== id ? id : false;
		};

		$scope.showStake = function (id) {
			$scope.activeStake = $scope.activeStake !== id ? id : false;
		};		
		

    $scope.onDrag=function(data,evt){
    	$scope.changing = data.type;
    	console.log($scope.changing);
    }

    $scope.distDrop = function(data, evt, zoneId){
    	for (var k in $scope.districts) {
    		if($scope.districts[k].id = data.id) {
    			var id = $scope.districts[k].id
					$scope.districts[k].zoneId = zoneId;
		    	$scope.changed = true;
		    	changes.push(['/districts', {id : id, zoneId: zoneId, update: true}]);
    		}
    	}
		}

		$scope.save = function () {
			for (var i = 0; i < changes.length; i++) {
				var change = changes[i];
				console.log(change)
				$http.post(change[0], change[1]).then(function (resp) {
				})
			};
		}

		$scope.add = function() { $scope.adding = !$scope.adding; };

		$scope.addArea = function() {
			var types = ['/zones', '/districts', '/areas'];
			console.log($scope.newArea);
			$http.post(types[$scope.newArea.type], $scope.newArea).then(function(resp) {
				update();
				resetAdd();
			});
		};

		$scope.subset = function(active, type) {
			return function (val) {
				return val[type] == active;
			}
		}

		$scope.unassigned = function() {
			return function (val) {
				return !val.areaId;
			}
		}

	}]);
