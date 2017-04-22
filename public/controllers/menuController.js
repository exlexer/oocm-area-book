'use strict';

angular.module('antiPad.menu',[])
	.controller('menuController', ['$scope','$rootScope','$state','$http', function($scope, $rootScope, $state, $http) {
		$scope.showTab = function(view) {
			$state.go('app.menu.' + view);
		};
		
		$http.get('/user').then(function (resp) {

			$rootScope.leadership = !!resp.data.leadership ? resp.data.leadership : 'miss';
			$rootScope.areaId = resp.data.areaId;
			$rootScope.name = resp.data.name;
			$scope.menuCreate = function(id) {
				if(!!leadership[$rootScope.leadership][id]) {
					return true;
				}
				return false;
			}
    });

   	$scope.notifyServiceOnChage = function(){
  	};

		$rootScope.areaId = 80;

		var leadership = {
			pres:{
				0:true,
				1:true,
				2:true,
				4:true
			},
			asst: {
				0:true,
				1:true,
				2:true,
				3:true
			},
			zone: {
				2:true,
				3:true
			},
			dist: {
				2:true,
				3:true
			},
			miss: {
				2:true,
				3:true
			},
			estl: {
				2:true,
				3:true
			}
		}


	}]);