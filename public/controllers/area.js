'use strict';

angular.module('areaBook.area',[])
	.controller('areaController', ['$scope','$http', function($scope,$http) {
		
		$scope.activeZone = false;
		$scope.activeDistrict = false;
		$scope.activeStake = false;
		$scope.districts = [];
		$scope.areas = [];
		$scope.updating = [undefined, undefined];
		$scope.changed = false;
		var changes = [];

		function reset() {
			$scope.types = undefined;
			$scope.adding = false;
			$scope.newArea = {};
		};
		reset();


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


		$scope.filter = function (arr, active, id) {
			var ret = [];

			for (var i = 0; i < arr.length; i++) {
				if(arr[i][id] === active) {
					ret.push(arr[i]);
				};
			}

			return ret;
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
    			console.log(changes);
    		}
    	}
		}

		$scope.save = function () {
			for (var i = 0; i < changes.length; i++) {
				var change = changes[i];
				console.log(change)
				$http.post(change[0], change[1]).then(function (resp) {
					console.log(resp);
				})
			};
		}

		$scope.add = function() { $scope.adding = !$scope.adding; };

		$scope.addArea = function() {
			var types = ['/zones', '/districts', '/areas'];
					$http.post(types[$scope.types], $scope.newArea).then(function(resp) {
					update();
					reset();
			}), function() {};
		};
	}]);