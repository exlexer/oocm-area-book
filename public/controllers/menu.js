'use strict';

angular.module('areaBook.menu',[])
	.controller('menuController', ['$scope','$rootScope','$state','$http', function($scope, $rootScope, $state, $http) {
		$scope.showTab = function(view) {
			$state.go('app.menu.' + view);
		};
		
		$scope.menu = []

		var area = ['Areas', 'areas'],
				total = ['Totals', 'totals'],
				miss = ['Missionaries', 'miss'],
				areaBook = ['Area Book', 'areaBook'];

		var leadership = {
			pres : [area, total, miss],
			asst : [area, total, areaBook],
			zone : [total, areaBook],
			dist : [total, areaBook],
			estl : [total, areaBook],
			miss : [total, areaBook]
		};

		$http.get('/user').then(function (resp) {

			$rootScope.leadership = !!resp.data.leadership ? resp.data.leadership : 'miss';
			$rootScope.areaId = resp.data.areaId;
			$rootScope.name = resp.data.name;
			$scope.menu = leadership[$rootScope.leadership];

    });
	}]);